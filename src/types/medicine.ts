
export interface Medicine {
  id: string;
  name: string;
  batchNo: string;
  quantity: number;
  price: number;
  expiryDate: string;
  company: string;
  category: string;
  lowStockThreshold: number;
  dateAdded: string;
}

export interface FilterOptions {
  category: string;
  lowStock: boolean;
  expiringSoon: boolean;
  company: string;
}

export type MedicineCategory = 
  | 'Tablet'
  | 'Syrup'
  | 'Injection'
  | 'Capsule'
  | 'Ointment'
  | 'Drop'
  | 'Inhaler'
  | 'Other';

export const MEDICINE_CATEGORIES: MedicineCategory[] = [
  'Tablet',
  'Syrup',
  'Injection',
  'Capsule',
  'Ointment',
  'Drop',
  'Inhaler',
  'Other'
];
