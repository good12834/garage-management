/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parser
  app.use(express.json());

  // Simple logger middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url}`);
    next();
  });

  // API - Dashboard Stats
  app.get('/api/dashboard/stats', (req: Request, res: Response) => {
    try {
      const stats = db.getDashboardStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch dashboard stats', details: err.message });
    }
  });

  // API - Customers
  app.get('/api/customers', (req: Request, res: Response) => {
    try {
      const list = db.customers.find();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve customers', details: err.message });
    }
  });

  app.get('/api/customers/:id', (req: Request, res: Response) => {
    try {
      const customer = db.customers.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      // Return customer + list of their vehicles & services for a detailed view
      const vehicles = db.vehicles.find({ customerId: customer.id });
      const services = db.services.find({ customerId: customer.id });
      const workorders = db.workorders.find({ customerId: customer.id });
      res.json({ ...customer, vehicles, services, workorders });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve customer details', details: err.message });
    }
  });

  app.post('/api/customers', (req: Request, res: Response) => {
    try {
      const { name, email, phone, address } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Missing required customer parameters (name, email, phone)' });
      }
      const newCustomer = db.customers.create({ name, email, phone, address: address || '' });
      res.status(201).json(newCustomer);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to register customer', details: err.message });
    }
  });

  app.put('/api/customers/:id', (req: Request, res: Response) => {
    try {
      const updated = db.customers.findByIdAndUpdate(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update customer', details: err.message });
    }
  });

  app.delete('/api/customers/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.customers.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ message: 'Customer registered deletion successfully', deleted });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete customer', details: err.message });
    }
  });

  // API - Vehicles
  app.get('/api/vehicles', (req: Request, res: Response) => {
    try {
      const list = db.vehicles.find();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve vehicles', details: err.message });
    }
  });

  app.get('/api/vehicles/:id', (req: Request, res: Response) => {
    try {
      const vehicle = db.vehicles.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      const services = db.services.find({ vehicleId: vehicle.id });
      const workorders = db.workorders.find({ vehicleId: vehicle.id });
      res.json({ ...vehicle, services, workorders });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve vehicle details', details: err.message });
    }
  });

  app.post('/api/vehicles', (req: Request, res: Response) => {
    try {
      const { customerId, make, model, year, licensePlate, vin, mileage } = req.body;
      if (!customerId || !make || !model || !year || !licensePlate) {
        return res.status(400).json({ error: 'Missing required vehicle parameters (customerId, make, model, year, licensePlate)' });
      }
      // Ensure customer exists
      const customer = db.customers.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Target customer owner not found' });
      }
      const newVehicle = db.vehicles.create({
        customerId,
        make,
        model,
        year: Number(year),
        licensePlate,
        vin: vin || '',
        mileage: Number(mileage || 0)
      });
      res.status(201).json(newVehicle);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to register vehicle', details: err.message });
    }
  });

  app.put('/api/vehicles/:id', (req: Request, res: Response) => {
    try {
      const payload = { ...req.body };
      if (payload.year) payload.year = Number(payload.year);
      if (payload.mileage) payload.mileage = Number(payload.mileage);

      const updated = db.vehicles.findByIdAndUpdate(req.params.id, payload);
      if (!updated) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update vehicle', details: err.message });
    }
  });

  app.delete('/api/vehicles/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.vehicles.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.json({ message: 'Vehicle deleted successfully', deleted });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete vehicle', details: err.message });
    }
  });

  // API - Services
  app.get('/api/services', (req: Request, res: Response) => {
    try {
      const list = db.services.find();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve service records', details: err.message });
    }
  });

  app.post('/api/services', (req: Request, res: Response) => {
    try {
      const { vehicleId, customerId, serviceDate, description, cost, category, performedBy } = req.body;
      if (!vehicleId || !customerId || !description || cost === undefined || !category) {
        return res.status(400).json({ error: 'Missing required service parameters' });
      }
      const newService = db.services.create({
        vehicleId,
        customerId,
        serviceDate: serviceDate || new Date().toISOString(),
        description,
        cost: Number(cost),
        category,
        performedBy: performedBy || 'Mechanic'
      });
      res.status(201).json(newService);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record service log', details: err.message });
    }
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    try {
      const payload = { ...req.body };
      if (payload.cost) payload.cost = Number(payload.cost);

      const updated = db.services.findByIdAndUpdate(req.params.id, payload);
      if (!updated) {
        return res.status(404).json({ error: 'Service record not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update service record', details: err.message });
    }
  });

  app.delete('/api/services/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.services.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Service record not found' });
      }
      res.json({ message: 'Service record deleted', deleted });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete service record', details: err.message });
    }
  });

  // API - Work Orders
  app.get('/api/workorders', (req: Request, res: Response) => {
    try {
      const list = db.workorders.find();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve work orders', details: err.message });
    }
  });

  app.post('/api/workorders', (req: Request, res: Response) => {
    try {
      const { vehicleId, customerId, description, status, priority, estimatedCost, startDate, estimatedCompletionDate } = req.body;
      if (!vehicleId || !customerId || !description) {
        return res.status(400).json({ error: 'Missing required work order parameters (vehicleId, customerId, description)' });
      }
      const newWO = db.workorders.create({
        vehicleId,
        customerId,
        description,
        status: status || 'Pending',
        priority: priority || 'Medium',
        estimatedCost: Number(estimatedCost || 0),
        startDate: startDate || new Date().toISOString(),
        estimatedCompletionDate: estimatedCompletionDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
      res.status(201).json(newWO);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create work order', details: err.message });
    }
  });

  app.put('/api/workorders/:id', (req: Request, res: Response) => {
    try {
      const payload = { ...req.body };
      if (payload.estimatedCost) payload.estimatedCost = Number(payload.estimatedCost);

      const updated = db.workorders.findByIdAndUpdate(req.params.id, payload);
      if (!updated) {
        return res.status(404).json({ error: 'Work order not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update work order', details: err.message });
    }
  });

  app.delete('/api/workorders/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.workorders.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Work order not found' });
      }
      res.json({ message: 'Work order deleted', deleted });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete work order', details: err.message });
    }
  });

  // API - Invoices
  app.get('/api/invoices', (req: Request, res: Response) => {
    try {
      const list = db.invoices.find();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve invoices', details: err.message });
    }
  });

  app.post('/api/invoices', (req: Request, res: Response) => {
    try {
      const { workOrderId, customerId, vehicleId, issueDate, dueDate, subtotal, tax, discount, total, status, amountPaid } = req.body;
      if (!customerId || !vehicleId || total === undefined) {
        return res.status(400).json({ error: 'Missing invoice fields' });
      }
      const newInv = db.invoices.create({
        workOrderId: workOrderId || 'Direct Sale',
        customerId,
        vehicleId,
        issueDate: issueDate || new Date().toISOString(),
        dueDate: dueDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        subtotal: Number(subtotal || total),
        tax: Number(tax || 0),
        discount: Number(discount || 0),
        total: Number(total),
        status: status || 'Unpaid',
        amountPaid: Number(amountPaid || 0)
      });
      res.status(201).json(newInv);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to issue invoice', details: err.message });
    }
  });

  app.put('/api/invoices/:id', (req: Request, res: Response) => {
    try {
      const payload = { ...req.body };
      if (payload.subtotal) payload.subtotal = Number(payload.subtotal);
      if (payload.tax) payload.tax = Number(payload.tax);
      if (payload.discount) payload.discount = Number(payload.discount);
      if (payload.total) payload.total = Number(payload.total);
      if (payload.amountPaid !== undefined) payload.amountPaid = Number(payload.amountPaid);

      const updated = db.invoices.findByIdAndUpdate(req.params.id, payload);
      if (!updated) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update invoice', details: err.message });
    }
  });

  app.delete('/api/invoices/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.invoices.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json({ message: 'Invoice deleted', deleted });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete invoice', details: err.message });
    }
  });

  // Generic 404 handler for API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({ error: `API route ${req.method} ${req.baseUrl} not found` });
  });

  // Serve static UI assets (Vite handling)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Garage Manager ready on http://localhost:${PORT}`);
  });
}

// Global unhandled error recovery
process.on('uncaughtException', (err) => {
  console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL UNHANDLED REJECTION AT:', promise, 'REASON:', reason);
});

startServer();
