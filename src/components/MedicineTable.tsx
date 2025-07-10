
import React, { useState } from 'react';
import { Edit, Trash2, AlertTriangle, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Medicine } from '@/types/medicine';
import MedicineForm from './MedicineForm';

interface MedicineTableProps {
  medicines: Medicine[];
  onEdit: (id: string, medicine: Partial<Medicine>) => void;
  onDelete: (id: string) => void;
}

const MedicineTable: React.FC<MedicineTableProps> = ({ medicines, onEdit, onDelete }) => {
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(medicines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMedicines = medicines.slice(startIndex, startIndex + itemsPerPage);

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const isLowStock = (medicine: Medicine) => {
    return medicine.quantity <= medicine.lowStockThreshold;
  };

  const handleEdit = (medicine: Omit<Medicine, 'id'>) => {
    if (editingMedicine) {
      onEdit(editingMedicine.id, medicine);
      setEditingMedicine(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No medicines found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {medicines.length === 0 ? 'Start by adding your first medicine to the inventory.' : 'Try adjusting your search or filters.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Medicine</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Batch No.</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Quantity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Expiry Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Company</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicines.map((medicine) => (
              <tr key={medicine.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">{medicine.name}</div>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{medicine.batchNo}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline">{medicine.category}</Badge>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-medium ${isLowStock(medicine) ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {medicine.quantity}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">${medicine.price.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${
                      isExpired(medicine.expiryDate) 
                        ? 'text-red-600 font-medium' 
                        : isExpiringSoon(medicine.expiryDate) 
                          ? 'text-amber-600 font-medium' 
                          : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {formatDate(medicine.expiryDate)}
                    </span>
                    {(isExpired(medicine.expiryDate) || isExpiringSoon(medicine.expiryDate)) && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{medicine.company}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    {isExpired(medicine.expiryDate) && (
                      <Badge variant="destructive" className="text-xs">Expired</Badge>
                    )}
                    {!isExpired(medicine.expiryDate) && isExpiringSoon(medicine.expiryDate) && (
                      <Badge variant="destructive" className="text-xs bg-amber-500">Expiring Soon</Badge>
                    )}
                    {isLowStock(medicine) && (
                      <Badge variant="destructive" className="text-xs bg-orange-500">Low Stock</Badge>
                    )}
                    {!isExpired(medicine.expiryDate) && !isExpiringSoon(medicine.expiryDate) && !isLowStock(medicine) && (
                      <Badge variant="default" className="text-xs bg-green-500">Good</Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMedicine(medicine)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{medicine.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(medicine.id)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, medicines.length)} of {medicines.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {editingMedicine && (
        <MedicineForm
          medicine={editingMedicine}
          onSubmit={handleEdit}
          onCancel={() => setEditingMedicine(null)}
        />
      )}
    </>
  );
};

export default MedicineTable;
