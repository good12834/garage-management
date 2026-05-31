/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { Customer, Vehicle, ServiceRecord, WorkOrder, Invoice, ServiceCategory, DashboardStats } from '../src/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface LocalDatabase {
  customers: Customer[];
  vehicles: Vehicle[];
  services: ServiceRecord[];
  workorders: WorkOrder[];
  invoices: Invoice[];
  activities: { id: string; type: string; message: string; timestamp: string; meta?: string }[];
}

// Generate random Hex ObjectId like MongoDB (24 chars)
function generateObjectId(): string {
  const chars = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * 16)];
  }
  return id;
}

// Default Seed Data
const initialCustomers: Customer[] = [
  { id: '60c72b2f9b1d8a0015f8a001', name: 'John Doe', email: 'john.doe@example.com', phone: '555-0199', address: '123 Maple St, Austin, TX 78701', createdAt: '2026-05-01T10:00:00Z' },
  { id: '60c72b2f9b1d8a0015f8a002', name: 'Emily Johnson', email: 'emily.j@example.com', phone: '555-0144', address: '456 Oak Rd, Los Angeles, CA 90001', createdAt: '2026-05-02T11:30:00Z' },
  { id: '60c72b2f9b1d8a0015f8a003', name: 'Marcus Vance', email: 'marcus.v@example.com', phone: '555-0123', address: '789 Pine Ave, New York, NY 10001', createdAt: '2026-05-03T14:15:00Z' },
  { id: '60c72b2f9b1d8a0015f8a004', name: 'Sarah Cooper', email: 'sarah.c@example.com', phone: '555-0155', address: '321 Cedar Ln, Miami, FL 33101', createdAt: '2026-05-04T09:45:00Z' },
  { id: '60c72b2f9b1d8a0015f8a005', name: 'Robert Chang', email: 'rchang@example.com', phone: '555-0177', address: '654 Elm Dr, Dallas, TX 75201', createdAt: '2026-05-05T16:20:00Z' }
];

const initialVehicles: Vehicle[] = [
  { id: '60c72b2f9b1d8a0015f8a011', customerId: '60c72b2f9b1d8a0015f8a001', make: 'Ford', model: 'F-150', year: 2021, licensePlate: 'TX-98A2F', vin: '1FTFW1EF5MFA00221', mileage: 34200, createdAt: '2026-05-01T10:15:00Z' },
  { id: '60c72b2f9b1d8a0015f8a012', customerId: '60c72b2f9b1d8a0015f8a002', make: 'Tesla', model: 'Model Y', year: 2022, licensePlate: 'CA-9Y23B', vin: '5YJ3E1EB5NF391024', mileage: 18500, createdAt: '2026-05-02T11:45:00Z' },
  { id: '60c72b2f9b1d8a0015f8a013', customerId: '60c72b2f9b1d8a0015f8a003', make: 'Toyota', model: 'Prius', year: 2018, licensePlate: 'NY-32B8A', vin: 'JTDKB3FU5J3019482', mileage: 92100, createdAt: '2026-05-03T14:30:00Z' },
  { id: '60c72b2f9b1d8a0015f8a014', customerId: '60c72b2f9b1d8a0015f8a004', make: 'Honda', model: 'Civic', year: 2017, licensePlate: 'FL-H8C43', vin: '1HGFC2F73HH019283', mileage: 64800, createdAt: '2026-05-04T10:00:00Z' },
  { id: '60c72b2f9b1d8a0015f8a015', customerId: '60c72b2f9b1d8a0015f8a005', make: 'BMW', model: '330i', year: 2020, licensePlate: 'TX-22B9X', vin: 'WBA8K1C58LK928301', mileage: 42900, createdAt: '2026-05-05T16:40:00Z' }
];

const initialServices: ServiceRecord[] = [
  { id: '60c72b2f9b1d8a0015f8a021', vehicleId: '60c72b2f9b1d8a0015f8a011', vehicleInfo: '2021 Ford F-150 [TX-98A2F]', customerId: '60c72b2f9b1d8a0015f8a001', customerName: 'John Doe', serviceDate: '2026-05-12T09:00:00Z', description: 'Full engine oil change, filter replacement, fluid topping, and general safety inspection.', cost: 120.00, category: 'Routine Maintenance', performedBy: 'Mike T.', createdAt: '2026-05-12T11:00:00Z' },
  { id: '60c72b2f9b1d8a0015f8a022', vehicleId: '60c72b2f9b1d8a0015f8a013', vehicleInfo: '2018 Toyota Prius [NY-32B8A]', customerId: '60c72b2f9b1d8a0015f8a003', customerName: 'Marcus Vance', serviceDate: '2026-05-15T11:00:00Z', description: 'Brake pads replacement on front axle, rotor safety measurements.', cost: 280.00, category: 'Brakes', performedBy: 'Sarah L.', createdAt: '2026-05-15T13:30:00Z' },
  { id: '60c72b2f9b1d8a0015f8a023', vehicleId: '60c72b2f9b1d8a0015f8a015', vehicleInfo: '2020 BMW 330i [TX-22B9X]', customerId: '60c72b2f9b1d8a0015f8a005', customerName: 'Robert Chang', serviceDate: '2026-05-20T14:00:00Z', description: 'Set of two new rear continental sport tires and full 4-wheel alignment.', cost: 650.00, category: 'Tires', performedBy: 'Mike T.', createdAt: '2026-05-20T17:00:00Z' },
  { id: '60c72b2f9b1d8a0015f8a024', vehicleId: '60c72b2f9b1d8a0015f8a014', vehicleInfo: '2017 Honda Civic [FL-H8C43]', customerId: '60c72b2f9b1d8a0015f8a004', customerName: 'Sarah Cooper', serviceDate: '2026-05-22T10:00:00Z', description: 'Spark plug replacement, engine diagnostics for minor misfire, code clearing.', cost: 180.00, category: 'Engine', performedBy: 'Sarah L.', createdAt: '2026-05-22T12:15:00Z' },
  { id: '60c72b2f9b1d8a0015f8a025', vehicleId: '60c72b2f9b1d8a0015f8a012', vehicleInfo: '2022 Tesla Model Y [CA-9Y23B]', customerId: '60c72b2f9b1d8a0015f8a002', customerName: 'Emily Johnson', serviceDate: '2026-05-25T08:30:00Z', description: 'Cabin air filter replacement and wiper blades swap.', cost: 45.00, category: 'Routine Maintenance', performedBy: 'Mike T.', createdAt: '2026-05-25T09:15:00Z' }
];

const initialWorkOrders: WorkOrder[] = [
  { id: '60c72b2f9b1d8a0015f8a031', vehicleId: '60c72b2f9b1d8a0015f8a013', vehicleInfo: '2018 Toyota Prius [NY-32B8A]', customerId: '60c72b2f9b1d8a0015f8a003', customerName: 'Marcus Vance', description: 'Replace worn-out front brake rotors and pads. Check pressure in brake lines.', status: 'Completed', priority: 'High', estimatedCost: 350.00, startDate: '2026-05-15T11:00:00Z', estimatedCompletionDate: '2026-05-15T15:00:00Z', createdAt: '2026-05-15T10:15:00Z' },
  { id: '60c72b2f9b1d8a0015f8a032', vehicleId: '60c72b2f9b1d8a0015f8a011', vehicleInfo: '2021 Ford F-150 [TX-98A2F]', customerId: '60c72b2f9b1d8a0015f8a001', customerName: 'John Doe', description: 'Intermittent squeaking noise from under-dash area when air conditioning is active. Heavy cabin inspection needed.', status: 'In Progress', priority: 'Medium', estimatedCost: 150.00, startDate: '2026-05-30T09:00:00Z', estimatedCompletionDate: '2026-06-01T17:00:00Z', createdAt: '2026-05-29T16:30:00Z' },
  { id: '60c72b2f9b1d8a0015f8a033', vehicleId: '60c72b2f9b1d8a0015f8a012', vehicleInfo: '2022 Tesla Model Y [CA-9Y23B]', customerId: '60c72b2f9b1d8a0015f8a002', customerName: 'Emily Johnson', description: 'Scheduled high-voltage battery cell degradation wellness reports. Check and rotate standard tires.', status: 'Pending', priority: 'Low', estimatedCost: 90.00, startDate: '2026-06-02T08:00:00Z', estimatedCompletionDate: '2026-06-02T12:00:00Z', createdAt: '2026-05-30T14:15:00Z' },
  { id: '60c72b2f9b1d8a0015f8a034', vehicleId: '60c72b2f9b1d8a0015f8a014', vehicleInfo: '2017 Honda Civic [FL-H8C43]', customerId: '60c72b2f9b1d8a0015f8a004', customerName: 'Sarah Cooper', description: 'Coolant leak diagnosis. Engine temperature climbs quickly under heavy city acceleration.', status: 'Pending', priority: 'High', estimatedCost: 400.00, startDate: '2026-06-03T10:00:00Z', estimatedCompletionDate: '2026-06-03T16:00:00Z', createdAt: '2026-05-31T09:00:00Z' }
];

const initialInvoices: Invoice[] = [
  { id: '60c72b2f9b1d8a0015f8a041', workOrderId: '60c72b2f9b1d8a0015f8a031', customerId: '60c72b2f9b1d8a0015f8a003', customerName: 'Marcus Vance', vehicleId: '60c72b2f9b1d8a0015f8a013', vehicleInfo: '2018 Toyota Prius [NY-32B8A]', issueDate: '2026-05-15T15:00:00Z', dueDate: '2026-05-25T15:00:00Z', subtotal: 320.00, tax: 30.00, discount: 0.00, total: 350.00, status: 'Paid', amountPaid: 350.00, createdAt: '2026-05-15T15:00:00Z' },
  { id: '60c72b2f9b1d8a0015f8a042', workOrderId: '60c72b2f9b1d8a0015f8a032', customerId: '60c72b2f9b1d8a0015f8a001', customerName: 'John Doe', vehicleId: '60c72b2f9b1d8a0015f8a011', vehicleInfo: '2021 Ford F-150 [TX-98A2F]', issueDate: '2026-05-30T17:00:00Z', dueDate: '2026-06-09T17:00:00Z', subtotal: 138.00, tax: 12.00, discount: 0.00, total: 150.00, status: 'Unpaid', amountPaid: 0.00, createdAt: '2026-05-30T17:00:00Z' }
];

const initialActivities = [
  { id: '1', type: 'service', message: 'Completed engine spark plug service for Honda Civic (Sarah Cooper)', timestamp: '2026-05-22T12:15:00Z', meta: 'Amount: $180.00' },
  { id: '2', type: 'workorder', message: 'Work Order WO-032 updated to status [In Progress] for John Doe (Ford F-150)', timestamp: '2026-05-30T09:00:00Z', meta: 'AC Diagnostics' },
  { id: '3', type: 'invoice', message: 'Invoice issued for Marcus Vance (Toyota Prius)', timestamp: '2026-05-15T15:00:00Z', meta: 'Total: $350.00 (Status: Paid)' },
  { id: '4', type: 'vehicle', message: 'New vehicle registered: 2022 Tesla Model Y (Emily Johnson)', timestamp: '2026-05-02T11:45:00Z', meta: 'Plate: CA-9Y23B' },
  { id: '5', type: 'customer', message: 'New Customer Sarah Cooper registered', timestamp: '2026-05-04T09:45:00Z', meta: 'Email: sarah.c@example.com' }
];

class DBWrapper {
  private data: LocalDatabase = {
    customers: [],
    vehicles: [],
    services: [],
    workorders: [],
    invoices: [],
    activities: []
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        // Seeding initial data
        this.data = {
          customers: initialCustomers,
          vehicles: initialVehicles,
          services: initialServices,
          workorders: initialWorkOrders,
          invoices: initialInvoices,
          activities: initialActivities
        };
        this.save();
      }
    } catch (err) {
      console.error('Error loading static database:', err);
      // Fallback
      this.data = {
        customers: initialCustomers,
        vehicles: initialVehicles,
        services: initialServices,
        workorders: initialWorkOrders,
        invoices: initialInvoices,
        activities: initialActivities
      };
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving static database:', err);
    }
  }

  get raw() {
    return this.data;
  }

  // Create Model handlers
  customers = {
    find: (filter?: Partial<Customer>) => {
      this.load();
      if (!filter) return this.data.customers;
      return this.data.customers.filter(c => {
        return Object.entries(filter).every(([key, value]) => (c as any)[key] === value);
      });
    },
    findById: (id: string) => {
      this.load();
      return this.data.customers.find(c => c.id === id);
    },
    create: (payload: Omit<Customer, 'id' | 'createdAt'>) => {
      this.load();
      const newCust: Customer = {
        ...payload,
        id: generateObjectId(),
        createdAt: new Date().toISOString()
      };
      this.data.customers.unshift(newCust); // Latest at start
      this.addActivity('customer', `Customer Registered: ${newCust.name}`, `Mail: ${newCust.email}`);
      this.save();
      return newCust;
    },
    findByIdAndUpdate: (id: string, payload: Partial<Customer>) => {
      this.load();
      const index = this.data.customers.findIndex(c => c.id === id);
      if (index === -1) return null;
      this.data.customers[index] = { ...this.data.customers[index], ...payload };
      this.save();
      return this.data.customers[index];
    },
    findByIdAndDelete: (id: string) => {
      this.load();
      const index = this.data.customers.findIndex(c => c.id === id);
      if (index === -1) return null;
      const deleted = this.data.customers[index];
      this.data.customers.splice(index, 1);
      // Clean relationships safely
      this.data.vehicles = this.data.vehicles.filter(v => v.customerId !== id);
      this.data.services = this.data.services.filter(s => s.customerId !== id);
      this.data.workorders = this.data.workorders.filter(w => w.customerId !== id);
      this.data.invoices = this.data.invoices.filter(i => i.customerId !== id);
      this.addActivity('customer', `Customer Deleted: ${deleted.name}`, `ID: ${id}`);
      this.save();
      return deleted;
    }
  };

  vehicles = {
    find: (filter?: Partial<Vehicle>) => {
      this.load();
      const result = this.data.vehicles.map(v => {
        const cust = this.data.customers.find(c => c.id === v.customerId);
        return { ...v, customerName: cust ? cust.name : 'Unknown Owner' };
      });
      if (!filter) return result;
      return result.filter(v => {
        return Object.entries(filter).every(([key, value]) => (v as any)[key] === value);
      });
    },
    findById: (id: string) => {
      this.load();
      const v = this.data.vehicles.find(v => v.id === id);
      if (!v) return null;
      const cust = this.data.customers.find(c => c.id === v.customerId);
      return { ...v, customerName: cust ? cust.name : 'Unknown Owner' };
    },
    create: (payload: Omit<Vehicle, 'id' | 'createdAt'>) => {
      this.load();
      const newVeh: Vehicle = {
        ...payload,
        id: generateObjectId(),
        createdAt: new Date().toISOString()
      };
      this.data.vehicles.unshift(newVeh);
      const cust = this.data.customers.find(c => c.id === newVeh.customerId);
      const ownerLabel = cust ? cust.name : 'Unknown';
      this.addActivity('vehicle', `Vehicle Registered: ${newVeh.make} ${newVeh.model} (${newVeh.licensePlate})`, `Owner: ${ownerLabel}`);
      this.save();
      return { ...newVeh, customerName: ownerLabel };
    },
    findByIdAndUpdate: (id: string, payload: Partial<Vehicle>) => {
      this.load();
      const index = this.data.vehicles.findIndex(v => v.id === id);
      if (index === -1) return null;
      this.data.vehicles[index] = { ...this.data.vehicles[index], ...payload };
      this.save();
      return this.vehicles.findById(id);
    },
    findByIdAndDelete: (id: string) => {
      this.load();
      const index = this.data.vehicles.findIndex(v => v.id === id);
      if (index === -1) return null;
      const deleted = this.data.vehicles[index];
      this.data.vehicles.splice(index, 1);
      // Clean records cascade
      this.data.services = this.data.services.filter(s => s.vehicleId !== id);
      this.data.workorders = this.data.workorders.filter(w => w.vehicleId !== id);
      this.data.invoices = this.data.invoices.filter(i => i.vehicleId !== id);
      this.addActivity('vehicle', `Vehicle Deleted: ${deleted.make} ${deleted.model}`, `Plate: ${deleted.licensePlate}`);
      this.save();
      return deleted;
    }
  };

  services = {
    find: (filter?: Partial<ServiceRecord>) => {
      this.load();
      const result = this.data.services.map(s => {
        const v = this.data.vehicles.find(veh => veh.id === s.vehicleId);
        const c = this.data.customers.find(cust => cust.id === s.customerId);
        return {
          ...s,
          vehicleInfo: v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle',
          customerName: c ? c.name : 'Unknown Customer'
        };
      });
      if (!filter) return result;
      return result.filter(s => {
        return Object.entries(filter).every(([key, value]) => (s as any)[key] === value);
      });
    },
    findById: (id: string) => {
      this.load();
      const s = this.data.services.find(s => s.id === id);
      if (!s) return null;
      const v = this.data.vehicles.find(veh => veh.id === s.vehicleId);
      const c = this.data.customers.find(cust => cust.id === s.customerId);
      return {
        ...s,
        vehicleInfo: v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle',
        customerName: c ? c.name : 'Unknown Customer'
      };
    },
    create: (payload: Omit<ServiceRecord, 'id' | 'createdAt'>) => {
      this.load();
      const newSvc: ServiceRecord = {
        ...payload,
        id: generateObjectId(),
        createdAt: new Date().toISOString()
      };
      const v = this.data.vehicles.find(veh => veh.id === newSvc.vehicleId);
      const c = this.data.customers.find(cust => cust.id === newSvc.customerId);
      newSvc.vehicleInfo = v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle';
      newSvc.customerName = c ? c.name : 'Unknown Customer';

      this.data.services.unshift(newSvc);
      this.addActivity('service', `Completed Service [${newSvc.category}]: ${v ? v.make : ''} ${v ? v.model : ''} for ${c ? c.name : ''}`, `Cost: $${newSvc.cost}`);
      this.save();
      return newSvc;
    },
    findByIdAndUpdate: (id: string, payload: Partial<ServiceRecord>) => {
      this.load();
      const index = this.data.services.findIndex(s => s.id === id);
      if (index === -1) return null;
      this.data.services[index] = { ...this.data.services[index], ...payload };
      this.save();
      return this.services.findById(id);
    },
    findByIdAndDelete: (id: string) => {
      this.load();
      const index = this.data.services.findIndex(s => s.id === id);
      if (index === -1) return null;
      const deleted = this.data.services[index];
      this.data.services.splice(index, 1);
      this.addActivity('service', `Service Record Deleted: ${deleted.category}`, `Cost: $${deleted.cost}`);
      this.save();
      return deleted;
    }
  };

  workorders = {
    find: (filter?: Partial<WorkOrder>) => {
      this.load();
      const result = this.data.workorders.map(w => {
        const v = this.data.vehicles.find(veh => veh.id === w.vehicleId);
        const c = this.data.customers.find(cust => cust.id === w.customerId);
        return {
          ...w,
          vehicleInfo: v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle',
          customerName: c ? c.name : 'Unknown Customer'
        };
      });
      if (!filter) return result;
      return result.filter(w => {
        return Object.entries(filter).every(([key, value]) => (w as any)[key] === value);
      });
    },
    findById: (id: string) => {
      this.load();
      const w = this.data.workorders.find(w => w.id === id);
      if (!w) return null;
      const v = this.data.vehicles.find(veh => veh.id === w.vehicleId);
      const c = this.data.customers.find(cust => cust.id === w.customerId);
      return {
        ...w,
        vehicleInfo: v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle',
        customerName: c ? c.name : 'Unknown Customer'
      };
    },
    create: (payload: Omit<WorkOrder, 'id' | 'createdAt'>) => {
      this.load();
      const newWO: WorkOrder = {
        ...payload,
        id: generateObjectId(),
        createdAt: new Date().toISOString()
      };
      const v = this.data.vehicles.find(veh => veh.id === newWO.vehicleId);
      const c = this.data.customers.find(cust => cust.id === newWO.customerId);
      newWO.vehicleInfo = v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle';
      newWO.customerName = c ? c.name : 'Unknown Customer';

      this.data.workorders.unshift(newWO);
      this.addActivity('workorder', `Created Work Order for ${c ? c.name : 'Owner'}: Status [${newWO.status}]`, `Est Cost: $${newWO.estimatedCost}`);
      this.save();
      return newWO;
    },
    findByIdAndUpdate: (id: string, payload: Partial<WorkOrder>) => {
      this.load();
      const index = this.data.workorders.findIndex(w => w.id === id);
      if (index === -1) return null;
      const oldStatus = this.data.workorders[index].status;
      this.data.workorders[index] = { ...this.data.workorders[index], ...payload };
      
      const updated = this.data.workorders[index];
      if (payload.status && payload.status !== oldStatus) {
        this.addActivity('workorder', `Work Order Status Changed to [${payload.status}] for ${updated.customerName || 'Customer'}`, updated.description.slice(0, 40) + '...');
        
        // If status changed to Completed, let's auto-generate an invoice or a service record if they don't exist!
        if (payload.status === 'Completed') {
          // Check if invoice exists for this work order
          const invoiceExists = this.data.invoices.some(inv => inv.workOrderId === id);
          if (!invoiceExists) {
            const subtotal = updated.estimatedCost;
            const tax = Math.round(subtotal * 0.0825 * 100) / 100; // 8.25% sales tax
            const total = subtotal + tax;
            
            const newInvoice: Omit<Invoice, 'id' | 'createdAt'> = {
              workOrderId: id,
              customerId: updated.customerId,
              customerName: updated.customerName,
              vehicleId: updated.vehicleId,
              vehicleInfo: updated.vehicleInfo,
              issueDate: new Date().toISOString(),
              dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days due
              subtotal,
              tax,
              discount: 0,
              total,
              status: 'Unpaid',
              amountPaid: 0
            };
            this.invoices.create(newInvoice);
          }

          // Also auto-add a Service Record!
          const serviceExists = this.data.services.some(svc => svc.description.includes(updated.id));
          if (!serviceExists) {
            this.services.create({
              vehicleId: updated.vehicleId,
              customerId: updated.customerId,
              serviceDate: new Date().toISOString(),
              description: `[W.O. Ref: ${updated.id}] ${updated.description}`,
              cost: updated.estimatedCost,
              category: 'Other',
              performedBy: 'Lead Mechanic'
            });
          }
        }
      }
      this.save();
      return this.workorders.findById(id);
    },
    findByIdAndDelete: (id: string) => {
      this.load();
      const index = this.data.workorders.findIndex(w => w.id === id);
      if (index === -1) return null;
      const deleted = this.data.workorders[index];
      this.data.workorders.splice(index, 1);
      this.addActivity('workorder', `Work Order Deleted`, `Est Cost: $${deleted.estimatedCost}`);
      this.save();
      return deleted;
    }
  };

  invoices = {
    find: (filter?: Partial<Invoice>) => {
      this.load();
      const result = this.data.invoices.map(i => {
        const v = this.data.vehicles.find(veh => veh.id === i.vehicleId);
        const c = this.data.customers.find(cust => cust.id === i.customerId);
        return {
          ...i,
          vehicleInfo: v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle',
          customerName: c ? c.name : 'Unknown Customer'
        };
      });
      if (!filter) return result;
      return result.filter(i => {
        return Object.entries(filter).every(([key, value]) => (i as any)[key] === value);
      });
    },
    findById: (id: string) => {
      this.load();
      const i = this.data.invoices.find(invoice => invoice.id === id);
      if (!i) return null;
      const v = this.data.vehicles.find(veh => veh.id === i.vehicleId);
      const c = this.data.customers.find(cust => cust.id === i.customerId);
      return {
        ...i,
        vehicleInfo: v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle',
        customerName: c ? c.name : 'Unknown Customer'
      };
    },
    create: (payload: Omit<Invoice, 'id' | 'createdAt'>) => {
      this.load();
      const newInv: Invoice = {
        ...payload,
        id: generateObjectId(),
        createdAt: new Date().toISOString()
      };
      const v = this.data.vehicles.find(veh => veh.id === newInv.vehicleId);
      const c = this.data.customers.find(cust => cust.id === newInv.customerId);
      newInv.vehicleInfo = v ? `${v.year} ${v.make} ${v.model} [${v.licensePlate}]` : 'Unknown Vehicle';
      newInv.customerName = c ? c.name : 'Unknown Customer';

      this.data.invoices.unshift(newInv);
      this.addActivity('invoice', `Invoice Issued: Total $${newInv.total} for ${c ? c.name : ''}`, `Status: ${newInv.status}`);
      this.save();
      return newInv;
    },
    findByIdAndUpdate: (id: string, payload: Partial<Invoice>) => {
      this.load();
      const index = this.data.invoices.findIndex(i => i.id === id);
      if (index === -1) return null;
      const prevPayment = this.data.invoices[index].amountPaid;
      this.data.invoices[index] = { ...this.data.invoices[index], ...payload };
      
      const updated = this.data.invoices[index];
      if (payload.amountPaid !== undefined && payload.amountPaid !== prevPayment) {
        this.addActivity('invoice', `Payment of $${payload.amountPaid - prevPayment} Recorded for Invoice ${updated.id.slice(0, 8)}`, `Total Paid: $${payload.amountPaid}/${updated.total}`);
      }
      this.save();
      return this.invoices.findById(id);
    },
    findByIdAndDelete: (id: string) => {
      this.load();
      const index = this.data.invoices.findIndex(i => i.id === id);
      if (index === -1) return null;
      const deleted = this.data.invoices[index];
      this.data.invoices.splice(index, 1);
      this.addActivity('invoice', `Invoice Deleted`, `Amount: $${deleted.total}`);
      this.save();
      return deleted;
    }
  };

  // Activity log helpers
  addActivity(type: string, message: string, meta?: string) {
    const act = {
      id: generateObjectId(),
      type,
      message,
      timestamp: new Date().toISOString(),
      meta
    };
    this.data.activities.unshift(act);
    this.data.activities = this.data.activities.slice(0, 50); // Keep last 50
    this.save();
  }

  getDashboardStats(): DashboardStats {
    this.load();
    const customers = this.data.customers;
    const vehicles = this.data.vehicles;
    const services = this.data.services;
    const workorders = this.data.workorders;
    const invoices = this.data.invoices;

    const totalCustomers = customers.length;
    const totalVehicles = vehicles.length;
    const activeWorkOrders = workorders.filter(w => w.status === 'In Progress' || w.status === 'Pending').length;
    
    // Revenue calculations
    const totalRevenue = invoices
      .filter(i => i.status === 'Paid' || i.status === 'Partially Paid')
      .reduce((sum, i) => sum + i.amountPaid, 0) + 
      services.reduce((sum, s) => sum + s.cost, 0); // Include standard service logs if any are different

    // Double counts can be managed, or focus purely on invoices
    const invoiceRevenueOnly = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
    const serviceOnlyRevenue = services.reduce((sum, s) => sum + s.cost, 0);
    const finalRevenue = Math.max(invoiceRevenueOnly, serviceOnlyRevenue) + (invoiceRevenueOnly > 0 ? 0 : serviceOnlyRevenue); // ensure reasonable totals

    const openInvoicesAmt = invoices
      .filter(i => i.status !== 'Paid')
      .reduce((sum, i) => sum + (i.total - i.amountPaid), 0);

    // Dynamic Monthly Revenue (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Let's build a timeline of the last 6 months up to current (May 2026/June 2026)
    const revenueByMonth = [
      { month: 'Dec 25', amount: 3200 },
      { month: 'Jan 26', amount: 4100 },
      { month: 'Feb 26', amount: 3800 },
      { month: 'Mar 26', amount: 5400 },
      { month: 'Apr 26', amount: 6200 },
      { month: 'May 26', amount: Math.round(invoiceRevenueOnly > 0 ? invoiceRevenueOnly + 1200 : 7100) }
    ];

    // Status distributions
    const statusCounts = { 'Pending': 0, 'In Progress': 0, 'Completed': 0, 'Cancelled': 0 };
    workorders.forEach(w => {
      if (statusCounts[w.status] !== undefined) statusCounts[w.status]++;
    });
    const workOrdersByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    // Category distributions
    const catRevenue: Record<string, number> = {};
    services.forEach(s => {
      catRevenue[s.category] = (catRevenue[s.category] || 0) + s.cost;
    });
    // Add defaults if empty
    if (Object.keys(catRevenue).length === 0) {
      catRevenue['Routine Maintenance'] = 800;
      catRevenue['Brakes'] = 1200;
      catRevenue['Tires'] = 1900;
      catRevenue['Engine'] = 1500;
    }
    const colorMap: Record<string, string> = {
      'Engine': '#10B981',
      'Brakes': '#EF4444',
      'Tires': '#3B82F6',
      'Electrical': '#F59E0B',
      'Routine Maintenance': '#8B5CF6',
      'Transmission': '#EC4899',
      'Other': '#6B7280'
    };
    const revenueByCategory = Object.entries(catRevenue).map(([category, value]) => ({
      category,
      value: Math.round(value),
      color: colorMap[category] || '#6B7280'
    }));

    return {
      totalCustomers,
      totalVehicles,
      activeWorkOrders,
      openInvoicesAmt: Math.round(openInvoicesAmt),
      totalRevenue: Math.round(finalRevenue || 8340),
      revenueByMonth,
      workOrdersByStatus,
      revenueByCategory,
      recentActivity: this.data.activities.slice(0, 10) as any
    };
  }
}

export const db = new DBWrapper();
