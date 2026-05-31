/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceRecord, Vehicle, ServiceCategory, Customer } from '../types';
import { SearchBar, DataTable, Modal, ConfirmDialog } from '../components/Shared';
import { Wrench, Calendar, DollarSign, UserCheck, ShieldAlert, FileText, Filter } from 'lucide-react';

interface ServiceRecordsPageProps {
  id?: string;
  services: ServiceRecord[];
  vehicles: Vehicle[];
  customers: Customer[];
  onAdd: (payload: Omit<ServiceRecord, 'id' | 'createdAt'>) => void;
  onEdit: (id: string, payload: Partial<ServiceRecord>) => void;
  onDelete: (id: string) => void;
}

export function ServiceRecordsPage({ id, services, vehicles, customers, onAdd, onEdit, onDelete }: ServiceRecordsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    vehicleId: '',
    serviceDate: new Date().toISOString().slice(0, 10),
    description: '',
    cost: 0,
    category: 'Routine Maintenance' as ServiceCategory,
    performedBy: ''
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories: string[] = [
    'All',
    'Routine Maintenance',
    'Engine',
    'Brakes',
    'Tires',
    'Electrical',
    'Transmission',
    'Other'
  ];

  // Map category to aesthetic CSS border colors or pill tags
  const getCatBadge = (cat: string) => {
    const map: Record<string, string> = {
      'Engine': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Brakes': 'bg-rose-50 text-rose-700 border-rose-100',
      'Tires': 'bg-blue-50 text-blue-700 border-blue-100',
      'Electrical': 'bg-amber-50 text-amber-700 border-amber-100',
      'Routine Maintenance': 'bg-purple-50 text-purple-700 border-purple-100',
      'Transmission': 'bg-pink-50 text-pink-700 border-pink-100',
      'Other': 'bg-slate-50 text-slate-700 border-slate-100'
    };
    return map[cat] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  // Filter list
  const filtered = services.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = (
      s.description.toLowerCase().includes(q) ||
      (s.vehicleInfo && s.vehicleInfo.toLowerCase().includes(q)) ||
      (s.customerName && s.customerName.toLowerCase().includes(q)) ||
      (s.performedBy && s.performedBy.toLowerCase().includes(q))
    );
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const openAddForm = () => {
    setFormData({
      id: '',
      vehicleId: vehicles[0]?.id || '',
      serviceDate: new Date().toISOString().slice(0, 10),
      description: '',
      cost: 0,
      category: 'Routine Maintenance',
      performedBy: 'Mike T.'
    });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (item: ServiceRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      id: item.id,
      vehicleId: item.vehicleId,
      serviceDate: new Date(item.serviceDate).toISOString().slice(0, 10),
      description: item.description,
      cost: item.cost,
      category: item.category,
      performedBy: item.performedBy
    });
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (item: ServiceRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.description || formData.cost === undefined) return;

    // Retrieve corresponding owner customerId from selected vehicle
    const vehicle = vehicles.find(v => v.id === formData.vehicleId);
    if (!vehicle) return;

    const payload = {
      vehicleId: formData.vehicleId,
      customerId: vehicle.customerId,
      serviceDate: new Date(formData.serviceDate).toISOString(),
      description: formData.description,
      cost: Number(formData.cost),
      category: formData.category,
      performedBy: formData.performedBy || 'General Mechanic'
    };

    if (isEditMode) {
      onEdit(formData.id, payload);
    } else {
      onAdd(payload);
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: 'Service Description',
      accessor: (item: ServiceRecord) => (
        <div className="max-w-md">
          <span className="font-bold text-slate-800 block line-clamp-1 leading-snug">{item.description}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-sm ${getCatBadge(item.category)}`}>
              {item.category}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">• Tech: {item.performedBy}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Serviced Vehicle',
      accessor: (item: ServiceRecord) => {
        const v = vehicles.find(veh => veh.id === item.vehicleId);
        return (
          <div className="text-xs">
            <span className="font-bold text-slate-700 block">{v ? `${v.year} ${v.make} ${v.model}` : 'Unknown Vehicle'}</span>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{v ? `Plate: ${v.licensePlate}` : 'Chassis Unresolved'}</span>
          </div>
        );
      }
    },
    {
      header: 'Customer Owner',
      accessor: (item: ServiceRecord) => {
        const c = customers.find(cust => cust.id === item.customerId);
        return (
          <div className="text-xs font-semibold text-slate-600">
            <span>{c ? c.name : 'Unknown Customer'}</span>
          </div>
        );
      }
    },
    {
      header: 'Total Cost',
      accessor: (item: ServiceRecord) => (
        <div className="lex items-center gap-0.5 text-xs text-slate-900 font-bold font-mono">
          <span>${item.cost.toFixed(2)}</span>
        </div>
      )
    },
    {
      header: 'Date Performed',
      accessor: (item: ServiceRecord) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar size={13} className="text-slate-400" />
          <span>{new Date(item.serviceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      )
    }
  ];

  return (
    <div id={id} className="space-y-6">
      {/* TITLE BOARD */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Completed Service Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">Audit log of completed mechanical operations, technicians, and invoicing values.</p>
        </div>
      </div>

      {/* HORIZONTAL CATEGORY DIAL SCROLLBAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none scrollbar-none shrink-0 text-xs">
        <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-950 font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FILTER SEARCH GRID */}
      <SearchBar
        placeholder="Filter services by description, customer name, vehicle model..."
        value={search}
        onChange={setSearch}
        onAddClick={vehicles.length > 0 ? openAddForm : undefined}
        addButtonLabel="Record Service Log"
      >
        {vehicles.length === 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg flex items-center gap-1.5 mb-2 sm:mb-0">
            <ShieldAlert size={14} />
            <span>No vehicles registered. Can't save service logs.</span>
          </span>
        )}
      </SearchBar>

      {/* COMPACT COMPLETED LIST */}
      <DataTable
        columns={columns}
        data={filtered}
        onEditClick={openEditForm}
        onDeleteClick={openDeleteDialog}
        emptyMessage={
          vehicles.length === 0
            ? "Create customers and map fleet vehicles before adding service receipts."
            : "No finished services matched query filters. Log a service."
        }
      />

      {/* ENTRY POPUP MODEL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditMode ? 'Modify Service Log' : 'Record Completed Workshop Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            
            {/* Vehicle spec select box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Serviced Vehicle *</label>
              <select
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 cursor-pointer"
              >
                <option value="" disabled>-- Pick vehicle under repair --</option>
                {vehicles.map(v => {
                  const owner = customers.find(c => c.id === v.customerId);
                  return (
                    <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} - {v.licensePlate} ({owner ? owner.name : 'Unknown Owner'})</option>
                  );
                })}
              </select>
            </div>

            {/* General category grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Service Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 cursor-pointer"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Service Cost */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Invoiced Cost ($) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  step="any"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 font-mono"
                  placeholder="0.00"
                />
              </div>

              {/* Completed date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Execution Date *</label>
                <input
                  type="date"
                  required
                  value={formData.serviceDate}
                  onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Mechanic details */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Performed By (Technician) *</label>
              <input
                type="text"
                required
                value={formData.performedBy}
                onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800"
                placeholder="Mike T. / Sarah L."
              />
            </div>

            {/* Description layout content */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Service Record Operations Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 leading-relaxed"
                placeholder="Ex. Engine diagnostic trouble code scanning, replaced 4 worn standard spark plugs, topped fluids..."
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
              {isEditMode ? 'Save Log' : 'Publish Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CASCADE VERIFICATION DIALOG */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Record Deletion"
        message="This will delete this maintenance history logged event. This is generally used strictly for correcting data entry errors. This action can't be undone."
      />
    </div>
  );
}
