/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Vehicle, Customer } from '../types';
import { SearchBar, DataTable, Modal, ConfirmDialog } from '../components/Shared';
import { Car, User, Milestone, ShieldAlert, Badge, Calendar, Trash2, Edit } from 'lucide-react';

interface VehiclesPageProps {
  id?: string;
  vehicles: Vehicle[];
  customers: Customer[];
  onAdd: (payload: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  onEdit: (id: string, payload: Partial<Vehicle>) => void;
  onDelete: (id: string) => void;
}

export function VehiclesPage({ id, vehicles, customers, onAdd, onEdit, onDelete }: VehiclesPageProps) {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    customerId: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    mileage: 0
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters vehicle lists
  const filtered = vehicles.filter(v => {
    const q = search.toLowerCase();
    const ownerName = v.customerName || '';
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.licensePlate.toLowerCase().includes(q) ||
      v.vin.toLowerCase().includes(q) ||
      ownerName.toLowerCase().includes(q)
    );
  });

  const openAddForm = () => {
    setFormData({
      id: '',
      customerId: customers[0]?.id || '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      vin: '',
      mileage: 0
    });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (item: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      id: item.id,
      customerId: item.customerId,
      make: item.make,
      model: item.model,
      year: item.year,
      licensePlate: item.licensePlate,
      vin: item.vin,
      mileage: item.mileage
    });
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (item: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.make || !formData.model || !formData.year || !formData.licensePlate) return;

    if (isEditMode) {
      onEdit(formData.id, {
        customerId: formData.customerId,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        licensePlate: formData.licensePlate.toUpperCase(),
        vin: formData.vin.toUpperCase(),
        mileage: Number(formData.mileage)
      });
    } else {
      onAdd({
        customerId: formData.customerId,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        licensePlate: formData.licensePlate.toUpperCase(),
        vin: formData.vin.toUpperCase(),
        mileage: Number(formData.mileage)
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

  const columns = [
    {
      header: 'Vehicle Model',
      accessor: (item: Vehicle) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm shrink-0">
            <Car size={18} />
          </div>
          <div>
            <span className="font-bold text-slate-905 block">{item.year} {item.make} {item.model}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5 inline-block bg-slate-100 px-1.5 py-0.5 rounded-sm uppercase">Plate: {item.licensePlate}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Customer Owner',
      accessor: (item: Vehicle) => {
        const owner = customers.find(c => c.id === item.customerId);
        return (
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
              {owner ? owner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <span className="font-semibold text-slate-700 block">{owner ? owner.name : 'Unknown Owner'}</span>
              <span className="text-[10px] text-slate-400 font-mono">Ref: {item.customerId.slice(0, 8)}...</span>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Milestone Mileage',
      accessor: (item: Vehicle) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold font-mono">
          <Milestone size={14} className="text-slate-400 shrink-0" />
          <span>{item.mileage.toLocaleString()} mi</span>
        </div>
      )
    },
    {
      header: 'VIN (Vehicle ID Num)',
      accessor: (item: Vehicle) => (
        <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider block max-w-[150px] truncate">
          {item.vin || '—'}
        </span>
      )
    },
    {
      header: 'Registered At',
      accessor: (item: Vehicle) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar size={13} className="text-slate-400" />
          <span>{new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      )
    }
  ];

  return (
    <div id={id} className="space-y-6">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vehicle Fleet Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track diagnostic metrics, ownership relationships, and odometer milestones.</p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <SearchBar
        placeholder="Search fleet by make, model, state plates, owner name..."
        value={search}
        onChange={setSearch}
        onAddClick={customers.length > 0 ? openAddForm : undefined}
        addButtonLabel="Register Vehicle"
      >
        {customers.length === 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg flex items-center gap-1.5 mb-2 sm:mb-0">
            <ShieldAlert size={14} />
            <span>Register a Customer first</span>
          </span>
        )}
      </SearchBar>

      {/* COMPACT DATA TABLE */}
      <DataTable
        columns={columns}
        data={filtered}
        onEditClick={openEditForm}
        onDeleteClick={openDeleteDialog}
        emptyMessage={
          customers.length === 0
            ? "Create your first Customer in the Customers panel before registering matching vehicles."
            : "No vehicles in standard matching query. Press 'Register Vehicle'."
        }
      />

      {/* ADD/EDIT VEHICLE MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditMode ? 'Modify Vehicle Register' : 'Register New Fleet Vehicle'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            
            {/* Customer select box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer Owner / Account *</label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors cursor-pointer"
              >
                <option value="" disabled>-- Associate existing customer account --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>

            {/* Model variables lines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Manufacturer / Make *</label>
                <input
                  type="text"
                  required
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors"
                  placeholder="Toyota"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Model Name *</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors"
                  placeholder="Prius"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Year Model *</label>
                <input
                  type="number"
                  required
                  min={1900}
                  max={new Date().getFullYear() + 2}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">License Plates *</label>
                <input
                  type="text"
                  required
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors uppercase placeholder:normal-case"
                  placeholder="TX-22B9X"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Odometer (Mileage) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">VIN (Vehicle Identification Number)</label>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                maxLength={17}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 transition-colors font-mono uppercase placeholder:normal-case"
                placeholder="17-Digit AlphaNumeric ID Code"
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
              {isEditMode ? 'Save Changes' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* VEHICLE CASCADE WARNING DIALOG */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Vehicle Deletion"
        message="Are you absolutely sure you want to dismiss this vehicle ledger file? Deleting this record will delete all active work orders and historical service receipts linked specifically to this chassis plate. This is irreversible."
      />
    </div>
  );
}
