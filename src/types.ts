/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  customerName?: string; // Cache for easy showing in tables
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  mileage: number;
  createdAt: string;
}

export type ServiceCategory = 
  | 'Engine' 
  | 'Brakes' 
  | 'Tires' 
  | 'Electrical' 
  | 'Routine Maintenance' 
  | 'Transmission' 
  | 'Other';

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  vehicleInfo?: string; // Cache: "Year Make Model [Plate]"
  customerId: string;
  customerName?: string; // Cache
  serviceDate: string;
  description: string;
  cost: number;
  category: ServiceCategory;
  performedBy: string;
  createdAt: string;
}

export type WorkOrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface WorkOrder {
  id: string;
  vehicleId: string;
  vehicleInfo?: string;
  customerId: string;
  customerName?: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  estimatedCost: number;
  startDate: string;
  estimatedCompletionDate: string;
  createdAt: string;
}

export type InvoiceStatus = 'Paid' | 'Partially Paid' | 'Unpaid';

export interface Invoice {
  id: string;
  workOrderId: string;
  customerId: string;
  customerName?: string;
  vehicleId: string;
  vehicleInfo?: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  amountPaid: number;
  createdAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  activeWorkOrders: number;
  openInvoicesAmt: number;
  totalRevenue: number;
  revenueByMonth: { month: string; amount: number }[];
  workOrdersByStatus: { status: string; count: number }[];
  revenueByCategory: { category: string; value: number; color?: string }[];
  recentActivity: {
    id: string;
    type: 'customer' | 'vehicle' | 'service' | 'workorder' | 'invoice';
    message: string;
    timestamp: string;
    meta?: string;
  }[];
}
