/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Customer, Vehicle, ServiceRecord, WorkOrder } from '../types';
import { SearchBar, DataTable, Modal, ConfirmDialog } from '../components/Shared';
import { Users, Mail, Phone, MapPin, Calendar, Plus, Car, Wrench, CheckSquare, ChevronRight, Eye } from 'lucide-react';

interface CustomersPageProps {
  id?: string;
  customers: Customer[];
  onAdd: (payload: Omit<Customer, 'id' | 'createdAt'>) => void;
  onEdit: (id: string, payload: Partial<Customer>) => void;
  onDelete: (id: string) => void;
  // Detail views lookup getters
  getDetails: (id: string) => Promise<Customer & { vehicles: Vehicle[]; services: ServiceRecord[]; workorders: WorkOrder[] }>;
}

export function CustomersPage({ id, customers, onAdd, onEdit, onDelete, getDetails }: CustomersPageProps) {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', phone: '', address: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  // Profile detail modal states
  const [profileCustomer, setProfileCustomer] = useState<(Customer & { vehicles: Vehicle[]; services: ServiceRecord[]; workorders: WorkOrder[] }) | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Safe delete dialog states
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters search query
  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  const openAddForm = () => {
    setFormData({ id: '', name: '', email: '', phone: '', address: '' });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (item: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address
    });
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openProfile = async (item: Customer) => {
    try {
      const data = await getDetails(item.id);
      setProfileCustomer(data);
      setIsProfileOpen(true);
    } catch (err) {
      console.error('Failed to load profile specs:', err);
    }
  };

  const openDeleteDialog = (item: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!formData.name || !formData.email || !formData.phone) return;

    if (isEditMode) {
      onEdit(formData.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
    } else {
      onAdd({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  // DataTable column specs
  const columns = [
    {
      header: 'Full Name',
      accessor: (item: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs select-none shrink-0">
            {item.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{item.name}</span>
            <span className="text-[11px] font-mono text-slate-400 font-medium">{item.id.slice(0, 8)}...</span>
          </div>
        </div>
      )
    },
    {
      header: 'Contacts',
      accessor: (item: Customer) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Mail size={13} className="text-slate-400" />
            <span>{item.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Phone size={13} className="text-slate-400" />
            <span>{item.phone}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Postal Address',
      accessor: (item: Customer) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <span className="truncate max-w-[200px]">{item.address || '—'}</span>
        </div>
      )
    },
    {
      header: 'Member Since',
      accessor: (item: Customer) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar size={13} className="text-slate-400" />
          <span>{new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      )
    },
    {
      header: 'Profile',
      accessor: (item: Customer) => (
        <button
          onClick={() => openProfile(item)}
          className="flex items-center gap-1 px-2 py-1 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-md text-xs text-slate-600 font-medium transition-all select-none cursor-pointer"
        >
          <Eye size={13} />
          <span>Review</span>
        </button>
      ),
      className: 'w-24'
    }
  ];

  return (
    <div id={id} className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer credentials, registered ownerships, and diagnostic records.</p>
        </div>
      </div>

      {/* FILTER SEARCH AREA */}
      <SearchBar
        placeholder="Filter by name, email, phone, or address..."
        value={search}
        onChange={setSearch}
        onAddClick={openAddForm}
        addButtonLabel="Register Customer"
      />

      {/* CUSTOMERS DATA GRID */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={openProfile}
        onEditClick={openEditForm}
        onDeleteClick={openDeleteDialog}
        emptyMessage="No customers found. Click 'Register Customer' to start building your directory."
      />

      {/* ADD/EDIT CUSTOMER MODAL FORM */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditMode ? 'Modify Customer Profile' : 'Register New Customer'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors"
                  placeholder="555-0100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Billing Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors"
                placeholder="123 Oak Avenue, Austin, TX"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-slate-200 font-medium text-sm rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 border border-slate-950 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            >
              {isEditMode ? 'Save Changes' : 'Register Customer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CLIENT SPECIFIC RELATIONSHIPS PROFILE MODAL */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Customer Workspace File"
        size="lg"
      >
        {profileCustomer && (
          <div className="space-y-6">
            {/* Owner Details Card */}
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-100 font-bold flex items-center justify-center text-base">
                  {profileCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">{profileCustomer.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 block">Account Ref: <span className="font-mono text-[11px] font-semibold text-slate-600">{profileCustomer.id}</span></p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-xs font-semibold text-slate-600 shrink-0 md:border-l md:border-slate-200 md:pl-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-400" />
                    <span>{profileCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" />
                    <span>{profileCustomer.phone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 sm:max-w-xs">
                  <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{profileCustomer.address || 'Nominal Contact Address Unspecified'}</span>
                </div>
              </div>
            </div>

            {/* Profile Content tabs (Vehicles, Service Logs, Workorders) */}
            <div className="space-y-5">
              {/* Registered Vehicles */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Car size={16} className="text-slate-500" />
                  <span>Registered Garage Vehicles ({profileCustomer.vehicles.length})</span>
                </div>
                
                {profileCustomer.vehicles.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium py-3 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">No registered vehicles associated with this customer.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profileCustomer.vehicles.map((v) => (
                      <div key={v.id} className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{v.year} {v.make} {v.model}</span>
                          <span className="block text-[10px] font-mono font-bold text-slate-400 mt-1 select-all">Plate: {v.licensePlate} | VIN: {v.vin || '—'}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{v.mileage.toLocaleString()} mi</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Work Queue */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckSquare size={16} className="text-slate-500" />
                  <span>Current Work Orders Queue ({profileCustomer.workorders.length})</span>
                </div>

                {profileCustomer.workorders.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium py-3 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">No current pending or interactive work orders.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-lg bg-white overflow-hidden text-xs">
                    {profileCustomer.workorders.map((w) => (
                      <div key={w.id} className="p-3.5 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-800 line-clamp-1">{w.description}</span>
                          <span className="text-[10px] text-slate-400 font-medium block">Started: {new Date(w.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            w.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                            w.status === 'In Progress' ? 'bg-amber-50 text-amber-700' :
                            w.status === 'Pending' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {w.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Maintenance History */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Wrench size={16} className="text-slate-500" />
                  <span>Historic Shop Maintenance Services ({profileCustomer.services.length})</span>
                </div>

                {profileCustomer.services.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium py-3 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">No historic services registered.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-lg bg-white overflow-hidden text-xs">
                    {profileCustomer.services.map((s) => (
                      <div key={s.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800">{s.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">
                            <span>{s.category}</span>
                            <span>•</span>
                            <span>Mechanic: {s.performedBy}</span>
                            <span>•</span>
                            <span>{new Date(s.serviceDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 font-mono text-sm">${s.cost}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-100 pt-4">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* SECURE DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you absolutely sure you want to delete this customer? This action will cascade-delete all of their registered vehicles, active work orders, historical service reports, and billing invoices. This process cannot be undone."
      />
    </div>
  );
}
