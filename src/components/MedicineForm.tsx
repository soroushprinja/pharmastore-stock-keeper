
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Medicine, MEDICINE_CATEGORIES } from '@/types/medicine';

interface MedicineFormProps {
  medicine?: Medicine;
  onSubmit: (medicine: Omit<Medicine, 'id'>) => void;
  onCancel: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ medicine, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: medicine?.name || '',
    batchNo: medicine?.batchNo || '',
    quantity: medicine?.quantity || 0,
    price: medicine?.price || 0,
    expiryDate: medicine?.expiryDate || '',
    company: medicine?.company || '',
    category: medicine?.category || '',
    lowStockThreshold: medicine?.lowStockThreshold || 10,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Medicine name is required';
    if (!formData.batchNo.trim()) newErrors.batchNo = 'Batch number is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity must be positive';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.lowStockThreshold < 0) newErrors.lowStockThreshold = 'Threshold must be positive';

    // Check if expiry date is in the past
    if (formData.expiryDate && new Date(formData.expiryDate) < new Date()) {
      newErrors.expiryDate = 'Expiry date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        dateAdded: medicine?.dateAdded || new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            {medicine ? 'Edit Medicine' : 'Add New Medicine'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter medicine name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchNo">Batch Number *</Label>
                <Input
                  id="batchNo"
                  value={formData.batchNo}
                  onChange={(e) => handleChange('batchNo', e.target.value)}
                  placeholder="Enter batch number"
                  className={errors.batchNo ? 'border-red-500' : ''}
                />
                {errors.batchNo && <p className="text-red-500 text-sm">{errors.batchNo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                  placeholder="Enter quantity"
                  min="0"
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="Enter price"
                  min="0"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  className={errors.expiryDate ? 'border-red-500' : ''}
                />
                {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICINE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Enter company name"
                  className={errors.company ? 'border-red-500' : ''}
                />
                {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                  placeholder="Enter threshold"
                  min="0"
                  className={errors.lowStockThreshold ? 'border-red-500' : ''}
                />
                {errors.lowStockThreshold && <p className="text-red-500 text-sm">{errors.lowStockThreshold}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {medicine ? 'Update' : 'Add'} Medicine
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineForm;
