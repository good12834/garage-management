/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, X, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// === STATS CARD ===
interface StatsCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function StatsCard({ id, title, value, subtext, trend, icon, iconBgColor = 'bg-[#1A1A1A] text-[#F9F7F2]' }: StatsCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white border-2 border-[#1A1A1A] rounded-none flex items-start justify-between hover:bg-[#1A1A1A] hover:text-[#F9F7F2] transition-colors group cursor-pointer"
    >
      <div className="space-y-3">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-70 block">{title}</span>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-serif italic text-[#1A1A1A] group-hover:text-white transition-colors leading-none">{value}</span>
          {trend && (
            <span className={`text-xs font-bold font-mono tracking-tight flex items-center ${trend.isPositive ? 'text-emerald-600 group-hover:text-emerald-400' : 'text-rose-600 group-hover:text-rose-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors font-serif italic">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-none border border-[#1A1A1A] group-hover:border-zinc-700 bg-[#1A1A1A] text-[#F9F7F2] group-hover:bg-[#F9F7F2] group-hover:text-[#1A1A1A] transition-colors flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(26,26,26,0.15)] group-hover:shadow-none`}>
        {icon}
      </div>
    </motion.div>
  );
}

// === SEARCH & FILTER BAR ===
interface SearchBarProps {
  id?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  onAddClick?: () => void;
  addButtonLabel?: string;
  children?: React.ReactNode; // Extra controls like filters
}

export function SearchBar({ id, placeholder, value, onChange, onAddClick, addButtonLabel = 'Add New', children }: SearchBarProps) {
  return (
    <div id={id} className="flex flex-col sm:flex-row gap-4 py-4 items-center justify-between font-sans">
      <div className="relative w-full sm:max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#1A1A1A]/60">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#1A1A1A] focus:outline-hidden focus:border-[#A13D2D] rounded-none text-sm text-[#1A1A1A] transition-colors placeholder:text-[#1A1A1A]/40 font-medium"
        />
      </div>
      <div className="flex w-full sm:w-auto items-center justify-end gap-3 shrink-0">
        {children}
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#A13D2D] text-white font-bold text-[10px] uppercase tracking-[0.18em] rounded-none border-2 border-[#1A1A1A] active:translate-y-[1px] transition-all pointer-events-auto cursor-pointer"
          >
            <Plus size={14} className="shrink-0" />
            <span>{addButtonLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// === DATATABLE ===
interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  id?: string;
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  onEditClick?: (item: T, e: React.MouseEvent) => void;
  onDeleteClick?: (item: T, e: React.MouseEvent) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  id,
  columns,
  data,
  onRowClick,
  onEditClick,
  onDeleteClick,
  emptyMessage = 'No records found.'
}: DataTableProps<T>) {
  return (
    <div id={id} className="w-full overflow-hidden border-2 border-[#1A1A1A] rounded-none bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4.5 border-r border-[#333333] last:border-r-0 ${col.className || ''}`}>{col.header}</th>
              ))}
              {(onEditClick || onDeleteClick) && <th className="px-6 py-4.5 text-right w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1A1A1A]/10 text-sm text-[#1A1A1A] font-sans">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEditClick || onDeleteClick ? 1 : 0)} className="px-6 py-12 text-center text-slate-400 font-serif italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-[#F9F7F2]/60 transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4.5 align-middle border-r border-[#1A1A1A]/5 active:bg-[#F9F7F2] ${col.className || ''}`}>
                      {col.accessor(item)}
                    </td>
                  ))}
                  {(onEditClick || onDeleteClick) && (
                    <td className="px-6 py-4.5 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2.5" onClick={(e) => e.stopPropagation()}>
                        {onEditClick && (
                          <button
                            onClick={(e) => onEditClick(item, e)}
                            className="p-2 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F9F7F2] rounded-none transition-colors duration-100"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {onDeleteClick && (
                          <button
                            onClick={(e) => onDeleteClick(item, e)}
                            className="p-2 border border-[#A13D2D] text-[#A13D2D] hover:bg-[#A13D2D] hover:text-white rounded-none transition-colors duration-100"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// === MODAL DIALOG ===
interface ModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ id, isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={id} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className={`relative w-full ${sizeClasses[size]} bg-[#F9F7F2] rounded-none border-4 border-[#1A1A1A] shadow-[8px_8px_0px_rgba(26,26,26,1)] overflow-hidden z-10 flex flex-col max-h-[90vh]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#1A1A1A] bg-[#1A1A1A] text-white shrink-0">
              <h3 className="font-serif italic text-white text-lg font-normal tracking-wide">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-none hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto grow bg-[#F9F7F2]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// === CONFIRM DIALOG ===
interface ConfirmDialogProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  id,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true
}: ConfirmDialogProps) {
  return (
    <Modal id={id} isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center space-y-5">
        <div className={`p-4 rounded-none border-2 ${isDestructive ? 'border-[#A13D2D] bg-[#A13D2D]/10 text-[#A13D2D]' : 'border-[#1A1A1A] bg-zinc-100 text-[#1A1A1A]'}`}>
          <AlertTriangle size={30} />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-[#1A1A1A] font-serif italic leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center gap-3 w-full pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border-2 border-[#1A1A1A] rounded-none text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 px-4 border-2 rounded-none text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer pointer-events-auto ${
              isDestructive ? 'bg-[#A13D2D] hover:bg-[#8A3326] border-[#A13D2D]' : 'bg-[#1A1A1A] hover:bg-zinc-800 border-[#1A1A1A]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
