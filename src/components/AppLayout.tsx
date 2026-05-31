/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wrench,
  Car,
  Users,
  FileText,
  CheckSquare,
  TrendingUp,
  Menu,
  X,
  Calendar,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface AppLayoutProps {
  id?: string;
  activePath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export function AppLayout({ id, activePath, onNavigate, children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <TrendingUp size={18} /> },
    { name: 'Customers', path: 'customers', icon: <Users size={18} /> },
    { name: 'Vehicles', path: 'vehicles', icon: <Car size={18} /> },
    { name: 'Service Records', path: 'services', icon: <Wrench size={18} /> },
    { name: 'Work Orders', path: 'workorders', icon: <CheckSquare size={18} /> },
    { name: 'Invoices', path: 'invoices', icon: <FileText size={18} /> }
  ];

  const getPageTitle = () => {
    const item = navigationItems.find(n => n.path === activePath);
    return item ? item.name : 'Garage Manager';
  };

  const handleNavItemClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div id={id} className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] flex flex-col md:flex-row antialiased select-none font-sans border-8 md:border-[16px] border-white">
      
      {/* 1. SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1A1A1A] border-r border-[#1A1A1A] text-[#F9F7F2] shrink-0 select-none">
        {/* LOGO AREA */}
        <div className="flex flex-col px-6 py-8 border-b border-zinc-800 font-sans tracking-tight">
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#A13D2D] mb-1">Vol 04 / Issue 12</span>
          <h1 className="text-3xl font-serif leading-none italic font-normal text-white">Garage OS</h1>
          <div className="text-[10px] text-zinc-500 font-mono uppercase mt-2">Active Database Connected</div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item, idx) => {
            const isActive = activePath === item.path;
            const itemNum = `0${idx + 1}`;
            return (
              <button
                key={item.path}
                onClick={() => handleNavItemClick(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-none border border-transparent transition-all group pointer-events-auto cursor-pointer ${
                  isActive
                    ? 'border-zinc-700 bg-zinc-800 text-white font-extrabold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-colors duration-200 ${isActive ? 'text-[#A13D2D]' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                    {item.icon}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest font-bold font-sans">{item.name}</span>
                </div>
                <span className="text-[11px] font-serif italic font-light opacity-50">{itemNum}</span>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM USER AREA & STATS */}
        <div className="p-4 border-t border-zinc-800 bg-black/40 space-y-3 shrink-0 text-xs">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-none bg-[#A13D2D] text-white flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
              AD
            </div>
            <div className="truncate">
              <p className="font-bold text-white uppercase tracking-wider text-[10px] leading-snug">Manager Portal</p>
              <p className="text-[9px] text-zinc-500 font-mono truncate leading-none">goodpersonh2o8686@...</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#1A1A1A] border-b border-zinc-800 text-white shrink-0 select-none z-40">
        <div className="flex items-center gap-2">
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#A13D2D]">Vol 04</span>
          <span className="font-serif italic text-xl">Garage OS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md hover:bg-slate-800 cursor-pointer"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENUS */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-xs pt-16">
          <nav className="bg-[#1A1A1A] border-b border-zinc-800 px-6 py-6 space-y-1.5 text-zinc-300">
            {navigationItems.map((item, idx) => {
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavItemClick(item.path)}
                  className={`w-full flex items-center justify-between py-3 px-4 rounded-none text-left text-xs uppercase tracking-widest font-bold pointer-events-auto cursor-pointer ${
                    isActive ? 'bg-[#F9F7F2] text-[#1A1A1A]' : 'text-zinc-400 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-serif italic">0{idx + 1}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F9F7F2]">
        {/* HEADER */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A] bg-[#F9F7F2] select-none shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-[#1A1A1A]/60 uppercase tracking-[0.2em] font-bold">
            <span>Gearbox Workspace</span>
            <ChevronRight size={10} className="text-[#A13D2D]" />
            <span className="text-[#1A1A1A] font-extrabold">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-6">
            {/* DATE */}
            <div className="flex items-center gap-2 text-[#1A1A1A] text-xs font-mono uppercase">
              <Calendar size={13} className="text-[#A13D2D]" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE APP PAGE SHELL */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full max-w-[1600px] mx-auto bg-[#F9F7F2]">
          {children}
        </main>
      </div>
    </div>
  );
}
