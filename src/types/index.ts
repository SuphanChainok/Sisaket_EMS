export interface Product {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minAlert: number;
  createdAt?: string;
}

export interface Center {
  _id: string;
  name: string;
  location: string;
  type: string;
  status: 'active' | 'inactive';
  contact: string;
  population: number;
  capacity: number;
}

export interface TransferItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface TransferRequest {
  _id: string;
  centerId: string;
  centerName: string;
  items: TransferItem[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  note?: string;
}

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
}