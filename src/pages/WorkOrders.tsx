/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorkOrder, Vehicle, Customer, WorkOrderStatus, WorkOrderPriority } from '../types';
import { SearchBar, DataTable, Modal, ConfirmDialog } from '../components/Shared';
import { CheckSquare, Calendar, DollarSign, Clock, AlertTriangle, ShieldCheck, ChevronRight, Play, CheckCircle } from 'lucide-react';

interface WorkOrdersPageProps {
  id?: string;
  workorders: WorkOrder[];
  vehicles: Vehicle[];
  customers: Customer[];
  onAdd: (payload: Omit<WorkOrder, 'id' | 'createdAt'>) => void;
  onEdit: (id: string, payload: Partial<WorkOrder>) => void;
  onDelete: (id: string) => void;
}

export function WorkOrdersPage({ id, workorders, vehicles, customers, onAdd, onEdit, onDelete }: WorkOrdersPageProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<WorkOrderStatus | 'All'>('All');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    customerId: '',
    vehicleId: '',
    description: '',
    status: 'Pending' as WorkOrderStatus,
    priority: 'Medium' as WorkOrderPriority,
    estimatedCost: 0,
    startDate: new Date().toISOString().slice(0, 10),
    estimatedCompletionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Status lists
  const statusTabs: (WorkOrderStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

  // Priority layout styles
  const getPriorityBadge = (p: WorkOrderPriority) => {
    const map: Record<WorkOrderPriority, string> = {
      'Urgent': 'bg-red-100 text-red-800 border-red-200',
      'High': 'bg-amber-100 text-amber-800 border-amber-200',
      'Medium': 'bg-blue-100 text-blue-800 border-blue-200',
      'Low': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return map[p] || 'bg-slate-100 text-slate-600';
  };

  const getStatusBadge = (s: WorkOrderStatus) => {
    const map: Record<WorkOrderStatus, string> = {
      'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100 font-bold',
      'In Progress': 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse font-semibold',
      'Pending': 'bg-blue-50 text-blue-700 border-blue-100 font-semibold',
      'Cancelled': 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return map[s] || 'bg-slate-100 text-slate-600';
  };

  // Filter query
  const filtered = workorders.filter(w => {
    const q = search.toLowerCase();
    const matchesSearch = (
      w.description.toLowerCase().includes(q) ||
      (w.vehicleInfo && w.vehicleInfo.toLowerCase().includes(q)) ||
      (w.customerName && w.customerName.toLowerCase().includes(q))
    );
    const matchesTab = activeTab === 'All' || w.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const openAddForm = () => {
    setFormData({
      id: '',
      customerId: customers[0]?.id || '',
      vehicleId: vehicles[0]?.id || '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      estimatedCost: 120,
      startDate: new Date().toISOString().slice(0, 10),
      estimatedCompletionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (item: WorkOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      id: item.id,
      customerId: item.customerId,
      vehicleId: item.vehicleId,
      description: item.description,
      status: item.status,
      priority: item.priority,
      estimatedCost: item.estimatedCost,
      startDate: new Date(item.startDate).toISOString().slice(0, 10),
      estimatedCompletionDate: new Date(item.estimatedCompletionDate).toISOString().slice(0, 10)
    });
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleQuickStatusChange = (item: WorkOrder, nextStatus: WorkOrderStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item.id, { status: nextStatus });
  };

  const openDeleteDialog = (item: WorkOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.vehicleId || !formData.description) return;

    const payload = {
      customerId: formData.customerId,
      vehicleId: formData.vehicleId,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      estimatedCost: Number(formData.estimatedCost),
      startDate: new Date(formData.startDate).toISOString(),
      estimatedCompletionDate: new Date(formData.estimatedCompletionDate).toISOString()
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

  // Filter vehicles depending on selected customer during addition
  const getCustomerVehicles = () => {
    if (!formData.customerId) return vehicles;
    return vehicles.filter(v => v.customerId === formData.customerId);
  };

  const columns = [
    {
      header: 'Diagnostics Plan / Job Scope',
      accessor: (item: WorkOrder) => (
        <div className="max-w-[400px]">
          <span className="font-bold text-slate-800 block line-clamp-2 leading-relaxed">{item.description}</span>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-sm ${getPriorityBadge(item.priority)}`}>
              {item.priority} Priority
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-sm ${getStatusBadge(item.status)}`}>
              {item.status}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Customer & Fleet Vehicle',
      accessor: (item: WorkOrder) => {
        const v = vehicles.find(veh => veh.id === item.vehicleId);
        const c = customers.find(cust => cust.id === item.customerId);
        return (
          <div className="text-xs">
            <span className="font-bold text-slate-700 block">{c ? c.name : 'Unknown Customer'}</span>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{v ? `${v.year} ${v.make} ${v.model} (${v.licensePlate})` : '—'}</span>
          </div>
        );
      }
    },
    {
      header: 'Estimated Cost',
      accessor: (item: WorkOrder) => (
        <span className="font-bold text-slate-900 font-mono text-xs">${item.estimatedCost.toFixed(2)}</span>
      )
    },
    {
      header: 'Target Timelines',
      accessor: (item: WorkOrder) => (
        <div className="space-y-0.5 text-xs text-slate-500 font-medium font-sans">
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Start:</span>
            <span>{new Date(item.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Target:</span>
            <span>{new Date(item.estimatedCompletionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Interactive Pipelines',
      accessor: (item: WorkOrder) => (
        <div className="flex items-center gap-1.5">
          {item.status === 'Pending' && (
            <button
              onClick={(e) => handleQuickStatusChange(item, 'In Progress', e)}
              className="flex items-center gap-1 py-1 px-2 border border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100 rounded-md text-[10px] font-bold select-none cursor-pointer transition-all"
            >
              <Play size={10} />
              <span>Start Work</span>
            </button>
          )}
          {item.status === 'In Progress' && (
            <button
              onClick={(e) => handleQuickStatusChange(item, 'Completed', e)}
              className="flex items-center gap-1 py-1 px-2 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md text-[10px] font-bold select-none cursor-pointer transition-all animate-pulse"
            >
              <CheckCircle size={10} />
              <span>Authorize Complete</span>
            </button>
          )}
          {item.status === 'Completed' && (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
              ✓ Invoiced & Logged
            </span>
          )}
          {item.status === 'Cancelled' && (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
              Closed
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div id={id} className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Work Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control pipeline tasks, prioritize urgent jobs, and monitor diagnostic estimated targets.</p>
        </div>
      </div>

      {/* PIPELINE TABS FILTERS CONTAINER */}
      <div className="flex items-center border-b border-slate-200/80 gap-6 overflow-x-auto pb-0.5 select-none scrollbar-none shrink-0 text-sm">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-1 border-b-2 font-bold transition-all text-xs uppercase tracking-wider cursor-pointer ${
              activeTab === tab
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GENERAL FILTERS */}
      <SearchBar
        placeholder="Filter queue by job description, owner, vehicles models..."
        value={search}
        onChange={setSearch}
        onAddClick={vehicles.length > 0 ? openAddForm : undefined}
        addButtonLabel="Launch Work Order"
      >
        {vehicles.length === 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span>Map a Vehicle profile first</span>
          </span>
        )}
      </SearchBar>

      {/* COMPACT DATA TABLE */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(item) => setIsFormOpen(true)} // Let's trigger editing
        onEditClick={openEditForm}
        onDeleteClick={openDeleteDialog}
        emptyMessage={
          vehicles.length === 0
            ? "Create customers and vehicles under repair to list Diagnostic Queues."
            : `No matching work orders in '${activeTab}' pipeline status.`
        }
      />

      {/* ADD/EDIT WORK ORDER MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditMode ? 'Modify Diagnostic & Work Scope' : 'Issue Dynamic Work Order'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            
            {/* Customer select box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer Client Owner *</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => {
                    const custId = e.target.value;
                    const matchingVeh = vehicles.filter(v => v.customerId === custId);
                    setFormData({
                      ...formData,
                      customerId: custId,
                      vehicleId: matchingVeh[0]?.id || ''
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 cursor-pointer"
                >
                  <option value="" disabled>-- Associate customer directory file --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle selector limited to picked Customer */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Associated Fleet Vehicle *</label>
                <select
                  required
                  value={formData.vehicleId}
                  disabled={!formData.customerId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 disabled:bg-slate-50 cursor-pointer"
                >
                  <option value="" disabled>-- Pick matching chassis --</option>
                  {getCustomerVehicles().map(v => (
                    <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} ({v.licensePlate})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing priorities & status controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Estimated Cost ($) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Job Severity / Priority *</label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as WorkOrderPriority })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Pipeline Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as WorkOrderStatus })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 cursor-pointer"
                >
                  <option value="Pending">Pending Queue</option>
                  <option value="In Progress">In Progress Repair</option>
                  <option value="Completed">Completed Work</option>
                  <option value="Cancelled">Cancelled Closed</option>
                </select>
              </div>
            </div>

            {/* Deadlines fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Execution Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Estimated Completion *</label>
                <input
                  type="date"
                  required
                  value={formData.estimatedCompletionDate}
                  onChange={(e) => setFormData({ ...formData, estimatedCompletionDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 mr-2"
                />
              </div>
            </div>

            {/* Scope details */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Detailed Scope of Work *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 leading-relaxed"
                placeholder="Ex. Diagnose under-dash squeak. Perform AC blower test. Clean filters and mechanical check oil leaks..."
              />
            </div>
            
            {formData.status === 'Completed' && (
              <p className="text-xs font-semibold text-emerald-600 p-3 bg-emerald-50 rounded-lg">
                ★ <strong>System Automation Notice:</strong> Authorizing this status as [Completed] will trigger a cascade that automatically publishes a corresponding Customer Invoice and registers an associated Service Record!
              </p>
            )}

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
              {isEditMode ? 'Save Work Order' : 'Launch Queue'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CANCEL QUEUE SYSTEM */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Work Deletion"
        message="Are you sure you want to delete this work order task? This action will permanently remove it from the pipeline. Outstanding invoices won't be deleted cascade but their status logs won't sync."
      />
    </div>
  );
}
