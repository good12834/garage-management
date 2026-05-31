/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  Car, 
  CheckSquare, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Wrench, 
  FileText,
  Briefcase
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DashboardStats } from '../types';
import { StatsCard } from '../components/Shared';

interface DashboardPageProps {
  id?: string;
  stats: DashboardStats;
  onNavigate: (path: string) => void;
}

export function DashboardPage({ id, stats, onNavigate }: DashboardPageProps) {
  // Format currency helpers
  const formatCur = (v: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
  };

  // Activity icon builder
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer':
        return <div className="p-2 border border-[#1A1A1A] bg-zinc-100 text-[#1A1A1A] rounded-none"><Users size={15} /></div>;
      case 'vehicle':
        return <div className="p-2 border border-[#1A1A1A] bg-zinc-100 text-[#1A1A1A] rounded-none"><Car size={15} /></div>;
      case 'service':
        return <div className="p-2 border border-[#1A1A1A] bg-zinc-100 text-[#1A1A1A] rounded-none"><Wrench size={15} /></div>;
      case 'workorder':
        return <div className="p-2 border border-[#1A1A1A] bg-zinc-100 text-[#1A1A1A] rounded-none"><CheckSquare size={15} /></div>;
      case 'invoice':
        return <div className="p-2 border border-[#1A1A1A] bg-[#A13D2D]/10 text-[#A13D2D] rounded-none"><FileText size={15} /></div>;
      default:
        return <div className="p-2 border border-[#1A1A1A] bg-zinc-100 text-[#1A1A1A] rounded-none"><Briefcase size={15} /></div>;
    }
  };

  // Convert database activities timestamp to short readable form
  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return ts;
    }
  };

  return (
    <div id={id} className="space-y-10">
      {/* 1. WELCOME BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-6 border-b-2 border-[#1A1A1A]">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#A13D2D] uppercase font-bold">SYSTEM CONTROL & RECORDS</span>
          <h2 className="text-4xl font-serif italic text-[#1A1A1A] tracking-tight mt-1">Main Dashboard</h2>
          <p className="text-sm text-zinc-600 mt-2 font-serif italic">Operational summaries, real-time diagnostic queues, and financials.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button
            onClick={() => onNavigate('workorders')}
            className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#A13D2D] border-2 border-[#1A1A1A] text-white rounded-none text-[10px] font-bold uppercase tracking-[0.16em] active:translate-y-[1px] transition-all pointer-events-auto cursor-pointer"
          >
            Manage Works Queue
          </button>
        </div>
      </div>

      {/* 2. SUMMARY METRICS DIALS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtext="Active database registry"
          trend={{ value: '12% MoM', isPositive: true }}
          icon={<Users size={18} />}
        />
        <StatsCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          subtext="Fleet diagnostic records"
          trend={{ value: '8%', isPositive: true }}
          icon={<Car size={18} />}
        />
        <StatsCard
          title="Active Work Orders"
          value={stats.activeWorkOrders}
          subtext="In progress/pending status"
          icon={<CheckSquare size={18} />}
        />
        <StatsCard
          title="Open Invoices"
          value={formatCur(stats.openInvoicesAmt)}
          subtext="Receivables outstanding"
          icon={<Clock size={18} />}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCur(stats.totalRevenue)}
          subtext="Current calendar year"
          trend={{ value: '18% vs Target', isPositive: true }}
          icon={<DollarSign size={18} />}
        />
      </div>

      {/* 3. CHART & BREAKDOWNS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE TIMELINE */}
        <div className="lg:col-span-2 p-6 bg-white border-2 border-[#1A1A1A] rounded-none flex flex-col h-[420px]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">FINANCIAL OVERVIEW</span>
              <h3 className="font-serif italic text-lg font-normal text-[#1A1A1A] mt-1">Revenue Growth Timeline</h3>
              <p className="text-xs text-zinc-500 font-serif italic">Gross receivables and recorded logs (6-month review)</p>
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#A13D2D] uppercase border-2 border-[#A13D2D] px-2.5 py-1">
              Active Trend Upward
            </span>
          </div>

          <div className="grow w-full min-h-0 text-[10px] font-medium font-mono text-[#1A1A1A]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A13D2D" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#A13D2D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E3DFD5" />
                <XAxis dataKey="month" stroke="#1A1A1A" strokeWidth={1.5} tickLine={false} />
                <YAxis stroke="#1A1A1A" strokeWidth={1.5} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '0px', color: '#FFF', border: 'none', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#A13D2D" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WORK SERVICE CATEGORY DENSITY */}
        <div className="p-6 bg-white border-2 border-[#1A1A1A] rounded-none flex flex-col h-[420px]">
          <div className="mb-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">SERVICE METRICS</span>
            <h3 className="font-serif italic text-lg font-normal text-[#1A1A1A] mt-1">Revenue by Category</h3>
            <p className="text-xs text-zinc-500 font-serif italic">Service logs distribution</p>
          </div>

          <div className="grow overflow-y-auto space-y-5 pr-1 font-sans">
            {stats.revenueByCategory
              .sort((a, b) => b.value - a.value)
              .map((cat, i) => {
                const maxVal = Math.max(...stats.revenueByCategory.map(c => c.value)) || 1;
                const percent = Math.round((cat.value / stats.revenueByCategory.reduce((sum, item) => sum + item.value, 0)) * 100);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-[#1A1A1A] tracking-tight">{cat.category}</span>
                      <span className="font-mono text-zinc-600 font-medium text-[11px]">
                        {formatCur(cat.value)} <span className="opacity-60">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#EAE8E2] border border-[#1A1A1A] rounded-none h-4 overflow-hidden p-[2px]">
                      <div 
                        className="h-full rounded-none transition-all duration-500" 
                        style={{ 
                          width: `${(cat.value / maxVal) * 100}%`,
                          backgroundColor: '#1A1A1A'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* 4. WORKORDERS STATUS DISTRIBUTION & RECENT ACTIVITY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SERVICES QUEUE BAR DIAL */}
        <div className="p-6 bg-white border-2 border-[#1A1A1A] rounded-none flex flex-col h-[430px]">
          <div className="mb-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">WORKFLOW DIAL</span>
            <h3 className="font-serif italic text-lg font-normal text-[#1A1A1A] mt-1">Work Queue Status</h3>
            <p className="text-xs text-zinc-500 font-serif italic">Distribution of active and legacy work orders</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            {stats.workOrdersByStatus.map((item, i) => {
              const borderColors: Record<string, string> = {
                'Pending': 'border-purple-600/70',
                'In Progress': 'border-amber-600/80',
                'Completed': 'border-emerald-600/70',
                'Cancelled': 'border-zinc-400'
              };
              const bgColors: Record<string, string> = {
                'Pending': 'bg-purple-50 text-purple-800',
                'In Progress': 'bg-amber-50 text-amber-800',
                'Completed': 'bg-emerald-50 text-emerald-800',
                'Cancelled': 'bg-zinc-100 text-zinc-600'
              };
              const totalOrders = stats.workOrdersByStatus.reduce((sum, item) => sum + item.count, 0) || 1;
              const percent = Math.round((item.count / totalOrders) * 100);

              return (
                <div key={i} className={`flex items-center justify-between p-4 border-2 border-[#1A1A1A] rounded-none bg-white hover:bg-[#F9F7F2] transition-colors`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 border border-[#1A1A1A] ${item.status === 'Completed' ? 'bg-[#A13D2D]' : 'bg-[#1A1A1A]'} shrink-0`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-[#1A1A1A] ${bgColors[item.status]}`}>
                      {item.count} orders
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A]/80 w-10 text-right">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LIVE ACTIVITY FEED */}
        <div className="lg:col-span-2 p-6 bg-white border-2 border-[#1A1A1A] rounded-none flex flex-col h-[430px]">
          <div className="mb-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">AUDIT JOURNAL</span>
            <h3 className="font-serif italic text-lg font-normal text-[#1A1A1A] mt-1">Live System Timeline</h3>
            <p className="text-xs text-zinc-500 font-serif italic">Audit logs of customer registrations, invoices, and diagnostic operations</p>
          </div>

          <div className="grow overflow-y-auto space-y-4.5 pr-1 scrollbar-thin">
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 font-serif italic text-sm">No activity recorded.</div>
            ) : (
              stats.recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-4 p-3.5 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all bg-white rounded-none">
                  {getActivityIcon(act.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1A1A1A] leading-snug tracking-tight">{act.message}</p>
                    {act.meta && <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">{act.meta}</p>}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 font-semibold whitespace-nowrap pt-1 ml-2">
                    {formatTime(act.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
