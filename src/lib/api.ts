import { DashboardOverview, RevenueAnalytics, UserAnalytics, SubscriptionAnalytics } from './types';

const API_BASE_URL = 'https://api.adhyan.guru/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('adminToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Dashboard Overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    return this.request<DashboardOverview>('/admin/dashboard/overview');
  }

  // Revenue Analytics
  async getRevenueAnalytics(params?: {
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
  }): Promise<RevenueAnalytics> {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append('period', params.period);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const queryString = searchParams.toString();
    const endpoint = `/admin/analytics/revenue${queryString ? `?${queryString}` : ''}`;
    
    return this.request<RevenueAnalytics>(endpoint);
  }

  // User Analytics
  async getUserAnalytics(params?: {
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
  }): Promise<UserAnalytics> {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append('period', params.period);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const queryString = searchParams.toString();
    const endpoint = `/admin/analytics/users${queryString ? `?${queryString}` : ''}`;
    
    return this.request<UserAnalytics>(endpoint);
  }

  // Subscription Analytics
  async getSubscriptionAnalytics(): Promise<SubscriptionAnalytics> {
    return this.request<SubscriptionAnalytics>('/admin/analytics/subscriptions');
  }

  // Legacy APIs (keeping for backward compatibility)
  async getLatestUpdates() {
    return this.request('/latest-updates');
  }

  async getHeroBanners() {
    return this.request('/get/hero-banners');
  }

  async getBlogs() {
    return this.request('/get/blogs');
  }
}

export const apiService = new ApiService(); 