import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "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"
});

// AI-powered cost estimation
export async function generateProjectEstimate(projectDetails: {
  type: string;
  description: string;
  location?: string;
  size?: string;
  specifications?: string;
}): Promise<{
  estimatedCost: number;
  breakdown: Array<{ category: string; cost: number; description: string }>;
  confidence: number;
  timeline: string;
  recommendations: string[];
}> {
  try {
    const prompt = `As a construction cost estimation expert in Uganda, analyze this project and provide a detailed cost estimate:

Project Type: ${projectDetails.type}
Description: ${projectDetails.description}
Location: ${projectDetails.location || 'Kampala, Uganda'}
Size: ${projectDetails.size || 'Not specified'}
Specifications: ${projectDetails.specifications || 'Standard specifications'}

Please provide a JSON response with:
1. estimatedCost (total in USD)
2. breakdown (array of cost categories with individual costs and descriptions)
3. confidence (0-1 score for estimate accuracy)
4. timeline (estimated project duration)
5. recommendations (array of cost-saving or quality improvement suggestions)

Consider Uganda market rates, material costs, labor costs, and local construction standards.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert construction cost estimator with deep knowledge of the Ugandan construction market. Provide accurate, detailed cost estimates in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      estimatedCost: result.estimatedCost || 0,
      breakdown: result.breakdown || [],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      timeline: result.timeline || "4-6 weeks",
      recommendations: result.recommendations || [],
    };
  } catch (error) {
    console.error("Error generating project estimate:", error);
    throw new Error("Failed to generate project estimate: " + (error as Error).message);
  }
}

// AI-powered product recommendations
export async function generateProductRecommendations(projectDescription: string, budget?: number): Promise<{
  recommendations: Array<{
    category: string;
    products: string[];
    reasoning: string;
    estimatedCost: number;
  }>;
  totalEstimatedCost: number;
}> {
  try {
    const prompt = `Based on this construction project description, recommend specific hardware products and materials:

Project: ${projectDescription}
Budget: ${budget ? `$${budget}` : 'Not specified'}

Provide JSON with:
1. recommendations (array of product categories with specific products, reasoning, and estimated costs)
2. totalEstimatedCost (sum of all product costs)

Focus on quality products suitable for Uganda market and climate.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a hardware and construction materials expert. Recommend specific products suitable for construction projects in Uganda."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      recommendations: result.recommendations || [],
      totalEstimatedCost: result.totalEstimatedCost || 0,
    };
  } catch (error) {
    console.error("Error generating product recommendations:", error);
    throw new Error("Failed to generate product recommendations: " + (error as Error).message);
  }
}

// AI chatbot for customer support
export async function generateChatResponse(
  message: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are Sterling Contractors' AI assistant. You help customers with:
        - Construction project inquiries
        - Product recommendations
        - Cost estimation guidance
        - Project timeline questions
        - Hardware and materials advice
        - General construction information

        Key company info:
        - Located in Kampala, Uganda
        - Services: Residential construction, commercial buildings, renovations, hardware supply
        - Contact: +256 751 979 777, mctyptys@gmail.com
        - Premium quality focus with modern technology integration

        Be helpful, professional, and encourage customers to contact for detailed quotes.`
      },
      ...chatHistory.slice(-10), // Keep last 10 messages for context
      {
        role: "user" as const,
        content: message
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.8,
      max_tokens: 300,
    });

    return response.choices[0].message.content || "I apologize, but I'm having trouble responding right now. Please contact us directly at +256 751 979 777.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I apologize, but I'm having trouble responding right now. Please contact us directly at +256 751 979 777 or mctyptys@gmail.com.";
  }
}

// Deposit calculation with AI optimization
export async function calculateOptimalDeposit(projectDetails: {
  type: string;
  budget: number;
  complexity: string;
  timeline: string;
}): Promise<{
  recommendedDeposit: number;
  percentage: number;
  reasoning: string;
  paymentSchedule: Array<{ phase: string; amount: number; description: string }>;
}> {
  try {
    const prompt = `Calculate the optimal deposit for this construction project:

Project Type: ${projectDetails.type}
Total Budget: $${projectDetails.budget}
Complexity: ${projectDetails.complexity}
Timeline: ${projectDetails.timeline}

Provide JSON with:
1. recommendedDeposit (amount in USD)
2. percentage (of total budget)
3. reasoning (explanation for the deposit amount)
4. paymentSchedule (array of payment phases with amounts and descriptions)

Consider material costs, labor scheduling, and risk factors in Uganda construction market.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a construction finance expert specializing in deposit calculations and payment scheduling for projects in Uganda."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      recommendedDeposit: result.recommendedDeposit || projectDetails.budget * 0.25,
      percentage: result.percentage || 25,
      reasoning: result.reasoning || "Standard 25% deposit for material procurement and labor scheduling.",
      paymentSchedule: result.paymentSchedule || [],
    };
  } catch (error) {
    console.error("Error calculating optimal deposit:", error);
    // Fallback calculation
    const percentage = projectDetails.type === 'commercial' ? 30 : 25;
    return {
      recommendedDeposit: projectDetails.budget * (percentage / 100),
      percentage,
      reasoning: `Standard ${percentage}% deposit for ${projectDetails.type} projects to secure materials and schedule labor.`,
      paymentSchedule: [],
    };
  }
}
