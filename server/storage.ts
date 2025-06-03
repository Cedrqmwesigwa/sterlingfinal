import {
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

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private products: Map<number, Product> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();
  private deposits: Map<number, Deposit> = new Map();
  private inquiries: Map<number, Inquiry> = new Map();
  private chatHistory: Map<number, ChatHistory> = new Map();
  
  private nextProjectId = 1;
  private nextProductId = 1;
  private nextOrderId = 1;
  private nextOrderItemId = 1;
  private nextDepositId = 1;
  private nextInquiryId = 1;
  private nextChatId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Sample projects
    const sampleProjects: Project[] = [
      {
        id: 1,
        title: "Modern Office Building",
        description: "Complete construction of a 5-story office building with modern amenities",
        category: "Commercial",
        status: "Completed",
        budget: "$2,500,000",
        location: "Downtown Sterling",
        imageUrl: "/api/placeholder/600/400",
        featured: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-06-30")
      },
      {
        id: 2,
        title: "Residential Complex",
        description: "20-unit luxury residential complex with parking and amenities",
        category: "Residential",
        status: "In Progress",
        budget: "$3,200,000",
        location: "Sterling Heights",
        imageUrl: "/api/placeholder/600/400",
        featured: true,
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-12-01")
      }
    ];

    // Sample products
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Professional Hammer Set",
        description: "High-quality hammer set for professional construction work",
        category: "Tools",
        price: "89.99",
        stockQuantity: 25,
        imageUrl: "/api/placeholder/300/300",
        featured: true,
        rating: "4.8",
        specifications: { weight: "2.5 lbs", material: "Steel", warranty: "2 years" },
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
      },
      {
        id: 2,
        name: "Premium Drill Kit",
        description: "Complete drill kit with multiple bits and accessories",
        category: "Tools",
        price: "249.99",
        stockQuantity: 15,
        imageUrl: "/api/placeholder/300/300",
        featured: true,
        rating: "4.9",
        specifications: { voltage: "18V", battery: "Lithium-ion", accessories: "50 pieces" },
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
      }
    ];

    sampleProjects.forEach(project => this.projects.set(project.id, project));
    sampleProducts.forEach(product => this.products.set(product.id, product));
    
    this.nextProjectId = 3;
    this.nextProductId = 3;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: this.users.get(userData.id)?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser: User = {
      ...user,
      stripeCustomerId,
      stripeSubscriptionId,
      updatedAt: new Date()
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Project operations
  async getProjects(limit?: number, featured?: boolean): Promise<Project[]> {
    let results = Array.from(this.projects.values());
    
    if (featured !== undefined) {
      results = results.filter(p => p.featured === featured);
    }
    
    results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    if (limit) {
      results = results.slice(0, limit);
    }
    
    return results;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: this.nextProjectId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error('Project not found');
    
    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Product operations
  async getProducts(category?: string, featured?: boolean, limit?: number): Promise<Product[]> {
    let results = Array.from(this.products.values());
    
    if (category) {
      results = results.filter(p => p.category === category);
    }
    
    if (featured !== undefined) {
      results = results.filter(p => p.featured === featured);
    }
    
    results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    if (limit) {
      results = results.slice(0, limit);
    }
    
    return results;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: this.nextProductId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const product = this.products.get(id);
    if (!product) throw new Error('Product not found');
    
    const updatedProduct: Product = {
      ...product,
      ...updates,
      updatedAt: new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const results = Array.from(this.products.values()).filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );
    return results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  // Order operations
  async getOrders(userId?: string): Promise<Order[]> {
    let results = Array.from(this.orders.values());
    
    if (userId) {
      results = results.filter(o => o.userId === userId);
    }
    
    return results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: this.nextOrderId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error('Order not found');
    
    const updatedOrder: Order = {
      ...order,
      ...updates,
      updatedAt: new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const newOrderItem: OrderItem = {
      ...orderItem,
      id: this.nextOrderItemId++,
      createdAt: new Date()
    };
    this.orderItems.set(newOrderItem.id, newOrderItem);
    return newOrderItem;
  }

  // Deposit operations
  async getDeposits(userId?: string, projectId?: number): Promise<Deposit[]> {
    let results = Array.from(this.deposits.values());
    
    if (userId) {
      results = results.filter(d => d.userId === userId);
    }
    
    if (projectId) {
      results = results.filter(d => d.projectId === projectId);
    }
    
    return results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getDeposit(id: number): Promise<Deposit | undefined> {
    return this.deposits.get(id);
  }

  async createDeposit(deposit: InsertDeposit): Promise<Deposit> {
    const newDeposit: Deposit = {
      ...deposit,
      id: this.nextDepositId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.deposits.set(newDeposit.id, newDeposit);
    return newDeposit;
  }

  async updateDeposit(id: number, updates: Partial<InsertDeposit>): Promise<Deposit> {
    const deposit = this.deposits.get(id);
    if (!deposit) throw new Error('Deposit not found');
    
    const updatedDeposit: Deposit = {
      ...deposit,
      ...updates,
      updatedAt: new Date()
    };
    this.deposits.set(id, updatedDeposit);
    return updatedDeposit;
  }

  // Inquiry operations
  async getInquiries(userId?: string, status?: string): Promise<Inquiry[]> {
    let results = Array.from(this.inquiries.values());
    
    if (userId) {
      results = results.filter(i => i.userId === userId);
    }
    
    if (status) {
      results = results.filter(i => i.status === status);
    }
    
    return results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: this.nextInquiryId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inquiries.set(newInquiry.id, newInquiry);
    return newInquiry;
  }

  async updateInquiry(id: number, updates: Partial<InsertInquiry>): Promise<Inquiry> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) throw new Error('Inquiry not found');
    
    const updatedInquiry: Inquiry = {
      ...inquiry,
      ...updates,
      updatedAt: new Date()
    };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }

  // Chat history operations
  async getChatHistory(userId: string, sessionId?: string): Promise<ChatHistory[]> {
    let results = Array.from(this.chatHistory.values()).filter(c => c.userId === userId);
    
    if (sessionId) {
      results = results.filter(c => c.sessionId === sessionId);
    }
    
    return results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createChatHistory(chatHistoryData: InsertChatHistory): Promise<ChatHistory> {
    const newChatHistory: ChatHistory = {
      ...chatHistoryData,
      id: this.nextChatId++,
      createdAt: new Date()
    };
    this.chatHistory.set(newChatHistory.id, newChatHistory);
    return newChatHistory;
  }
}

export const storage = new MemoryStorage();