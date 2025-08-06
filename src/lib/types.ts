// Analytics and Dashboard Types

export interface DashboardOverview {
  analytics: {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    monthlyRevenue: number;
    newUsersThisMonth: number;
    subscriptionRate: number;
    averageRevenuePerUser: number;
  };
  recentActivity: {
    newUsers: Array<{
      id: string;
      name: string;
      email: string;
      createdAt: string;
    }>;
    recentPayments: Array<{
      userId: string;
      userName: string;
      amount: number;
      paymentId: string;
      date: string;
    }>;
  };
  subscriptionStats: {
    active: number;
    expired: number;
    cancelled: number;
    pending: number;
  };
}

export interface RevenueAnalytics {
  revenue: {
    total: number;
    period: string;
    data: Array<{
      date: string;
      revenue: number;
      subscriptions: number;
      averageOrderValue: number;
    }>;
    growth: {
      percentage: number;
      trend: 'up' | 'down';
    };
  };
}

export interface UserAnalytics {
  userAnalytics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    growth: {
      percentage: number;
      trend: 'up' | 'down';
    };
    data: Array<{
      date: string;
      newUsers: number;
      activeUsers: number;
      totalUsers: number;
    }>;
    categoryDistribution: Array<{
      category: string;
      users: number;
      percentage: number;
    }>;
  };
}

export interface SubscriptionAnalytics {
  subscriptionAnalytics: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    monthlyRecurringRevenue: number;
    conversionRate: number;
    churnRate: number;
    data: Array<{
      month: string;
      newSubscriptions: number;
      cancellations: number;
      revenue: number;
    }>;
    paymentMethods: {
      razorpay: number;
      other: number;
    };
  };
}

export interface Snowflake {
  id: number;
  left: string;
  animationDelay: string;
  fontSize: string;
  opacity: number;
  animationDuration: string;
}

export interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend?: 'up' | 'down';
  percentage?: number;
} 