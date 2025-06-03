import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import Stripe from "stripe";
import { 
  generateProjectEstimate, 
  generateProductRecommendations, 
  generateChatResponse, 
  calculateOptimalDeposit 
} from "./openai";
import { 
  insertProjectSchema, 
  insertProductSchema, 
  insertOrderSchema, 
  insertDepositSchema, 
  insertInquirySchema,
  insertChatHistorySchema 
} from "@shared/schema";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_fake", {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Projects routes
  app.get('/api/projects', async (req, res) => {
    try {
      const { featured, limit } = req.query;
      const projects = await storage.getProjects(
        limit ? parseInt(limit as string) : undefined,
        featured === 'true'
      );
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({
        ...validatedData,
        userId: req.user?.claims?.sub
      });
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Products routes
  app.get('/api/products', async (req, res) => {
    try {
      const { category, featured, limit, search } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else {
        products = await storage.getProducts(
          category as string,
          featured === 'true',
          limit ? parseInt(limit as string) : undefined
        );
      }
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Orders routes
  app.get('/api/orders', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder({
        ...validatedData,
        userId: req.user?.claims?.sub
      });
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Deposits routes
  app.get('/api/deposits', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const deposits = await storage.getDeposits(userId);
      res.json(deposits);
    } catch (error) {
      console.error("Error fetching deposits:", error);
      res.status(500).json({ message: "Failed to fetch deposits" });
    }
  });

  app.post('/api/deposits', async (req, res) => {
    try {
      const validatedData = insertDepositSchema.parse(req.body);
      const deposit = await storage.createDeposit({
        ...validatedData,
        userId: req.user?.claims?.sub || null
      });
      res.status(201).json(deposit);
    } catch (error) {
      console.error("Error creating deposit:", error);
      res.status(500).json({ message: "Failed to create deposit" });
    }
  });

  // Inquiries routes
  app.post('/api/inquiries', async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry({
        ...validatedData,
        userId: req.user?.claims?.sub || null
      });
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // AI Routes
  app.post('/api/ai/estimate', async (req, res) => {
    try {
      const { type, description, location, size, specifications } = req.body;
      const estimate = await generateProjectEstimate({
        type,
        description,
        location,
        size,
        specifications
      });
      res.json(estimate);
    } catch (error) {
      console.error("Error generating estimate:", error);
      res.status(500).json({ message: "Failed to generate estimate" });
    }
  });

  app.post('/api/ai/recommendations', async (req, res) => {
    try {
      const { projectDescription, budget } = req.body;
      const recommendations = await generateProductRecommendations(projectDescription, budget);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      const userId = req.user?.claims?.sub;
      
      // Get recent chat history for context
      let chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
      if (userId && sessionId) {
        const history = await storage.getChatHistory(userId, sessionId);
        chatHistory = history.slice(-5).map(h => [
          { role: 'user' as const, content: h.message },
          { role: 'assistant' as const, content: h.response }
        ]).flat();
      }

      const response = await generateChatResponse(message, chatHistory);

      // Save chat history if user is authenticated
      if (userId && sessionId) {
        await storage.createChatHistory({
          userId,
          sessionId,
          message,
          response,
          messageType: 'general'
        });
      }

      res.json({ response });
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.status(500).json({ message: "Failed to generate chat response" });
    }
  });

  app.post('/api/ai/deposit-calculator', async (req, res) => {
    try {
      const { type, budget, complexity, timeline } = req.body;
      const calculation = await calculateOptimalDeposit({
        type,
        budget: parseFloat(budget),
        complexity,
        timeline
      });
      res.json(calculation);
    } catch (error) {
      console.error("Error calculating deposit:", error);
      res.status(500).json({ message: "Failed to calculate deposit" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd", paymentMethodTypes = ["card"] } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method_types: paymentMethodTypes,
        metadata: {
          source: 'sterling_contractors'
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Mobile Money webhook placeholder (would integrate with MTN/Airtel APIs)
  app.post("/api/mobile-money/webhook", async (req, res) => {
    try {
      const { transactionId, amount, status, phoneNumber } = req.body;
      
      // This would integrate with actual mobile money APIs
      // For now, just log the webhook data
      console.log("Mobile Money Webhook:", { transactionId, amount, status, phoneNumber });
      
      res.json({ received: true });
    } catch (error) {
      console.error("Error processing mobile money webhook:", error);
      res.status(500).json({ message: "Failed to process mobile money payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
