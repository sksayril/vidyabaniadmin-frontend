import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../../lib/api';
import { 
  DashboardOverview, 
  RevenueAnalytics, 
  UserAnalytics, 
  SubscriptionAnalytics 
} from '../../lib/types';
import { DashboardOverviewSkeleton } from '../ui/SkeletonLoader';

interface AnalyticsDashboardProps {
  className?: string;
}

// Skeleton Loader for Analytics Dashboard
const AnalyticsSkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded mb-2 w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>
      </div>

      {/* Key Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
                <div className="h-8 bg-gray-200 rounded mb-2 w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analytics Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Analytics Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4">
              <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="h-4 bg-gray-200 rounded mb-3 w-32"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="h-3 bg-blue-200 rounded mb-2 w-16"></div>
              <div className="h-6 bg-blue-200 rounded w-12"></div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="h-3 bg-gray-200 rounded mb-2 w-12"></div>
              <div className="h-6 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [userData, setUserData] = useState<UserAnalytics | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboardOverview, revenueAnalytics, userAnalytics, subscriptionAnalytics] = await Promise.all([
        apiService.getDashboardOverview(),
        apiService.getRevenueAnalytics({ 
          period: selectedPeriod,
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined
        }),
        apiService.getUserAnalytics({ 
          period: selectedPeriod,
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined
        }),
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

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod, dateRange]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getGrowthColor = (trend: 'up' | 'down'): string => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  if (loading) {
    return <DashboardOverviewSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchAnalyticsData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
            <p className="text-gray-600">Comprehensive insights and metrics</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Period Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            {/* Date Range */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Export Button */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNumber(dashboardData.analytics.totalUsers)}
                </p>
                {userData && (
                  <div className={`flex items-center mt-2 ${getGrowthColor(userData.userAnalytics.growth.trend)}`}>
                    {getGrowthIcon(userData.userAnalytics.growth.trend)}
                    <span className="text-sm ml-1">
                      {userData.userAnalytics.growth.percentage}%
                    </span>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNumber(dashboardData.analytics.activeSubscriptions)}
                </p>
                {subscriptionData && (
                  <div className="flex items-center mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm ml-1">
                      {subscriptionData.subscriptionAnalytics.conversionRate}% conversion
                    </span>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(dashboardData.analytics.totalRevenue)}
                </p>
                {revenueData && (
                  <div className={`flex items-center mt-2 ${getGrowthColor(revenueData.revenue.growth.trend)}`}>
                    {getGrowthIcon(revenueData.revenue.growth.trend)}
                    <span className="text-sm ml-1">
                      {revenueData.revenue.growth.percentage}%
                    </span>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(dashboardData.analytics.monthlyRevenue)}
                </p>
                <div className="flex items-center mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm ml-1">+12.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        {revenueData && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Analytics</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatCurrency(revenueData.revenue.total)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Growth Rate</p>
                  <p className="text-xl font-bold text-gray-800">
                    {revenueData.revenue.growth.percentage}%
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Revenue Data</p>
                <div className="max-h-48 overflow-y-auto">
                  {revenueData.revenue.data.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{item.date}</span>
                      <span className="text-sm font-medium">{formatCurrency(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Analytics */}
        {userData && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Analytics</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Active Users</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatNumber(userData.userAnalytics.activeUsers)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">New Users</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatNumber(userData.userAnalytics.newUsers)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Category Distribution</p>
                <div className="space-y-2">
                  {userData.userAnalytics.categoryDistribution.map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Analytics */}
      {subscriptionData && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatNumber(subscriptionData.subscriptionAnalytics.activeSubscriptions)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {subscriptionData.subscriptionAnalytics.conversionRate}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {subscriptionData.subscriptionAnalytics.churnRate}%
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Payment Methods</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-600 text-sm">Razorpay</p>
                <p className="text-xl font-bold text-blue-800">
                  {formatNumber(subscriptionData.subscriptionAnalytics.paymentMethods.razorpay)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Other</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatNumber(subscriptionData.subscriptionAnalytics.paymentMethods.other)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 