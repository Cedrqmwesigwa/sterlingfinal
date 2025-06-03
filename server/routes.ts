import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
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
  insertOrderItemSchema,
  insertDepositSchema,
  insertInquirySchema,
  insertChatHistorySchema 
} from "@shared/schema";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_fake", {
  apiVersion: "2024-06-20",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Public routes - no authentication required
  
  // Get projects
  app.get('/api/projects', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
      const projects = await storage.getProjects(limit, featured);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Get products
  app.get('/api/products', async (req, res) => {
    try {
      const category = req.query.category as string;
      const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const products = await storage.getProducts(category, featured, limit);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Search products
  app.get('/api/products/search/:query', async (req, res) => {
    try {
      const query = req.params.query;
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Create inquiry (contact form)
  app.post('/api/inquiries', async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry({
        ...validatedData,
        status: 'pending'
      });
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // AI Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      const response = await generateChatResponse(message, context);
      res.json({ response });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // AI Project Estimate
  app.post('/api/estimate', async (req, res) => {
    try {
      const { projectType, description, size, location, timeline } = req.body;
      const estimate = await generateProjectEstimate({
        projectType,
        description,
        size,
        location,
        timeline
      });
      res.json(estimate);
    } catch (error) {
      console.error("Error generating estimate:", error);
      res.status(500).json({ message: "Failed to generate estimate" });
    }
  });

  // AI Product Recommendations
  app.post('/api/recommendations', async (req, res) => {
    try {
      const { projectDescription, budget } = req.body;
      const recommendations = await generateProductRecommendations(projectDescription, budget);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // AI Optimal Deposit Calculation
  app.post('/api/deposit-calculation', async (req, res) => {
    try {
      const { projectValue, timeline, riskLevel, clientProfile } = req.body;
      const calculation = await calculateOptimalDeposit({
        projectValue,
        timeline,
        riskLevel,
        clientProfile
      });
      res.json(calculation);
    } catch (error) {
      console.error("Error calculating deposit:", error);
      res.status(500).json({ message: "Failed to calculate optimal deposit" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Create deposit payment
  app.post('/api/deposits', async (req, res) => {
    try {
      const validatedData = insertDepositSchema.parse(req.body);
      const deposit = await storage.createDeposit({
        ...validatedData,
        status: 'pending'
      });
      res.status(201).json(deposit);
    } catch (error) {
      console.error("Error creating deposit:", error);
      res.status(500).json({ message: "Failed to create deposit" });
    }
  });

  // Get deposits
  app.get('/api/deposits', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const deposits = await storage.getDeposits(userId, projectId);
      res.json(deposits);
    } catch (error) {
      console.error("Error fetching deposits:", error);
      res.status(500).json({ message: "Failed to fetch deposits" });
    }
  });

  // Create order
  app.post('/api/orders', async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder({
        ...validatedData,
        status: 'pending'
      });
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get orders
  app.get('/api/orders', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}