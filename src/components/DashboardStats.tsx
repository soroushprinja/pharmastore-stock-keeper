import React from 'react';
import { Package, AlertTriangle, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medicine } from '@/types/medicine';
import { useCurrency } from '@/contexts/CurrencyContext';

interface DashboardStatsProps {
  medicines: Medicine[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ medicines }) => {
  const { formatPrice } = useCurrency();
  
  const totalMedicines = medicines.length;
  const totalValue = medicines.reduce((sum, medicine) => sum + (medicine.quantity * medicine.price), 0);
  
  const lowStockMedicines = medicines.filter(medicine => 
    medicine.quantity <= medicine.lowStockThreshold
  );
  
  const expiringSoonMedicines = medicines.filter(medicine => {
    const expiry = new Date(medicine.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const expiredMedicines = medicines.filter(medicine => {
    const expiry = new Date(medicine.expiryDate);
    const today = new Date();
    return expiry < today;
  });

  const totalQuantity = medicines.reduce((sum, medicine) => sum + medicine.quantity, 0);

  const stats = [
    {
      title: 'Total Medicines',
      value: totalMedicines.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      description: 'Unique products'
    },
    {
      title: 'Total Inventory Value',
      value: formatPrice(totalValue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      description: 'Current stock value'
    },
    {
      title: 'Total Quantity',
      value: totalQuantity.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      description: 'Total units in stock'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockMedicines.length.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      description: 'Need restocking'
    },
    {
      title: 'Expiring Soon',
      value: expiringSoonMedicines.length.toString(),
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
      description: 'Within 30 days'
    },
    {
      title: 'Expired Items',
      value: expiredMedicines.length.toString(),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
      description: 'Past expiry date'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
