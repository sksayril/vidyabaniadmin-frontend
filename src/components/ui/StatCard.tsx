import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard as StatCardType } from '../../lib/types';

interface StatCardProps extends StatCardType {
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  percentage,
  className = '' 
}) => {
  const formatValue = (val: number): string => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toString();
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isCurrency = title.toLowerCase().includes('revenue') || title.toLowerCase().includes('amount');
  const displayValue = isCurrency ? formatCurrency(value) : formatValue(value);

  return (
    <div className={`
      bg-gradient-to-r ${color} rounded-xl shadow-lg p-6 
      transition-all duration-300 transform hover:scale-105 hover:shadow-xl
      ${className}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white text-opacity-90 text-sm font-medium mb-1">
            {title}
          </h3>
          <p className="text-3xl font-bold text-white mb-2">
            {displayValue}
          </p>
          {trend && percentage && (
            <div className="flex items-center space-x-1">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-200" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-200" />
              )}
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-200' : 'text-red-200'
              }`}>
                {percentage}%
              </span>
            </div>
          )}
        </div>
        <div className="text-4xl opacity-80">
          {icon}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full transition-all duration-1000"
          style={{ 
            width: `${Math.min(percentage || Math.random() * 60 + 40, 100)}%` 
          }}
        />
      </div>
    </div>
  );
};

export default StatCard; 