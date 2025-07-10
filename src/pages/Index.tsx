
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertTriangle, Calendar, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MedicineForm from '@/components/MedicineForm';
import MedicineTable from '@/components/MedicineTable';
import DashboardStats from '@/components/DashboardStats';
import InventoryCharts from '@/components/InventoryCharts';
import FilterPanel from '@/components/FilterPanel';
import Header from '@/components/Header';
import { Medicine, FilterOptions } from '@/types/medicine';
import { useMedicineStore } from '@/store/medicineStore';

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    lowStock: false,
    expiringSoon: false,
    company: ''
  });

  const { medicines, addMedicine, updateMedicine, deleteMedicine } = useMedicineStore();

  // Filter medicines based on search and filters
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.batchNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || medicine.category === filters.category;
    const matchesLowStock = !filters.lowStock || medicine.quantity <= medicine.lowStockThreshold;
    const matchesExpiring = !filters.expiringSoon || isExpiringSoon(medicine.expiryDate);
    const matchesCompany = !filters.company || medicine.company.toLowerCase().includes(filters.company.toLowerCase());

    return matchesSearch && matchesCategory && matchesLowStock && matchesExpiring && matchesCompany;
  });

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const handleAddMedicine = (medicine: Omit<Medicine, 'id'>) => {
    addMedicine(medicine);
    setShowAddForm(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      lowStock: false,
      expiringSoon: false,
      company: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Dashboard Statistics */}
        <DashboardStats medicines={medicines} />

        {/* Charts Section */}
        <InventoryCharts medicines={medicines} />

        {/* Search and Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search medicines, companies, or batch numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {(filters.category || filters.lowStock || filters.expiringSoon || filters.company) && (
                    <Badge variant="secondary" className="ml-1">
                      Active
                    </Badge>
                  )}
                </Button>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Medicine
                </Button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
                medicines={medicines}
              />
            )}

            {/* Active Filters Display */}
            {(filters.category || filters.lowStock || filters.expiringSoon || filters.company || searchTerm) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchTerm && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Search: {searchTerm}
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Category: {filters.category}
                  </Badge>
                )}
                {filters.lowStock && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Low Stock
                  </Badge>
                )}
                {filters.expiringSoon && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Expiring Soon
                  </Badge>
                )}
                {filters.company && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Company: {filters.company}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Medicine Table */}
            <MedicineTable
              medicines={filteredMedicines}
              onEdit={updateMedicine}
              onDelete={deleteMedicine}
            />
          </CardContent>
        </Card>

        {/* Add Medicine Modal */}
        {showAddForm && (
          <MedicineForm
            onSubmit={handleAddMedicine}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
