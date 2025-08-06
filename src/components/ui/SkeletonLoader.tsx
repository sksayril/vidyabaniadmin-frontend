import React from 'react';

// Base Skeleton Component
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Card Skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="w-12 h-12 rounded-lg" />
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center p-4 border-b border-gray-100 animate-pulse">
    <div className="flex items-center flex-1">
      <Skeleton className="w-10 h-10 rounded-full mr-4" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="flex-1">
      <Skeleton className="h-4 w-20 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
    <div className="flex-1">
      <Skeleton className="h-6 w-16 rounded-full mb-1" />
      <Skeleton className="h-3 w-12" />
    </div>
    <div className="flex-1">
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="w-20">
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

// User Card Skeleton
export const UserCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <Skeleton className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div>
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

// Category Card Skeleton
export const CategoryCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Skeleton className="w-10 h-10 rounded-lg mr-3" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex justify-between items-center">
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

// Analytics Chart Skeleton
export const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <div className="flex items-center space-x-2">
              <Skeleton className="w-20 h-2 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Stats Grid Skeleton
export const StatsGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
    
    {/* Table Headers */}
    <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-4 w-20" />
        ))}
      </div>
    </div>
    
    {/* Table Rows */}
    <div className="divide-y divide-gray-200">
      {[...Array(5)].map((_, index) => (
        <TableRowSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
    <Skeleton className="h-8 w-48 mb-6" />
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <div className="flex space-x-3 pt-4">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

// Modal Skeleton
export const ModalSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-6 rounded" />
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
    <div className="flex justify-end space-x-3 mt-6">
      <Skeleton className="h-10 w-20 rounded-lg" />
      <Skeleton className="h-10 w-20 rounded-lg" />
    </div>
  </div>
);

// List Skeleton
export const ListSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
        <div className="flex items-center">
          <Skeleton className="w-10 h-10 rounded-full mr-3" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

// Dashboard Overview Skeleton
export const DashboardOverviewSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Stats Grid */}
    <StatsGridSkeleton />

    {/* Recent Activity */}
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="text-right">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Loading Spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

// Loading with Text
export const LoadingWithText: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  text = 'Loading...', 
  size = 'md' 
}) => (
  <div className="flex items-center justify-center gap-3">
    <LoadingSpinner size={size} />
    <span className="text-gray-500 font-medium">{text}</span>
  </div>
);

export default {
  CardSkeleton,
  TableRowSkeleton,
  UserCardSkeleton,
  CategoryCardSkeleton,
  ChartSkeleton,
  StatsGridSkeleton,
  TableSkeleton,
  FormSkeleton,
  ModalSkeleton,
  ListSkeleton,
  DashboardOverviewSkeleton,
  LoadingSpinner,
  LoadingWithText
}; 