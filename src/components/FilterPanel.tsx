
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterOptions, Medicine, MEDICINE_CATEGORIES } from '@/types/medicine';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  medicines: Medicine[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  medicines 
}) => {
  const uniqueCompanies = [...new Set(medicines.map(m => m.company))];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {MEDICINE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Filter */}
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              placeholder="Search company..."
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div className="space-y-3">
            <Label>Status Filters</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowStock"
                  checked={filters.lowStock}
                  onCheckedChange={(checked) => handleFilterChange('lowStock', checked)}
                />
                <Label htmlFor="lowStock" className="text-sm">Low Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="expiringSoon"
                  checked={filters.expiringSoon}
                  onCheckedChange={(checked) => handleFilterChange('expiringSoon', checked)}
                />
                <Label htmlFor="expiringSoon" className="text-sm">Expiring Soon</Label>
              </div>
            </div>
          </div>

          {/* Quick Company Filters */}
          <div className="space-y-2">
            <Label>Top Companies</Label>
            <div className="space-y-1">
              {uniqueCompanies.slice(0, 3).map((company) => (
                <Button
                  key={company}
                  variant="outline"
                  size="sm"
                  className={`w-full justify-start text-xs ${
                    filters.company === company ? 'bg-blue-100 border-blue-300' : ''
                  }`}
                  onClick={() => handleFilterChange('company', 
                    filters.company === company ? '' : company
                  )}
                >
                  {company}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
