import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, CreditCard, Activity, BarChart3 } from 'lucide-react';
import { apiService } from '../../lib/api';
import { 
  DashboardOverview, 
  RevenueAnalytics, 
  UserAnalytics, 
  SubscriptionAnalytics,
  StatCard as StatCardType 
} from '../../lib/types';
import StatCard from '../ui/StatCard';
import ActivityCard from '../ui/ActivityCard';
import { DashboardOverviewSkeleton } from '../ui/SkeletonLoader';

function DashboardHome() {
  const [isVisible, setIsVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [userData, setUserData] = useState<UserAnalytics | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Animate in the stats cards
    setTimeout(() => setIsVisible(true), 300);
    
    // Fetch all analytics data
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all analytics in parallel
        const [dashboardOverview, revenueAnalytics, userAnalytics, subscriptionAnalytics] = await Promise.all([
          apiService.getDashboardOverview(),
          apiService.getRevenueAnalytics({ period: 'monthly' }),
          apiService.getUserAnalytics({ period: 'monthly' }),
          apiService.getSubscriptionAnalytics()
        ]);
        
        setDashboardData(dashboardOverview);
        setRevenueData(revenueAnalytics);
        setUserData(userAnalytics);
        setSubscriptionData(subscriptionAnalytics);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  // Prepare stat cards data
  const getStatCards = (): StatCardType[] => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'Total Users',
        value: dashboardData.analytics.totalUsers,
        icon: '👥',
        color: 'from-blue-500 to-blue-600',
        trend: userData?.userAnalytics.growth.trend,
        percentage: userData?.userAnalytics.growth.percentage
      },
      {
        title: 'Active Subscriptions',
        value: dashboardData.analytics.activeSubscriptions,
        icon: '📊',
        color: 'from-green-500 to-green-600',
        trend: subscriptionData?.subscriptionAnalytics.conversionRate ? 'up' : undefined,
        percentage: subscriptionData?.subscriptionAnalytics.conversionRate
      },
      {
        title: 'Total Revenue',
        value: dashboardData.analytics.totalRevenue,
        icon: '💰',
        color: 'from-purple-500 to-purple-600',
        trend: revenueData?.revenue.growth.trend,
        percentage: revenueData?.revenue.growth.percentage
      },
      {
        title: 'Monthly Revenue',
        value: dashboardData.analytics.monthlyRevenue,
        icon: '📈',
        color: 'from-emerald-500 to-emerald-600',
        trend: 'up',
        percentage: 12.5
      },
      {
        title: 'New Users (This Month)',
        value: dashboardData.analytics.newUsersThisMonth,
        icon: '🆕',
        color: 'from-orange-500 to-orange-600',
        trend: 'up',
        percentage: 8.3
      },
      {
        title: 'Avg Revenue/User',
        value: Math.round(dashboardData.analytics.averageRevenuePerUser),
        icon: '💎',
        color: 'from-pink-500 to-pink-600',
        trend: 'up',
        percentage: 5.2
      }
    ];
  };
  
  // Prepare activity data
  const getRecentActivities = () => {
    if (!dashboardData) return [];
    
    const activities = [
      ...dashboardData.recentActivity.newUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        date: user.createdAt,
        type: 'user' as const
      })),
      ...dashboardData.recentActivity.recentPayments.map(payment => ({
        id: payment.paymentId,
        name: payment.userName,
        amount: payment.amount,
        date: payment.date,
        type: 'payment' as const
      }))
    ];
    
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  return (
    <div className="relative min-h-screen bg-white p-8">
      {/* Dashboard Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2 animate-pulse">
          Vidyabani Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Comprehensive Analytics & Insights
        </p>
      </div>

      {loading ? (
        <DashboardOverviewSkeleton />
      ) : error ? (
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-8">
            {getStatCards().map((stat, index) => (
              <div
                key={stat.title}
                className={`
                  transition-all duration-700 transform
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <StatCard {...stat} />
              </div>
            ))}
          </div>
          
          {/* Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* Recent Activity */}
            <div className={`
              transition-all duration-1000
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
            `}>
              <ActivityCard 
                title="Recent Activity" 
                items={getRecentActivities()}
              />
            </div>
            
            {/* Subscription Stats */}
            <div className={`
              transition-all duration-1200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
            `}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Subscription Overview
                </h3>
                
                {subscriptionData && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-blue-600 text-sm font-medium">Active</div>
                        <div className="text-2xl font-bold text-blue-800">
                          {subscriptionData.subscriptionAnalytics.activeSubscriptions}
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-red-600 text-sm font-medium">Expired</div>
                        <div className="text-2xl font-bold text-red-800">
                          {subscriptionData.subscriptionAnalytics.expiredSubscriptions}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-green-600 text-sm font-medium mb-2">Conversion Rate</div>
                      <div className="text-3xl font-bold text-green-800">
                        {subscriptionData.subscriptionAnalytics.conversionRate}%
                      </div>
                      <div className="text-green-600 text-sm mt-1 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +2.1% from last month
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Revenue Chart Preview */}
          {revenueData && (
            <div className={`
              mt-8 bg-white border border-gray-200 p-6 rounded-xl shadow-sm
              transition-all duration-1400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
            `}>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Revenue Trend
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-600 text-sm font-medium">Total Revenue</div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{revenueData.revenue.total.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-600 text-sm font-medium">Growth</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {revenueData.revenue.growth.percentage}%
                  </div>
                  <div className={`text-sm mt-1 font-medium ${
                    revenueData.revenue.growth.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {revenueData.revenue.growth.trend === 'up' ? '↗' : '↘'} 
                    {revenueData.revenue.growth.trend === 'up' ? 'Increasing' : 'Decreasing'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-600 text-sm font-medium">Period</div>
                  <div className="text-2xl font-bold text-gray-800 capitalize">
                    {revenueData.revenue.period}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardHome;