
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Medicine } from '@/types/medicine';

interface InventoryChartsProps {
  medicines: Medicine[];
}

const InventoryCharts: React.FC<InventoryChartsProps> = ({ medicines }) => {
  // Category distribution data
  const categoryData = medicines.reduce((acc, medicine) => {
    const category = medicine.category;
    acc[category] = (acc[category] || 0) + medicine.quantity;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, quantity]) => ({
    category,
    quantity,
    value: medicines.filter(m => m.category === category).reduce((sum, m) => sum + (m.quantity * m.price), 0)
  }));

  // Stock status data
  const stockStatusData = [
    {
      name: 'Good Stock',
      value: medicines.filter(m => m.quantity > m.lowStockThreshold).length,
      color: '#10b981'
    },
    {
      name: 'Low Stock',
      value: medicines.filter(m => m.quantity <= m.lowStockThreshold).length,
      color: '#f59e0b'
    }
  ];

  // Expiry status data
  const expiryStatusData = medicines.reduce((acc, medicine) => {
    const expiry = new Date(medicine.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      acc.expired += 1;
    } else if (daysUntilExpiry <= 30) {
      acc.expiringSoon += 1;
    } else if (daysUntilExpiry <= 90) {
      acc.expiringLater += 1;
    } else {
      acc.good += 1;
    }
    
    return acc;
  }, { expired: 0, expiringSoon: 0, expiringLater: 0, good: 0 });

  const expiryChartData = [
    { name: 'Expired', value: expiryStatusData.expired, color: '#ef4444' },
    { name: 'Expiring Soon (30d)', value: expiryStatusData.expiringSoon, color: '#f59e0b' },
    { name: 'Expiring Later (90d)', value: expiryStatusData.expiringLater, color: '#8b5cf6' },
    { name: 'Good', value: expiryStatusData.good, color: '#10b981' }
  ];

  // Top companies by value
  const companyData = medicines.reduce((acc, medicine) => {
    const company = medicine.company;
    const value = medicine.quantity * medicine.price;
    acc[company] = (acc[company] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const topCompaniesData = Object.entries(companyData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([company, value]) => ({ company, value }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
                  return [
                    name === 'quantity' ? `${numValue} units` : `$${numValue.toFixed(2)}`,
                    name === 'quantity' ? 'Quantity' : 'Value'
                  ];
                }}
              />
              <Bar dataKey="quantity" fill="#3b82f6" name="quantity" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stock Status */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expiry Status */}
      <Card>
        <CardHeader>
          <CardTitle>Expiry Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expiryChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {expiryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Companies by Value */}
      <Card>
        <CardHeader>
          <CardTitle>Top Companies by Inventory Value</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCompaniesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="company" type="category" width={100} />
              <Tooltip formatter={(value) => {
                const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
                return [`$${numValue.toFixed(2)}`, 'Value'];
              }} />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryCharts;
