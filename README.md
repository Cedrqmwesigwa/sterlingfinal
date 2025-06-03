# Sterling Contractors - Enterprise Website

A comprehensive business website for Sterling Contractors featuring AI/ML capabilities, authentication, ecommerce, and premium performance optimization.

## Features

- **AI-Powered Services**: OpenAI integration for smart cost estimation and customer support
- **E-commerce Platform**: Complete product catalog with Stripe payment processing
- **Mobile Money Support**: Integration with mobile payment systems
- **Project Showcase**: Portfolio of construction projects with detailed information
- **Real-time Chat**: AI-powered customer support chatbot
- **Deposit Collection**: Automated deposit calculation and payment processing
- **Contact Management**: Inquiry tracking and customer communication
- **Responsive Design**: Mobile-first design with dark mode support

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe integration
- **AI/ML**: OpenAI GPT-4 integration
- **Authentication**: Google OAuth with Replit Auth
- **Deployment**: Firebase Hosting with full capabilities
- **Version Control**: GitHub with automated workflows

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- API keys for OpenAI and Stripe

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sterling-contractors.git
cd sterling-contractors
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your API keys:
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key
- `DATABASE_URL`: PostgreSQL connection string

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

### Firebase Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase project:
```bash
firebase init
```

4. Deploy to Firebase:
```bash
npm run build
firebase deploy
```

## API Endpoints

### Public Routes

- `GET /api/projects` - Get all projects
- `GET /api/products` - Get all products
- `POST /api/inquiries` - Submit contact form
- `POST /api/chat` - AI chat endpoint
- `POST /api/estimate` - AI project estimation

### Payment Routes

- `POST /api/create-payment-intent` - Create Stripe payment
- `POST /api/deposits` - Create deposit payment

## Environment Variables

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...

# Database Configuration
DATABASE_URL=postgresql://...

# Session Configuration
SESSION_SECRET=your-session-secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@sterlingcontractors.com or create an issue in the GitHub repository.