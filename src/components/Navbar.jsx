import React from 'react';
import { Truck, Building2, BarChart3, RefreshCw, Bell } from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole, onResetSeed, notificationCount = 3 }) {
  const roles = [
    { id: 'DRIVER', label: 'Driver Console', icon: Truck },
    { id: 'FACILITY', label: 'Facility Receiving', icon: Building2 },
    { id: 'ADMIN', label: 'Admin Dashboard', icon: BarChart3 }
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          {/* Brand Logo & Header */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onResetSeed} title="Click to reset seed data">
            <img
              src="post4healthwellnessemblem.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'file:///android_res/drawable/post4healthwellnessemblem.png';
              }}
              alt="Post4Health Emblem"
              className="h-11 w-auto object-contain flex-shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-slate-900 leading-none tracking-tight">
                  Post4Health
                </h1>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 tracking-wide mt-0.5">
                SECURE MEDICAL LOGISTICS &bull; COLD-CHAIN MONITORING
              </p>
            </div>
          </div>

          {/* User / Reset & Bell Notification Count */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveRole('ADMIN')}
              title="Admin Notifications"
              className="relative p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              <Bell className="w-4.5 h-4.5 text-[#006b3f]" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={onResetSeed}
              title="Reset Sample Seed Data"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>
          </div>
        </div>

        {/* Role Selector Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#006b3f] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  <span>{role.label}</span>
                  {role.id === 'ADMIN' && notificationCount > 0 && (
                    <span className="ml-1 bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                      {notificationCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
