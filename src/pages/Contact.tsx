/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  vehicle: string;
  service: string;
  message: string;
  timestamp: string;
  status: 'Inbound' | 'Queued' | 'Replied';
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('Routine Maintenance');
  const [message, setMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simulated local storage state for in-session visual proof
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([
    {
      id: 'INQ-9402',
      name: 'Julian Sterling',
      email: 'j.sterling@heritage-motors.com',
      vehicle: '1967 Jaguar E-Type Series I',
      service: 'Engine',
      message: 'Seeking a full recalibration of triple SU carburetors and evaluation of the distributor timing under load.',
      timestamp: 'Today, 11:42 AM',
      status: 'Queued'
    },
    {
      id: 'INQ-8810',
      name: 'Victoria Hastings',
      email: 'victoria@hastings-law.co',
      vehicle: '1974 Porsche 911 Carrera RS 2.7',
      service: 'Other',
      message: 'Planning transmission synchronous mesh checking. Needs expert care to prevent damaging historical magnesium casing.',
      timestamp: 'Yesterday, 4:15 PM',
      status: 'Replied'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const newInquiry: ContactInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      vehicle: vehicle || 'Not Specified',
      service,
      message,
      timestamp: 'Just Now',
      status: 'Inbound'
    };

    setInquiries([newInquiry, ...inquiries]);
    setSubmitSuccess(true);
    
    // Clear form inputs
    setName('');
    setEmail('');
    setVehicle('');
    setService('Routine Maintenance');
    setMessage('');

    // Reset success banner after 6 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 6000);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="border-b-2 border-[#1A1A1A] pb-6">
        <span className="text-[10px] font-mono tracking-[0.3em] text-[#A13D2D] uppercase font-bold block mb-1">
          LIAISON & REGISTRY CORE
        </span>
        <h2 className="text-4xl font-serif italic text-[#1A1A1A] tracking-tight mt-1">Contact Office</h2>
        <p className="text-sm text-zinc-600 mt-2 font-serif italic">
          Transmit physical dispatches, request specialist appointments, or arrange flatbed tow deliveries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SUBMISSION FORM - COLUMN (7 COLS ON DESKTOP) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#1A1A1A] p-6 md:p-8 rounded-none shadow-[6px_6px_0px_rgba(26,26,26,1)]">
          <div className="border-b border-[#1A1A1A]/10 pb-4 mb-6">
            <span className="text-[9px] font-mono tracking-widest text-[#A13D2D] uppercase block">
              OFFICIAL SYSTEM REQUEST
            </span>
            <h3 className="text-xl font-serif text-[#1A1A1A] mt-1">Submit Inquiry Dispatch</h3>
          </div>

          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 border border-zinc-200 bg-[#F9F7F2] text-[#1A1A1A] rounded-none flex items-start gap-3.5"
              >
                <CheckCircle2 className="text-[#A13D2D] shrink-0 mt-0.5" size={18} />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider">Inquiry Authenticated & Logged</p>
                  <p className="text-xs text-zinc-650 font-serif italic">
                    Your dispatch has been successfully recorded in the active ledger. A mechanical clerk will response directly to your email in due course.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5.5 text-xs text-[#1A1A1A] font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NAME */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[10px] text-zinc-500 block">
                  Name / Affiliation <span className="text-[#A13D2D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admiral Arthur Pendelton"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-[#1A1A1A] focus:outline-hidden focus:border-[#A13D2D] rounded-none bg-white font-medium"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[10px] text-zinc-500 block">
                  Return Email Address <span className="text-[#A13D2D]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. arthur@royalmarines.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-[#1A1A1A] focus:outline-hidden focus:border-[#A13D2D] rounded-none bg-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VEHICLE DETAILS */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[10px] text-zinc-500 block">
                  Classic Vehicle (Year, Make, Model)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1961 Jaguar E-Type Coupe"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-[#1A1A1A] focus:outline-hidden focus:border-[#A13D2D] rounded-none bg-white font-medium"
                />
              </div>

              {/* SERVICE DIVISION */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[10px] text-zinc-500 block">
                  Designated Category Division
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-[#1A1A1A] focus:outline-hidden focus:border-[#A13D2D] rounded-none bg-white font-medium tracking-wide"
                >
                  <option value="Engine">Engine Restoration / Tuning</option>
                  <option value="Brakes">Brakes & Chassis Adjustments</option>
                  <option value="Tires">Suspension & Fine Tires Align</option>
                  <option value="Electrical">Vintage Ignition & Electricals</option>
                  <option value="Routine Maintenance">Routine Maintenance Stewardship</option>
                  <option value="Transmission">Gearbox & Transmission Rebuilding</option>
                  <option value="Other">Special Archeological Request</option>
                </select>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[10px] text-zinc-500 block">
                Dispatch Detail / Mechanical Problems Description <span className="text-[#A13D2D]">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Explicate your vehicle issues, historical background, or the nature of diagnostic assessment requested."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-3 border-2 border-[#1A1A1A] focus:outline-hidden focus:border-[#A13D2D] rounded-none bg-white font-medium leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#A13D2D] text-white text-xs font-bold uppercase tracking-[0.2em] border-2 border-[#1A1A1A] flex items-center justify-center gap-2.5 active:translate-y-[1px] transition-all cursor-pointer pointer-events-auto"
            >
              <Send size={13} />
              <span>Broadcast System Dispatch</span>
            </button>
          </form>
        </div>

        {/* DETAILS & PHYSICAL LOCATION MAP - COLUMN (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* DISPATCH ADDRESS CARD */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-none relative">
            <span className="text-[9px] font-mono tracking-widest text-[#A13D2D] uppercase block mb-3.5">
              PHYSICAL SEAT OF WORK
            </span>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 border border-[#1A1A1A] text-[#1A1A1A] bg-zinc-50 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-serif italic text-sm font-semibold text-[#1A1A1A]">District Workshop</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    402 Mechanical Way, Suite B<br />
                    Petrolia Industrial Sector, London, SE10 0ES
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 border border-[#1A1A1A] text-[#1A1A1A] bg-zinc-50 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="font-serif italic text-sm font-semibold text-[#1A1A1A]">Direct Wire Lines</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-normal">
                    Primary Office: +44 20 7946 0192<br />
                    Classics Carrier: +44 20 7946 0548<br />
                    Facsimile Depot: +44 20 7946 0991
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 border border-[#1A1A1A] text-[#1A1A1A] bg-zinc-50 shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="font-serif italic text-sm font-semibold text-[#1A1A1A]">Automated Mail Room</h4>
                  <p className="text-xs text-zinc-600 mt-1">
                    registry@garage-os.io // support@garage-os.io
                  </p>
                </div>
              </div>
            </div>

            {/* ARTIFICIAL SCHEMATIC MAP BLOCK */}
            <div className="mt-6 border border-[#1A1A1A] bg-[#F9F7F2] p-4 relative overflow-hidden h-[155px] font-mono text-[9px] text-zinc-500 flex flex-col justify-between">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1a1a1a_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
              <div className="relative flex justify-between uppercase">
                <span>SECTOR 412 GRID</span>
                <span className="text-[#A13D2D] font-bold">● LOCATED</span>
              </div>
              
              {/* SCHEMATIC ASCII MAP TRACE */}
              <div className="relative font-bold leading-tight scale-105 my-2 opacity-80 whitespace-pre">
                {`   [RIVER THAMES] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
             |             [TUNNEL GATEWAY]
        =====o=============o=======================
             |             |  
   - - - - - + - - - - - - o - - - - - - - - - - - -
             |             |   [MECHANICAL WAY]
             |             +---[WORKSHOP B (OS)]`}
              </div>

              <div className="relative flex justify-between text-[8px]">
                <span>SCALE: 1:500 METER</span>
                <span>PETROLIA STATION NEAREST</span>
              </div>
            </div>
          </div>

          {/* EMERGENCY DISCLAIMER CARD */}
          <div className="border-2 border-[#A13D2D] bg-[#A13D2D]/5 p-5 flex gap-4">
            <ShieldAlert className="text-[#A13D2D] shrink-0 mt-0.5" size={20} />
            <div className="space-y-1.5 text-xs">
              <h4 className="font-serif italic font-bold text-[#A13D2D]">Concerning Classic Carriers</h4>
              <p className="text-zinc-650 leading-relaxed font-serif text-[11px] italic">
                If the machine is currently inoperative or presents high mechanical friction, please schedule our hydraulic-bed enclosed classics transport rather than driving. Preempt early metal wear.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT OUTLET JOURNAL OF MESSAGES */}
      <div className="border-2 border-[#1A1A1A] bg-white p-6 rounded-none">
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <MessageSquare size={16} className="text-[#A13D2D]" />
            <h4 className="text-sm font-serif italic text-[#1A1A1A] font-semibold">Active Dispatch Record Journal</h4>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold bg-[#F9F7F2] border border-[#1A1A1A]/10 px-2 py-0.5">
            Audit Ready
          </span>
        </div>

        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="border border-[#1A1A1A]/10 p-4 hover:border-[#1A1A1A] bg-[#F9F7F2]/20 relative transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#A13D2D] uppercase border border-[#A13D2D]/20 px-2 py-0.5 bg-[#A13D2D]/5">
                    {inq.id}
                  </span>
                  <span className="text-xs font-bold text-[#1A1A1A]">{inq.name}</span>
                  <span className="text-[10px] font-mono text-zinc-500">({inq.email})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-zinc-400 whitespace-nowrap">{inq.timestamp}</span>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${
                    inq.status === 'Inbound' 
                      ? 'border-[#A13D2D] bg-[#A13D2D]/10 text-[#A13D2D]'
                      : inq.status === 'Queued'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  }`}>
                    {inq.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 text-[11px] border-b border-[#1A1A1A]/5 pb-2 font-mono">
                <div>
                  <span className="text-zinc-400 uppercase text-[9px] block">Service Group</span>
                  <span className="text-zinc-700 uppercase font-bold">{inq.service}</span>
                </div>
                <div className="md:col-span-3">
                  <span className="text-zinc-400 uppercase text-[9px] block">Catalogued Machine</span>
                  <span className="text-zinc-700 italic font-serif">{inq.vehicle}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-750 font-serif italic leading-relaxed pl-2 border-l-2 border-[#1A1A1A]/10">
                "{inq.message}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
