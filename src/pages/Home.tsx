/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Wrench, Shield, Compass, Calendar, Sparkles } from 'lucide-react';
// @ts-ignore
import heroImage from '../assets/images/garage_hero_1780257373047.png';

interface HomePageProps {
  onEnterDashboard: () => void;
  onNavigateToContact: () => void;
}

export function HomePage({ onEnterDashboard, onNavigateToContact }: HomePageProps) {
  return (
    <div className="space-y-12">
      {/* 1. EDITORIAL HEADER CAPTION */}
      <div className="text-center md:text-left border-b-2 border-[#1A1A1A] pb-6">
        <span className="text-[10px] font-mono tracking-[0.3em] text-[#A13D2D] uppercase font-bold block mb-1">
          PUBLISHED MONTHLY — IN SERVICE OF THE MACHINE
        </span>
        <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#1A1A1A] font-normal tracking-tight">
          Pristine Mechanical Stewardship.
        </h1>
        <p className="text-sm md:text-base text-zinc-650 max-w-2xl font-serif italic mt-3 leading-relaxed">
          The curated portal for high-precision vehicle diagnostics, customer registry ledgering, and luxury architectural workshop operations. 
        </p>
      </div>

      {/* 2. MAIN HERO SECTION (GRID LAYOUT WITH IMAGE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-[#1A1A1A] bg-white overflow-hidden shadow-[6px_6px_0px_rgba(26,26,26,0.15)]">
        {/* HERO IMAGE CONTAINER */}
        <div className="relative lg:col-span-7 h-[300px] md:h-[450px] bg-zinc-100 border-b-2 border-[#1A1A1A] lg:border-b-0 lg:border-r-2 overflow-hidden">
          <img
            src={heroImage}
            alt="Garage OS Vintage Workshop Hero"
            className="w-full h-full object-cover grayscale opacity-95 hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1">
            Plate 12 // Architectural Showcase
          </div>
        </div>

        {/* HERO INTRO & CTA */}
        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between bg-[#F9F7F2]/40">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#A13D2D] uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Workspace Edition 4.12</span>
            </div>
            
            <h2 className="text-3xl font-serif italic text-[#1A1A1A] leading-tight font-normal">
              A System Crafted for the Discerning Garage.
            </h2>
            
            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Garage OS operates as a high-fidelity visual system designed for workshops that treat classic and modern transportation as masterpieces. Our integrated system bridges customer communications, fleet telemetry, in-progress diagnoses logs, and outstanding receivable accounts.
            </p>

            <div className="border-l-2 border-[#A13D2D] pl-4 py-1.5 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A] tracking-wide block">
                Integrated Ledger Status
              </span>
              <span className="text-xs italic text-zinc-500 font-serif">
                6 Active Modules // Real-Time Database State Connected // Audit logs live of customer registrations
              </span>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-3.5">
            <button
              onClick={onEnterDashboard}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#A13D2D] text-white text-xs font-bold uppercase tracking-[0.16em] border-2 border-[#1A1A1A] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <span>Initialize Workspace</span>
              <ArrowRight size={14} className="shrink-0" />
            </button>
            <button
              onClick={onNavigateToContact}
              className="px-6 py-3.5 border-2 border-[#1A1A1A] hover:bg-zinc-100 text-[#1A1A1A] text-xs font-bold uppercase tracking-[0.16em] active:translate-y-[1px] transition-all cursor-pointer text-center"
            >
              Liaison Registry
            </button>
          </div>
        </div>
      </div>

      {/* 3. CORE PHILOSOPHIES / THREE COLUMN FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
        <div className="p-6.5 border-2 border-[#1A1A1A] bg-white relative">
          <div className="w-10 h-10 border border-[#1A1A1A] bg-zinc-50 text-[#1A1A1A] flex items-center justify-center mb-5 shrink-0">
            <Wrench size={18} />
          </div>
          <h3 className="text-lg font-serif italic text-[#1A1A1A] font-normal mb-2">Unparalleled Care</h3>
          <p className="text-xs text-zinc-600 font-sans leading-relaxed">
            Record precision measurements across multiple vehicle systems. Log part codes and details with micron-level notes to preserve vehicle history.
          </p>
        </div>

        <div className="p-6.5 border-2 border-[#1A1A1A] bg-white relative">
          <div className="w-10 h-10 border border-[#1A1A1A] bg-zinc-50 text-[#1A1A1A] flex items-center justify-center mb-5 shrink-0">
            <Shield size={18} />
          </div>
          <h3 className="text-lg font-serif italic text-[#1A1A1A] font-normal mb-2">Absolute Accuracy</h3>
          <p className="text-xs text-zinc-600 font-sans leading-relaxed">
            Eliminate double entry error. Flow diagnostics seamlessly into active work queue structures and finalized balance notifications.
          </p>
        </div>

        <div className="p-6.5 border-2 border-[#1A1A1A] bg-white relative">
          <div className="w-10 h-10 border border-[#1A1A1A] bg-zinc-50 text-[#1A1A1A] flex items-center justify-center mb-5 shrink-0">
            <Compass size={18} />
          </div>
          <h3 className="text-lg font-serif italic text-[#1A1A1A] font-normal mb-2">Architectural Standard</h3>
          <p className="text-xs text-zinc-600 font-sans leading-relaxed">
            A beautiful workspace environment that matches the design principles of the machines you look after. Tailored specifically for classical focus.
          </p>
        </div>
      </div>

      {/* 4. CHRONICLES OF STATISTICS */}
      <div className="p-6.5 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white flex flex-col md:flex-row md:items-center md:justify-around gap-6 text-center">
        <div className="space-y-1">
          <span className="text-3xl font-serif italic text-[#F9F7F2] font-semibold leading-none">150+</span>
          <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">Vehicles catalogued</p>
        </div>
        <div className="hidden md:block w-px h-10 bg-zinc-700" />
        <div className="space-y-1">
          <span className="text-3xl font-serif italic text-[#F9F7F2] font-semibold leading-none">99.8%</span>
          <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">Audit score accuracy</p>
        </div>
        <div className="hidden md:block w-px h-10 bg-zinc-700" />
        <div className="space-y-1">
          <span className="text-3xl font-serif italic text-[#F9F7F2] font-semibold leading-none">6 Modules</span>
          <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">Synchronized database</p>
        </div>
        <div className="hidden md:block w-px h-10 bg-zinc-700" />
        <div className="space-y-1">
          <span className="text-3xl font-serif italic text-[#F9F7F2] font-semibold leading-none">24 / 7</span>
          <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">Terminal diagnostics availability</p>
        </div>
      </div>

      {/* 5. EDITORIAL HOME PAGE FOOTER */}
      <footer className="border-t-4 border-[#1A1A1A] pt-10 pb-6 mt-16 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8.5 text-xs text-[#1A1A1A]">
          {/* COL 1: IDENTITY */}
          <div className="space-y-3.5">
            <span className="text-[9px] font-mono tracking-[0.25em] font-bold text-[#A13D2D] uppercase block">
              Vol. 04 / Issue 12
            </span>
            <span className="text-2xl font-serif italic leading-none font-normal">Garage OS</span>
            <p className="text-[11px] text-zinc-650 leading-relaxed font-serif italic pr-2">
              The premium mechanical directory operating behind wood-block borders. Preserving the aesthetic values and physical precision of automotive engineering.
            </p>
          </div>

          {/* COL 2: LOCATION */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500 block">
              DISTRICT WORKSHOP
            </span>
            <p className="font-serif italic text-zinc-850 leading-relaxed">
              402 Mechanical Way, Suite B<br />
              Petrolia Industrial Sector<br />
              London, SE10 0ES
            </p>
            <p className="text-[11px] font-mono text-zinc-600 uppercase">
              GRID: 51.4826 N // 0.0077 W
            </p>
          </div>

          {/* COL 3: LIAISON */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500 block">
              COMMUNICATION LINES
            </span>
            <p className="font-serif italic text-zinc-850 leading-relaxed">
              Office line: +44 20 7946 0192<br />
              Emergency dispatch: 24/7 Roadside<br />
              Email: registry@garage-os.io
            </p>
            <button
              onClick={onNavigateToContact}
              className="text-[10px] font-bold text-[#A13D2D] hover:text-[#1A1A1A] transition-colors uppercase tracking-widest hover:underline text-left pointer-events-auto cursor-pointer"
            >
              Submit Dispatch Form →
            </button>
          </div>

          {/* COL 4: SCHEDULE */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500 block">
              OPERATING CADENCE
            </span>
            <table className="w-full text-[11px] font-mono text-zinc-700 leading-normal border-dotted border-b border-t border-[#1A1A1A]/10 py-1">
              <tbody>
                <tr>
                  <td className="py-1">MON — FRI</td>
                  <td className="text-right py-1">08:00 — 18:00</td>
                </tr>
                <tr>
                  <td className="py-1">SATURDAY</td>
                  <td className="text-right py-1">09:00 — 14:00</td>
                </tr>
                <tr>
                  <td className="py-1">SUNDAY</td>
                  <td className="text-right py-1 text-[#A13D2D]">CLOSED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="border-t border-[#1A1A1A]/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest gap-4">
          <p>© 2026 Garage OS Inc. All rights reserved in system ledger.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              ● Database Synced
            </span>
            <span>Issue Vol. 04 Build #439</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
