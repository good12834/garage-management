/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Invoice, Customer, Vehicle, InvoiceStatus } from '../types';
import { SearchBar, DataTable, Modal, ConfirmDialog } from '../components/Shared';
import { FileText, Calendar, DollarSign, CreditCard, ShieldCheck, Mail, MapPin, Eye, Receipt, FileSpreadsheet, Plus } from 'lucide-react';

interface InvoicesPageProps {
  id?: string;
  invoices: Invoice[];
  customers: Customer[];
  vehicles: Vehicle[];
  onAdd: (payload: Omit<Invoice, 'id' | 'createdAt'>) => void;
  onEdit: (id: string, payload: Partial<Invoice>) => void;
  onDelete: (id: string) => void;
}

export function InvoicesPage({ id, invoices, customers, vehicles, onAdd, onEdit, onDelete }: InvoicesPageProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // High-fidelity invoice slip modal states
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [incomingPayment, setIncomingPayment] = useState<number>(0);

  // Directly create direct-sale invoice modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    customerId: '',
    vehicleId: '',
    subtotal: 100,
    discount: 0,
    status: 'Unpaid' as InvoiceStatus
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Totals calculations
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalReceived = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalOutstanding = totalInvoiced - totalReceived;

  // Invoice status color badges maps
  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 font-bold';
      case 'Partially Paid':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Unpaid':
        return 'bg-rose-50 text-rose-700 border-rose-100 font-semibold';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    const matchesSearch = (
      inv.id.toLowerCase().includes(q) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(q)) ||
      (inv.vehicleInfo && inv.vehicleInfo.toLowerCase().includes(q))
    );
    const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const openReceipt = (item: Invoice) => {
    setViewInvoice(item);
    setIncomingPayment(0);
    setIsReceiptOpen(true);
  };

  const handlePostPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewInvoice || incomingPayment <= 0) return;

    const newPaid = Math.min(viewInvoice.total, viewInvoice.amountPaid + incomingPayment);
    let nextStatus: InvoiceStatus = 'Unpaid';
    if (newPaid >= viewInvoice.total) {
      nextStatus = 'Paid';
    } else if (newPaid > 0) {
      nextStatus = 'Partially Paid';
    }

    onEdit(viewInvoice.id, {
      amountPaid: newPaid,
      status: nextStatus
    });

    // Mirror updates inside state
    setViewInvoice({
      ...viewInvoice,
      amountPaid: newPaid,
      status: nextStatus
    });
    setIncomingPayment(0);
  };

  const openAddInvoice = () => {
    setAddFormData({
      customerId: customers[0]?.id || '',
      vehicleId: vehicles[0]?.id || '',
      subtotal: 150,
      discount: 0,
      status: 'Unpaid'
    });
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.customerId || !addFormData.vehicleId) return;

    const sub = Number(addFormData.subtotal);
    const disc = Number(addFormData.discount);
    const tax = Math.round((sub - disc) * 0.0825 * 100) / 100;
    const total = sub - disc + tax;

    onAdd({
      workOrderId: 'Direct Sale',
      customerId: addFormData.customerId,
      vehicleId: addFormData.vehicleId,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal: sub,
      tax,
      discount: disc,
      total,
      status: addFormData.status,
      amountPaid: addFormData.status === 'Paid' ? total : 0
    });
    setIsAddOpen(false);
  };

  const openDeleteDialog = (item: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(item.id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: 'Invoice Code & Date',
      accessor: (item: Invoice) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-slate-800">INV-{item.id.slice(0, 8).toUpperCase()}</span>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Issued: {new Date(item.issueDate).toLocaleDateString()}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Customer Billing Name',
      accessor: (item: Invoice) => {
        const c = customers.find(cust => cust.id === item.customerId);
        return (
          <div className="text-xs">
            <span className="font-bold text-slate-700 block">{c ? c.name : 'Unknown Customer'}</span>
            <span className="text-[10px] text-slate-400 font-medium">Ref: {item.workOrderId === 'Direct Sale' ? 'Direct Checkout' : `W.O. ${item.workOrderId.slice(0,6)}`}</span>
          </div>
        );
      }
    },
    {
      header: 'Invoiced Amount',
      accessor: (item: Invoice) => (
        <div className="lex items-center gap-0.5 text-xs text-slate-900 font-bold font-mono">
          <span>${item.total.toFixed(2)}</span>
        </div>
      )
    },
    {
      header: 'Paid-to-Date',
      accessor: (item: Invoice) => (
        <div className="space-y-1">
          <span className="font-semibold text-emerald-600 font-mono text-xs">${item.amountPaid.toFixed(2)}</span>
          {item.total > item.amountPaid && (
            <span className="block text-[9px] text-slate-400 font-mono">Bal: ${(item.total - item.amountPaid).toFixed(2)}</span>
          )}
        </div>
      )
    },
    {
      header: 'Payment Status',
      accessor: (item: Invoice) => (
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border rounded-full ${getStatusBadge(item.status)}`}>
          {item.status}
        </span>
      )
    },
    {
      header: 'Review Slip',
      accessor: (item: Invoice) => (
        <button
          onClick={() => openReceipt(item)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-md cursor-pointer transition-all shrink-0"
        >
          <Eye size={13} />
          <span>Receipt</span>
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Billing & Receipts</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track customer payments, issue direct invoices, and manage receivables outstanding.</p>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-700 rounded-lg"><FileSpreadsheet size={18} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Gross Invoiced</p>
            <p className="text-xl font-bold text-slate-900 tracking-tight mt-1 mb-0.5">${totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard size={18} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Payments Received</p>
            <p className="text-xl font-bold text-emerald-600 tracking-tight mt-1 mb-0.5">${totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-lg"><Receipt size={18} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Receivables Outstanding</p>
            <p className="text-xl font-bold text-rose-600 tracking-tight mt-1 mb-0.5">${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* STATUS FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between py-1 bg-slate-50/50 p-2 border border-slate-100 rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto text-xs shrink-0 select-none">
          <span className="font-semibold text-slate-400 uppercase px-1">Status:</span>
          {['All', 'Paid', 'Partially Paid', 'Unpaid'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 border rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white border-slate-950 font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <button
          onClick={openAddInvoice}
          disabled={customers.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 disabled:bg-slate-100 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-3xs cursor-pointer tracking-wider uppercase font-sans"
        >
          <Plus size={13} />
          <span>Quick Invoice</span>
        </button>
      </div>

      {/* SEARCH AND GRID */}
      <SearchBar
        placeholder="Search ledger by transaction code, customer name, plates..."
        value={search}
        onChange={setSearch}
      />

      {/* DATA GRID */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={openReceipt}
        onDeleteClick={openDeleteDialog}
        emptyMessage="No billing invoices found matching search conditions."
      />

      {/* HIGH-FIDELITY RECEIPT POPUP (RECEIPT DESIGN SLIP) */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Garage Billing Audit Slip"
        size="md"
      >
        {viewInvoice && (
          <div className="space-y-6">
            {/* Slip Core wrapper */}
            <div className="border border-slate-200/80 p-6 rounded-xl bg-[#FCFDFE] shadow-sm select-text text-sm">
              {/* Slip Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-dashed border-slate-200 pb-5 gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 tracking-tight text-base flex items-center gap-1.5 leading-none">
                    <Receipt size={18} className="text-slate-500 shrink-0" />
                    <span>GEARBOX AUTOMOTIVE</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium font-sans">
                    1200 Workspace Blvd, Suite 300<br/>
                    Austin, TX 78701 • shop@gearbox.com
                  </p>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border tracking-wider bg-slate-100 text-slate-700">
                    Slip INV-{viewInvoice.id.slice(0, 8).toUpperCase()}
                  </span>
                  <div className="text-[11px] text-slate-400 space-y-1.5 mt-2 font-medium font-sans">
                    <div className="flex sm:justify-end gap-2">
                      <span>Issued:</span>
                      <span className="font-bold text-slate-600">{new Date(viewInvoice.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex sm:justify-end gap-2">
                      <span>Due Date:</span>
                      <span className="font-bold text-slate-600">{new Date(viewInvoice.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill Details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-dashed border-slate-100 text-xs">
                <div>
                  <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1">Invoiced To</h5>
                  <p className="font-bold text-slate-800 text-sm leading-snug">{viewInvoice.customerName}</p>
                  <p className="text-slate-400 font-medium font-sans mt-1">Ref: {viewInvoice.customerId.slice(0, 10)}</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1">Repaired Fleet Vehicle</h5>
                  <p className="font-bold text-slate-800 text-sm leading-snug">{viewInvoice.vehicleInfo || 'Direct Counter Sale'}</p>
                  <p className="text-slate-400 font-medium font-sans mt-1">Ref: {viewInvoice.vehicleId.slice(0,10)}</p>
                </div>
              </div>

              {/* Item Lines */}
              <div className="py-4 space-y-3.5 border-b border-dashed border-slate-200">
                <h5 className="font-extrabold text-slate-400 uppercase tracking-wider text-[9px]">Invoiced Job Operations</h5>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                  <div className="pr-4 leading-normal">
                    <span className="font-bold text-slate-800 block text-xs">AUTOMOTIVE MAINTENANCE & DIAGNOSTIC SERVICES</span>
                    <span className="text-[10px] text-slate-400 font-medium font-sans">Mechanical repair work order ID: {viewInvoice.workOrderId}</span>
                  </div>
                  <span className="font-bold font-mono text-slate-800 text-xs">${viewInvoice.subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Financial Calculation summary */}
              <div className="py-4 flex justify-end">
                <div className="w-full sm:max-w-xs space-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-700">${viewInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  {viewInvoice.discount > 0 && (
                    <div className="flex justify-between text-indigo-600">
                      <span>Discount (Discounts)</span>
                      <span className="font-mono">-${viewInvoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Sales Tax (8.25% Standard)</span>
                    <span className="font-mono text-slate-700">${viewInvoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-2.5 text-slate-900 font-extrabold text-sm">
                    <span>Invoice Total</span>
                    <span className="font-mono text-slate-900">${viewInvoice.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-emerald-600 font-bold border-t border-slate-100 pt-2 text-xs leading-none">
                    <span>Payments Received</span>
                    <span className="font-mono">-${viewInvoice.amountPaid.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-rose-500 font-extrabold text-xs">
                    <span>Amount Outstanding</span>
                    <span className="font-mono">${(viewInvoice.total - viewInvoice.amountPaid).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Cash Input Payments logs */}
            {viewInvoice.amountPaid < viewInvoice.total ? (
              <form onSubmit={handlePostPayment} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 shrink-0">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CreditCard size={14} className="text-slate-500" />
                  <span>Record Customer Payment Received</span>
                </h5>
                <div className="flex items-center gap-2">
                  <div className="relative grow">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-semibold font-mono">$</span>
                    <input
                      type="number"
                      required
                      min={0.01}
                      max={viewInvoice.total - viewInvoice.amountPaid}
                      step="any"
                      value={incomingPayment || ''}
                      onChange={(e) => setIncomingPayment(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-xs font-mono"
                      placeholder={`Max: ${(viewInvoice.total - viewInvoice.amountPaid).toFixed(2)}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-3xs cursor-pointer shrink-0 transition-colors"
                  >
                    Post Payment
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold select-none leading-none">
                <ShieldCheck size={16} />
                <span>Payment completed. Transaction closed in full.</span>
              </div>
            )}

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Close Slip
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* QUICK INVOICE CREATION DIALOG */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Issue Direct Counter Invoice"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer Client Owner *</label>
              <select
                required
                value={addFormData.customerId}
                onChange={(e) => {
                  const custId = e.target.value;
                  const matchingVeh = vehicles.filter(v => v.customerId === custId);
                  setAddFormData({
                    ...addFormData,
                    customerId: custId,
                    vehicleId: matchingVeh[0]?.id || ''
                  });
                }}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 cursor-pointer"
              >
                <option value="" disabled>-- Associate customer directory --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Associated Vehicle *</label>
              <select
                required
                value={addFormData.vehicleId}
                disabled={!addFormData.customerId}
                onChange={(e) => setAddFormData({ ...addFormData, vehicleId: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 disabled:bg-slate-50 cursor-pointer"
              >
                <option value="" disabled>-- Pick matching chassis --</option>
                {vehicles.filter(v => v.customerId === addFormData.customerId).map(v => (
                  <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} ({v.licensePlate})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subtotal ($) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={addFormData.subtotal}
                  onChange={(e) => setAddFormData({ ...addFormData, subtotal: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Discount ($)</label>
                <input
                  type="number"
                  min={0}
                  value={addFormData.discount}
                  onChange={(e) => setAddFormData({ ...addFormData, discount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Initial Payment Status *</label>
              <select
                required
                value={addFormData.status}
                onChange={(e) => setAddFormData({ ...addFormData, status: e.target.value as InvoiceStatus })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-hidden rounded-lg text-sm text-slate-800 cursor-pointer"
              >
                <option value="Unpaid">Unpaid (Awaiting payment)</option>
                <option value="Paid">Paid (Cash Checkout)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 border border-slate-200 font-medium text-sm rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 border border-slate-950 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            >
              Post Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* REVERT / DISMISS INVOICES */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Invoice Dismissal"
        message="Are you sure you want to dismiss this billing invoice file? Paid transactions won't be recovered from totals history. This is completely permanent."
      />
    </div>
  );
}
