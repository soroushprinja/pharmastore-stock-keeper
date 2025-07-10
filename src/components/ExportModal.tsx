
import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMedicineStore } from '@/store/medicineStore';
import { Medicine } from '@/types/medicine';

interface ExportModalProps {
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const { medicines } = useMedicineStore();
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [includeFields, setIncludeFields] = useState({
    name: true,
    batchNo: true,
    category: true,
    quantity: true,
    price: true,
    expiryDate: true,
    company: true,
    lowStockThreshold: false,
    dateAdded: false
  });

  const handleFieldToggle = (field: keyof typeof includeFields) => {
    setIncludeFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const exportData = () => {
    const filteredData = medicines.map(medicine => {
      const filtered: Partial<Medicine> = {};
      Object.keys(includeFields).forEach(field => {
        if (includeFields[field as keyof typeof includeFields]) {
          filtered[field as keyof Medicine] = medicine[field as keyof Medicine];
        }
      });
      return filtered;
    });

    if (exportFormat === 'csv') {
      exportToCSV(filteredData);
    } else {
      exportToJSON(filteredData);
    }
  };

  const exportToCSV = (data: Partial<Medicine>[]) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    downloadFile(csvContent, 'pharmacy-inventory.csv', 'text/csv');
  };

  const exportToJSON = (data: Partial<Medicine>[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'pharmacy-inventory.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Export Inventory Data</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'csv' | 'json') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel Compatible)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON (Data Format)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Include Fields</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(includeFields).map(([field, checked]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={() => handleFieldToggle(field as keyof typeof includeFields)}
                  />
                  <Label htmlFor={field} className="text-sm capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export will include {medicines.length} medicine record{medicines.length !== 1 ? 's' : ''} 
              with {Object.values(includeFields).filter(Boolean).length} field{Object.values(includeFields).filter(Boolean).length !== 1 ? 's' : ''}.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={exportData}
              className="flex items-center gap-2"
              disabled={!Object.values(includeFields).some(Boolean)}
            >
              <Download className="h-4 w-4" />
              Export {exportFormat.toUpperCase()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportModal;
