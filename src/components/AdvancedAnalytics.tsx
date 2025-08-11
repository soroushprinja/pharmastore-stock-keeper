import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { Medicine } from '@/types/medicine';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AdvancedAnalyticsProps {
  medicines: Medicine[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ medicines }) => {
  const { formatPrice } = useCurrency();
  const currentDate = new Date();
  
  // Calculate insights
  const totalValue = medicines.reduce((sum, med) => sum + (med.quantity * med.price), 0);
  const avgPrice = medicines.length > 0 ? totalValue / medicines.reduce((sum, med) => sum + med.quantity, 0) : 0;
  
  const expiringSoon = medicines.filter(med => {
    const expiryDate = new Date(med.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const expired = medicines.filter(med => {
    const expiryDate = new Date(med.expiryDate);
    return expiryDate < currentDate;
  });

  const lowStock = medicines.filter(med => med.quantity <= med.lowStockThreshold);
  
  const topCompanies = medicines.reduce((acc, med) => {
    acc[med.company] = (acc[med.company] || 0) + (med.quantity * med.price);
    return acc;
  }, {} as Record<string, number>);

  const sortedCompanies = Object.entries(topCompanies)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const mostValuableMedicines = medicines
    .map(med => ({ ...med, totalValue: med.quantity * med.price }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inventory Value</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Price/Unit</p>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(avgPrice)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-amber-600">{expiringSoon.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{expired.length + lowStock.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Companies by Value */}
      <Card>
        <CardHeader>
          <CardTitle>Top Companies by Inventory Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedCompanies.map(([company, value], index) => (
              <div key={company} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="font-medium">{company}</span>
                </div>
                <span className="font-bold text-green-600">{formatPrice(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Valuable Medicines */}
      <Card>
        <CardHeader>
          <CardTitle>Most Valuable Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mostValuableMedicines.map((med, index) => (
              <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <span className="font-medium">{med.name}</span>
                    <p className="text-sm text-gray-600">{med.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600">{formatPrice(med.totalValue)}</span>
                  <p className="text-sm text-gray-600">{med.quantity} × {formatPrice(med.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
