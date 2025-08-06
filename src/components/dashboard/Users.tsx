import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Eye, Mail, Phone, Calendar, CreditCard, ArrowLeft, ArrowRight, ChevronDown, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { TableSkeleton, LoadingWithText, ModalSkeleton } from '../ui/SkeletonLoader';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  parentCategory?: {
    id: string;
    name: string;
  };
  subCategory?: {
    id: string;
    name: string;
  };
  subscription: {
    isActive: boolean;
    plan: string;
    startDate: string;
    endDate: string;
    paymentHistory?: Array<{
      razorpayPaymentId: string;
      amount: number;
      status: string;
      date: string;
    }>;
  };
  createdAt: string;
  lastLogin: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasMore: boolean;
}

interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

interface UserDetailsResponse {
  user: User;
}

function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  const token = localStorage.getItem('adminToken');
  const apiBaseUrl = 'https://api.adhyan.guru/api';

  const fetchUsers = async (page: number = 1, search: string = '', subscription: string = 'all') => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(subscription !== 'all' && { subscription })
      });

      const response = await fetch(`${apiBaseUrl}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoadingUserDetails(true);
      setError('');

      const response = await fetch(`${apiBaseUrl}/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data: UserDetailsResponse = await response.json();
      setUserDetails(data.user);
    } catch (err) {
      setError('Failed to fetch user details');
      console.error('Error fetching user details:', err);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers(1, searchTerm, subscriptionFilter);
  };

  const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setSubscriptionFilter(filter);
    fetchUsers(1, searchTerm, filter);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page, searchTerm, subscriptionFilter);
  };

  const handleViewUserDetails = async (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    await fetchUserDetails(user.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getSubscriptionStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getSubscriptionStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle size={16} /> : <XCircle size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users size={20} />
          <span>{pagination.totalUsers} total users</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Subscription Filter */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  subscriptionFilter === 'all' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('active')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  subscriptionFilter === 'active' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleFilterChange('inactive')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  subscriptionFilter === 'inactive' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-500 mb-2">{error}</div>
            <button
              onClick={() => fetchUsers()}
              className="text-blue-500 hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No users found</p>
            <p className="text-sm text-gray-400 mt-2">
              {searchTerm || subscriptionFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No users have been registered yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={12} />
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} />
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{user.parentCategory?.name || 'N/A'}</div>
                          <div className="text-gray-500">{user.subCategory?.name || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionStatusColor(user.subscription.isActive)}`}>
                            {getSubscriptionStatusIcon(user.subscription.isActive)}
                            <span className="ml-1">
                              {user.subscription.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </span>
                          <div className="text-xs text-gray-500">
                            {user.subscription.plan}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Expires: {formatDate(user.subscription.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(user.lastLogin)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewUserDetails(user)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>
                    Showing {((pagination.currentPage - 1) * 20) + 1} to{' '}
                    {Math.min(pagination.currentPage * 20, pagination.totalUsers)} of{' '}
                    {pagination.totalUsers} results
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasMore}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              User Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Detailed information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          {loadingUserDetails ? (
            <ModalSkeleton />
          ) : userDetails ? (
            <div className="py-4 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{userDetails.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{userDetails.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{userDetails.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-gray-900">{formatDate(userDetails.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Category Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Category Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Parent Category</label>
                    <p className="text-gray-900">{userDetails.parentCategory?.name || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Sub Category</label>
                    <p className="text-gray-900">{userDetails.subCategory?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Subscription Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionStatusColor(userDetails.subscription.isActive)}`}>
                      {getSubscriptionStatusIcon(userDetails.subscription.isActive)}
                      <span className="ml-1">
                        {userDetails.subscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Plan</span>
                    <span className="text-gray-900 capitalize">{userDetails.subscription.plan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Start Date</span>
                    <span className="text-gray-900">{formatDate(userDetails.subscription.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">End Date</span>
                    <span className="text-gray-900">{formatDate(userDetails.subscription.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {userDetails.subscription.paymentHistory && userDetails.subscription.paymentHistory.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Payment History</h3>
                  <div className="space-y-2">
                    {userDetails.subscription.paymentHistory.map((payment, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard size={16} className="text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Payment ID: {payment.razorpayPaymentId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(payment.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'success' 
                              ? 'text-green-600 bg-green-50' 
                              : 'text-red-600 bg-red-50'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Last Login */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Last Login</span>
                    <span className="text-gray-900">{formatDate(userDetails.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              Failed to load user details
            </div>
          )}
          
          <DialogFooter>
            <button
              onClick={() => setShowUserDetails(false)}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UsersManagement; 