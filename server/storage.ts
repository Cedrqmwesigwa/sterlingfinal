import {
  users,
  projects,
  products,
  orders,
  orderItems,
  deposits,
  inquiries,
  chatHistory,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Deposit,
  type InsertDeposit,
  type Inquiry,
  type InsertInquiry,
  type ChatHistory,
  type InsertChatHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Project operations
  getProjects(limit?: number, featured?: boolean): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project>;
  
  // Product operations
  getProducts(category?: string, featured?: boolean, limit?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Order operations
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order>;
  
  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Deposit operations
  getDeposits(userId?: string, projectId?: number): Promise<Deposit[]>;
  getDeposit(id: number): Promise<Deposit | undefined>;
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  updateDeposit(id: number, updates: Partial<InsertDeposit>): Promise<Deposit>;
  
  // Inquiry operations
  getInquiries(userId?: string, status?: string): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: number, updates: Partial<InsertInquiry>): Promise<Inquiry>;
  
  // Chat history operations
  getChatHistory(userId: string, sessionId?: string): Promise<ChatHistory[]>;
  createChatHistory(chatHistory: InsertChatHistory): Promise<ChatHistory>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Project operations
  async getProjects(limit?: number, featured?: boolean): Promise<Project[]> {
    let query = db.select().from(projects);
    
    if (featured !== undefined) {
      query = query.where(eq(projects.featured, featured));
    }
    
    query = query.orderBy(desc(projects.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  // Product operations
  async getProducts(category?: string, featured?: boolean, limit?: number): Promise<Product[]> {
    let query = db.select().from(products);
    
    const conditions = [];
    if (category) {
      conditions.push(eq(products.category, category));
    }
    if (featured !== undefined) {
      conditions.push(eq(products.featured, featured));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(products.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        or(
          like(products.name, `%${query}%`),
          like(products.description, `%${query}%`),
          like(products.category, `%${query}%`)
        )
      )
      .orderBy(desc(products.createdAt));
  }

  // Order operations
  async getOrders(userId?: string): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (userId) {
      query = query.where(eq(orders.userId, userId));
    }
    
    return await query.orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .orderBy(desc(orderItems.createdAt));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Deposit operations
  async getDeposits(userId?: string, projectId?: number): Promise<Deposit[]> {
    let query = db.select().from(deposits);
    
    const conditions = [];
    if (userId) {
      conditions.push(eq(deposits.userId, userId));
    }
    if (projectId) {
      conditions.push(eq(deposits.projectId, projectId));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(deposits.createdAt));
  }

  async getDeposit(id: number): Promise<Deposit | undefined> {
    const [deposit] = await db.select().from(deposits).where(eq(deposits.id, id));
    return deposit;
  }

  async createDeposit(deposit: InsertDeposit): Promise<Deposit> {
    const [newDeposit] = await db.insert(deposits).values(deposit).returning();
    return newDeposit;
  }

  async updateDeposit(id: number, updates: Partial<InsertDeposit>): Promise<Deposit> {
    const [updatedDeposit] = await db
      .update(deposits)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deposits.id, id))
      .returning();
    return updatedDeposit;
  }

  // Inquiry operations
  async getInquiries(userId?: string, status?: string): Promise<Inquiry[]> {
    let query = db.select().from(inquiries);
    
    const conditions = [];
    if (userId) {
      conditions.push(eq(inquiries.userId, userId));
    }
    if (status) {
      conditions.push(eq(inquiries.status, status));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async updateInquiry(id: number, updates: Partial<InsertInquiry>): Promise<Inquiry> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }

  // Chat history operations
  async getChatHistory(userId: string, sessionId?: string): Promise<ChatHistory[]> {
    let query = db.select().from(chatHistory).where(eq(chatHistory.userId, userId));
    
    if (sessionId) {
      query = query.where(
        and(
          eq(chatHistory.userId, userId),
          eq(chatHistory.sessionId, sessionId)
        )
      );
    }
    
    return await query.orderBy(desc(chatHistory.createdAt));
  }

  async createChatHistory(chatHistoryData: InsertChatHistory): Promise<ChatHistory> {
    const [newChatHistory] = await db.insert(chatHistory).values(chatHistoryData).returning();
    return newChatHistory;
  }
}

export const storage = new DatabaseStorage();
