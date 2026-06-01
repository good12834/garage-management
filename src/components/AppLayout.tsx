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
  ChevronRight,
  Home,
  Mail,
  Lock
} from 'lucide-react';

interface AppLayoutProps {
  id?: string;
  activePath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
  isAuthenticated?: boolean;
  userEmail?: string | null;
  onSignOut?: () => void;
  onSignInClick?: () => void;
}

export function AppLayout({
  id,
  activePath,
  onNavigate,
  children,
  isAuthenticated = false,
  userEmail = null,
  onSignOut,
  onSignInClick
}: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', path: 'home', icon: <Home size={18} />, isProtected: false },
    { name: 'Dashboard', path: 'dashboard', icon: <TrendingUp size={18} />, isProtected: true },
    { name: 'Customers', path: 'customers', icon: <Users size={18} />, isProtected: true },
    { name: 'Vehicles', path: 'vehicles', icon: <Car size={18} />, isProtected: true },
    { name: 'Service Records', path: 'services', icon: <Wrench size={18} />, isProtected: true },
    { name: 'Work Orders', path: 'workorders', icon: <CheckSquare size={18} />, isProtected: true },
    { name: 'Invoices', path: 'invoices', icon: <FileText size={18} />, isProtected: true },
    { name: 'Contact', path: 'contact', icon: <Mail size={18} />, isProtected: false }
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
            const showLock = item.isProtected && !isAuthenticated;
            
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
                  <span className="text-[11px] uppercase tracking-widest font-bold font-sans flex items-center gap-1.5">
                    {item.name}
                    {showLock && (
                      <Lock size={10} className="text-[#A13D2D] shrink-0 animate-pulse" />
                    )}
                  </span>
                </div>
                <span className="text-[11px] font-serif italic font-light opacity-50">{itemNum}</span>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM USER AREA & STATS */}
        <div className="p-4 border-t border-zinc-800 bg-black/40 space-y-3 shrink-0 text-xs">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 p-1">
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-none bg-[#A13D2D] text-white flex items-center justify-center font-bold text-xs uppercase tracking-tighter shrink-0">
                  {userEmail ? userEmail.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="truncate flex-1">
                  <p className="font-bold text-white uppercase tracking-wider text-[10px] leading-snug">Manager Session</p>
                  <p className="text-[9px] text-zinc-400 font-mono truncate leading-none">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="w-full mt-1.5 py-2 bg-zinc-800 border-2 border-zinc-700 text-zinc-300 hover:text-white hover:bg-[#A13D2D] hover:border-transparent font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 pointer-events-auto cursor-pointer transition-all"
              >
                <LogOut size={12} />
                <span>Revoke Access</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-1 bg-[#2C1D1B]/40 border border-[#A13D2D]/30">
              <div className="space-y-0.5 px-1.5 pt-1">
                <p className="font-bold text-[#A13D2D] uppercase tracking-widest text-[9px] flex items-center gap-1">
                  <Lock size={8} />
                  <span>RESTRICTED GUEST</span>
                </p>
                <p className="text-[9px] text-zinc-500 leading-snug">Workspace database is locked of view.</p>
              </div>
              <button
                onClick={onSignInClick}
                className="w-full mt-1 py-1.5 bg-[#A13D2D] hover:bg-[#A13D2D]/90 text-white font-mono font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer pointer-events-auto transition-all"
              >
                <span>Authorize Portal</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#1A1A1A] border-b border-zinc-800 text-white shrink-0 select-none z-40">
        <div className="flex items-center gap-2">
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#A13D2D]">Vol 04</span>
          <span className="font-serif italic text-xl">Garage OS</span>
          {!isAuthenticated && (
            <span className="text-[8px] border border-[#A13D2D] text-[#A13D2D] px-1 font-mono uppercase bg-[#2C1D1B]/40">Locked</span>
          )}
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
        <div className="md:hidden fixed inset-0 z-30 bg-black/75 backdrop-blur-xs pt-16">
          <div className="bg-[#1A1A1A] border-b border-zinc-800">
            <nav className="px-6 py-6 space-y-1.5 text-zinc-350">
              {navigationItems.map((item, idx) => {
                const isActive = activePath === item.path;
                const showLock = item.isProtected && !isAuthenticated;
                
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
                      <span className="flex items-center gap-1.5">
                        {item.name}
                        {showLock && <Lock size={10} className="text-[#A13D2D]" />}
                      </span>
                    </div>
                    <span className="text-[10px] font-serif italic">0{idx + 1}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-6 border-t border-zinc-800 bg-[#141414] text-xs">
              {isAuthenticated ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate">
                    <p className="font-bold text-white uppercase text-[9px] tracking-widest">Active: {userEmail}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut?.();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 uppercase font-mono text-[9px] tracking-wider hover:text-white cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[9px] uppercase tracking-widest text-[#A13D2D]">Workspace Database Locked</div>
                  <button
                    onClick={() => {
                      onSignInClick?.();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 bg-[#A13D2D] text-white uppercase font-mono text-[9px] tracking-wider cursor-pointer"
                  >
                    Auth Portal
                  </button>
                </div>
              )}
            </div>
          </div>
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
