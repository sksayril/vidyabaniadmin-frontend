import React from 'react';
import { User, CreditCard, Calendar, Mail } from 'lucide-react';

interface ActivityItem {
  id: string;
  name: string;
  email?: string;
  amount?: number;
  paymentId?: string;
  date: string;
  type: 'user' | 'payment';
}

interface ActivityCardProps {
  title: string;
  items: ActivityItem[];
  className?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ title, items, className = '' }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        {title}
      </h3>
      
      <div className="space-y-3">
        {items.length > 0 ? (
          items.slice(0, 5).map((item) => (
            <div 
              key={item.id} 
              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {item.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">
                      {item.name}
                    </h4>
                    {item.email && (
                      <div className="flex items-center text-gray-500 text-xs mt-1">
                        <Mail className="w-3 h-3 mr-1" />
                        {item.email}
                      </div>
                    )}
                    {item.amount && (
                      <div className="text-green-600 text-sm font-medium mt-1">
                        {formatCurrency(item.amount)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(item.date)}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {formatTime(item.date)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm">No recent activity</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard; 