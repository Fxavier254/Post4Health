import React, { useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#006b3f] flex flex-col items-center justify-center p-6 text-white transition-opacity duration-500">
      {/* Centered Logo Emblem */}
      <div className="relative mb-6">
        <div className="absolute -inset-3 rounded-full bg-white/15 animate-ping opacity-75"></div>
        <img
          src="post4healthwellnessemblem.png"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'file:///android_res/drawable/post4healthwellnessemblem.png';
          }}
          alt="Post4Health Emblem"
          className="w-28 h-28 object-contain relative z-10 drop-shadow-xl"
        />
      </div>

      {/* Brand Title */}
      <h1 className="text-2xl font-black tracking-tight text-white mb-1">
        Post4Health
      </h1>
      <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-8">
        COLD-CHAIN MEDICAL LOGISTICS
      </p>

      {/* Loading Spinner & Text */}
      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20 shadow-md">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-white tracking-wide">
          Loading Secure Logistics...
        </span>
      </div>
    </div>
  );
}
