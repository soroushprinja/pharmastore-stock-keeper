
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Medicine } from '@/types/medicine';

interface MedicineStore {
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  initializeSampleData: () => void;
}

// Sample data for demonstration
const sampleMedicines: Omit<Medicine, 'id'>[] = [
  {
    name: 'Paracetamol 500mg',
    batchNo: 'PCM001',
    quantity: 500,
    price: 2.50,
    expiryDate: '2025-06-15',
    company: 'GSK Pharmaceuticals',
    category: 'Tablet',
    lowStockThreshold: 50,
    dateAdded: '2024-01-15'
  },
  {
    name: 'Amoxicillin 250mg',
    batchNo: 'AMX002',
    quantity: 12,
    price: 8.75,
    expiryDate: '2024-08-20',
    company: 'Pfizer Inc.',
    category: 'Capsule',
    lowStockThreshold: 25,
    dateAdded: '2024-02-10'
  },
  {
    name: 'Cough Syrup',
    batchNo: 'CS003',
    quantity: 45,
    price: 12.00,
    expiryDate: '2024-12-10',
    company: 'Johnson & Johnson',
    category: 'Syrup',
    lowStockThreshold: 20,
    dateAdded: '2024-03-05'
  },
  {
    name: 'Insulin Injection',
    batchNo: 'INS004',
    quantity: 8,
    price: 45.00,
    expiryDate: '2024-09-30',
    company: 'Novo Nordisk',
    category: 'Injection',
    lowStockThreshold: 15,
    dateAdded: '2024-01-20'
  },
  {
    name: 'Aspirin 75mg',
    batchNo: 'ASP005',
    quantity: 200,
    price: 1.25,
    expiryDate: '2025-12-31',
    company: 'Bayer AG',
    category: 'Tablet',
    lowStockThreshold: 30,
    dateAdded: '2024-02-25'
  }
];

export const useMedicineStore = create<MedicineStore>()(
  persist(
    (set, get) => ({
      medicines: [],
      
      addMedicine: (medicine) => {
        const newMedicine: Medicine = {
          ...medicine,
          id: Date.now().toString(),
        };
        set((state) => ({
          medicines: [...state.medicines, newMedicine],
        }));
      },
      
      updateMedicine: (id, updatedMedicine) => {
        set((state) => ({
          medicines: state.medicines.map((medicine) =>
            medicine.id === id ? { ...medicine, ...updatedMedicine } : medicine
          ),
        }));
      },
      
      deleteMedicine: (id) => {
        set((state) => ({
          medicines: state.medicines.filter((medicine) => medicine.id !== id),
        }));
      },

      initializeSampleData: () => {
        const currentMedicines = get().medicines;
        if (currentMedicines.length === 0) {
          const medicinesWithIds = sampleMedicines.map((medicine, index) => ({
            ...medicine,
            id: (Date.now() + index).toString(),
          }));
          set({ medicines: medicinesWithIds });
        }
      },
    }),
    {
      name: 'medicine-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeSampleData();
        }
      },
    }
  )
);
