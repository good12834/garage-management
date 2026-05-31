/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/Home';
import { ContactPage } from './pages/Contact';
import { DashboardPage } from './pages/Dashboard';
import { CustomersPage } from './pages/Customers';
import { VehiclesPage } from './pages/Vehicles';
import { ServiceRecordsPage } from './pages/ServiceRecords';
import { WorkOrdersPage } from './pages/WorkOrders';
import { InvoicesPage } from './pages/Invoices';
import { Customer, Vehicle, ServiceRecord, WorkOrder, Invoice, DashboardStats } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench } from 'lucide-react';

export default function App() {
  const [activePath, setActivePath] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorWord, setErrorWord] = useState<string | null>(null);

  // Core Entity States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [workorders, setWorkorders] = useState<WorkOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Asynchronous full syncing from Backend
  const syncWorkspaceData = async () => {
    try {
      const [resC, resV, resS, resW, resI, resStats] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/vehicles'),
        fetch('/api/services'),
        fetch('/api/workorders'),
        fetch('/api/invoices'),
        fetch('/api/dashboard/stats')
      ]);

      if (!resC.ok || !resV.ok || !resS.ok || !resW.ok || !resI.ok || !resStats.ok) {
        throw new Error('Failed to synchronize server collections.');
      }

      const [dataC, dataV, dataS, dataW, dataI, dataStats] = await Promise.all([
        resC.json(),
        resV.json(),
        resS.json(),
        resW.json(),
        resI.json(),
        resStats.json()
      ]);

      setCustomers(dataC);
      setVehicles(dataV);
      setServices(dataS);
      setWorkorders(dataW);
      setInvoices(dataI);
      setStats(dataStats);
      setErrorWord(null);
    } catch (err: any) {
      console.error('Fetch Sync error:', err);
      setErrorWord(err.message || 'Error communicating with backend database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncWorkspaceData();
  }, []);

  // API Call Helpers
  const apiCall = async (url: string, method: 'POST' | 'PUT' | 'DELETE', body?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(url, options);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Request failed with code ${res.status}`);
      }
      await syncWorkspaceData(); // refresh everything to guarantee perfect UI updates
    } catch (err: any) {
      console.error(`API Call error for ${method} ${url}:`, err);
      alert(`Operation Failed: ${err.message}`);
    }
  };

  // Customers actions
  const handleAddCustomer = (payload: Omit<Customer, 'id' | 'createdAt'>) => {
    apiCall('/api/customers', 'POST', payload);
  };
  const handleEditCustomer = (id: string, payload: Partial<Customer>) => {
    apiCall(`/api/customers/${id}`, 'PUT', payload);
  };
  const handleDeleteCustomer = (id: string) => {
    apiCall(`/api/customers/${id}`, 'DELETE');
  };
  const getCustomerProfileData = async (id: string) => {
    const res = await fetch(`/api/customers/${id}`);
    if (!res.ok) throw new Error('Customer data lookup failed.');
    return res.json();
  };

  // Vehicles actions
  const handleAddVehicle = (payload: Omit<Vehicle, 'id' | 'createdAt'>) => {
    apiCall('/api/vehicles', 'POST', payload);
  };
  const handleEditVehicle = (id: string, payload: Partial<Vehicle>) => {
    apiCall(`/api/vehicles/${id}`, 'PUT', payload);
  };
  const handleDeleteVehicle = (id: string) => {
    apiCall(`/api/vehicles/${id}`, 'DELETE');
  };

  // Services records actions
  const handleAddService = (payload: Omit<ServiceRecord, 'id' | 'createdAt'>) => {
    apiCall('/api/services', 'POST', payload);
  };
  const handleEditService = (id: string, payload: Partial<ServiceRecord>) => {
    apiCall(`/api/services/${id}`, 'PUT', payload);
  };
  const handleDeleteService = (id: string) => {
    apiCall(`/api/services/${id}`, 'DELETE');
  };

  // Work Orders actions
  const handleAddWorkOrder = (payload: Omit<WorkOrder, 'id' | 'createdAt'>) => {
    apiCall('/api/workorders', 'POST', payload);
  };
  const handleEditWorkOrder = (id: string, payload: Partial<WorkOrder>) => {
    apiCall(`/api/workorders/${id}`, 'PUT', payload);
  };
  const handleDeleteWorkOrder = (id: string) => {
    apiCall(`/api/workorders/${id}`, 'DELETE');
  };

  // Invoices actions
  const handleAddInvoice = (payload: Omit<Invoice, 'id' | 'createdAt'>) => {
    apiCall('/api/invoices', 'POST', payload);
  };
  const handleEditInvoice = (id: string, payload: Partial<Invoice>) => {
    apiCall(`/api/invoices/${id}`, 'PUT', payload);
  };
  const handleDeleteInvoice = (id: string) => {
    apiCall(`/api/invoices/${id}`, 'DELETE');
  };

  // Render Target page depending on activePath state
  const renderPageContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-24 text-center space-y-4">
          <div className="p-4 bg-slate-900 text-emerald-400 rounded-full shadow-lg animate-spin">
            <Wrench size={36} />
          </div>
          <p className="font-bold text-slate-800 text-base">Mounting database schemas...</p>
          <p className="text-xs text-slate-400 font-medium font-sans">Connecting local JSON database, compiling stats...</p>
        </div>
      );
    }

    if (errorWord) {
      return (
        <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200/60 rounded-xl text-center space-y-4 my-20">
          <div className="text-red-500 font-extrabold text-lg">Database Sync Failure</div>
          <p className="text-xs text-red-600 leading-relaxed font-sans">{errorWord}</p>
          <button
            onClick={() => {
              setLoading(true);
              syncWorkspaceData();
            }}
            className="w-full py-2 bg-slate-900 border border-slate-950 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-slate-800 transition-all cursor-pointer pointer-events-auto"
          >
            Restart Dev Server Connector
          </button>
        </div>
      );
    }

    switch (activePath) {
      case 'home':
        return (
          <HomePage
            onEnterDashboard={() => setActivePath('dashboard')}
            onNavigateToContact={() => setActivePath('contact')}
          />
        );
      case 'contact':
        return <ContactPage />;
      case 'dashboard':
        return stats ? (
          <DashboardPage stats={stats} onNavigate={setActivePath} />
        ) : null;
      case 'customers':
        return (
          <CustomersPage
            customers={customers}
            onAdd={handleAddCustomer}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            getDetails={getCustomerProfileData}
          />
        );
      case 'vehicles':
        return (
          <VehiclesPage
            vehicles={vehicles}
            customers={customers}
            onAdd={handleAddVehicle}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
          />
        );
      case 'services':
        return (
          <ServiceRecordsPage
            services={services}
            vehicles={vehicles}
            customers={customers}
            onAdd={handleAddService}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
        );
      case 'workorders':
        return (
          <WorkOrdersPage
            workorders={workorders}
            vehicles={vehicles}
            customers={customers}
            onAdd={handleAddWorkOrder}
            onEdit={handleEditWorkOrder}
            onDelete={handleDeleteWorkOrder}
          />
        );
      case 'invoices':
        return (
          <InvoicesPage
            invoices={invoices}
            customers={customers}
            vehicles={vehicles}
            onAdd={handleAddInvoice}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
          />
        );
      default:
        return <div className="text-center py-20 text-slate-400">Page not found.</div>;
    }
  };

  return (
    <AppLayout activePath={activePath} onNavigate={setActivePath}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activePath + (loading ? '-loading' : '-ready')}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="w-full"
        >
          {renderPageContent()}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}
