# Vidyabani Admin Dashboard

A comprehensive admin dashboard for Vidyabani with advanced analytics, user management, and content administration capabilities.

## 🚀 Features

### Analytics & Dashboard
- **Real-time Analytics**: Comprehensive dashboard with user, revenue, and subscription analytics
- **Interactive Charts**: Visual representation of key metrics and trends
- **Filterable Data**: Time-based filtering (daily, weekly, monthly, yearly)
- **Export Capabilities**: Download analytics data in various formats

### User Management
- **User Analytics**: Track user growth, engagement, and demographics
- **Subscription Management**: Monitor active subscriptions, conversions, and churn rates
- **Payment Tracking**: Real-time payment analytics with Razorpay integration

### Content Management
- **Blog Management**: Create, edit, and manage blog posts
- **Category Management**: Organize content with hierarchical categories
- **Hero Section**: Manage homepage banners and featured content
- **Latest Updates**: Keep users informed with real-time updates

## 📊 Analytics APIs

The dashboard integrates with the following analytics APIs:

### 1. Dashboard Overview
```
GET /api/admin/dashboard/overview
```
Returns comprehensive dashboard analytics including:
- Total users and active subscriptions
- Revenue metrics (total, monthly, per-user)
- Recent user activity and payments
- Subscription statistics

### 2. Revenue Analytics
```
GET /api/admin/analytics/revenue?period=monthly&startDate=2024-01-01&endDate=2024-12-31
```
Provides detailed revenue insights with:
- Time-based filtering (daily/weekly/monthly/yearly)
- Revenue growth trends
- Subscription and order value analytics

### 3. User Analytics
```
GET /api/admin/analytics/users?period=monthly
```
Tracks user engagement with:
- User growth and activity metrics
- Category distribution analysis
- Engagement trends over time

### 4. Subscription Analytics
```
GET /api/admin/analytics/subscriptions
```
Monitors subscription health:
- Active vs expired subscriptions
- Conversion and churn rates
- Payment method distribution

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Integration**: Fetch API with centralized service layer
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardHome.tsx          # Main dashboard view
│   │   ├── AnalyticsDashboard.tsx     # Detailed analytics
│   │   ├── Categories.tsx             # Category management
│   │   ├── Blogs.tsx                  # Blog management
│   │   ├── HeroSection.tsx            # Hero section management
│   │   ├── Banner.tsx                 # Banner management
│   │   ├── LatestUpdates.tsx          # Updates management
│   │   └── Sponser.tsx                # Sponsor management
│   ├── ui/
│   │   ├── StatCard.tsx               # Reusable stat card component
│   │   ├── ActivityCard.tsx           # Activity display component
│   │   ├── dialog.tsx                 # Modal dialogs
│   │   └── tree-view.tsx              # Tree view component
│   ├── Dashboard.tsx                  # Main dashboard container
│   └── Login.tsx                      # Authentication
├── lib/
│   ├── api.ts                         # API service layer
│   ├── types.ts                       # TypeScript type definitions
│   └── utils.ts                       # Utility functions
├── App.tsx                            # Main application component
└── main.tsx                          # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd vidyabani-admin-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://api.adhyan.guru/api
VITE_APP_NAME=Vidyabani Admin
```

## 🔧 Configuration

### API Configuration
The API service is configured in `src/lib/api.ts`:
- Base URL: `https://api.adhyan.guru/api`
- Authentication: Bearer token from localStorage
- Error handling: Centralized error management

### TypeScript Configuration
- Strict type checking enabled
- Custom type definitions for all API responses
- Proper interface definitions for components

## 📈 Key Metrics Tracked

### User Metrics
- Total registered users
- Active users (last 30 days)
- New user registrations
- User growth rate
- Category-wise user distribution

### Revenue Metrics
- Total revenue (lifetime)
- Monthly recurring revenue
- Revenue growth percentage
- Average revenue per user
- Payment method distribution

### Subscription Metrics
- Active subscriptions count
- Subscription conversion rate
- Churn rate analysis
- Expired subscriptions
- Payment method preferences

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Blue and green gradient theme
- **Typography**: Modern, readable fonts
- **Components**: Reusable, accessible components
- **Responsive**: Mobile-first design approach

### Interactive Elements
- **Animated Cards**: Smooth hover and transition effects
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications and confirmations

## 🔐 Security Features

- **Authentication**: JWT token-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure API communication

## 📱 Responsive Design

The dashboard is fully responsive with:
- **Mobile**: Optimized for smartphones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for Vidyabani** 