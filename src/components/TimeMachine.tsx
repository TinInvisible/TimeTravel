import React, { useState } from 'react';
import { Destination, type TravelConfig } from '../types';
import { Rocket, Hourglass, RotateCcw, Sparkles, Clock, Calendar, AlertCircle, X } from 'lucide-react';

export const TimeMachine: React.FC = () => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isTraveling, setIsTraveling] = useState(false);
  const [progress, setProgress] = useState(0);

  // Modal & Date Selection State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<Destination | null>(null);
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Configuration for visual themes
  const configs: Record<Destination, TravelConfig> = {
    [Destination.Future]: {
      message: "", 
      year: "",
      themeColor: "bg-blue-900/40 border-blue-500/50 text-blue-100",
      accentColor: "bg-blue-500",
      icon: 'rocket'
    },
    [Destination.Past]: {
      message: "",
      year: "",
      themeColor: "bg-amber-900/40 border-amber-500/50 text-amber-100",
      accentColor: "bg-amber-500",
      icon: 'hourglass'
    }
  };

  // Date Helper: Get formatted date string for inputs
  // const getTodayString = () => {
  //   const d = new Date();
  //   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // };

  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getYesterdayString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Step 1: Open Modal
  const initiateTravel = (dest: Destination) => {
    setPendingDestination(dest);
    setTargetDate('');
    setError(null);
    setIsModalOpen(true);
  };

  // Step 2: Confirm Date and Start Simulation
  const handleConfirmDate = () => {
    if (!targetDate) {
      setError("⚠️ Please select a date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create local date object from input to avoid UTC shifting
    const [y, m, d] = targetDate.split('-').map(Number);
    const selected = new Date(y, m - 1, d);

    if (pendingDestination === Destination.Future) {
      if (selected <= today) {
        setError("⚠️ Please choose a date after today to travel to the future.");
        return;
      }
    } else if (pendingDestination === Destination.Past) {
      if (selected >= today) {
        setError("⚠️ Please choose a date before today to travel to the past.");
        return;
      }
    }

    // Validated
    setIsModalOpen(false);
    startTravelSimulation(pendingDestination!);
  };

  const startTravelSimulation = (dest: Destination) => {
    setIsTraveling(true);
    setProgress(0);
    setDestination(null);

    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsTraveling(false);
        setDestination(dest);
      }
    }, interval);
  };

  const handleReset = () => {
    setDestination(null);
    setProgress(0);
    setTargetDate('');
    setError(null);
  };

  const getFormattedDate = () => {
    if (!targetDate) return '';
    const [y, m, d] = targetDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getTargetYear = () => {
    if (!targetDate) return '????';
    return targetDate.split('-')[0];
  };

  return (
    <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500 z-10">
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-4 ring-1 ring-white/10 shadow-inner">
          <Clock className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-3 tracking-tight">
          Time Machine
        </h1>
        <p className="text-slate-400 text-lg">
          Choose your temporal destination
        </p>
      </header>

      {/* Main Controls */}
      {!destination && !isTraveling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
          <button
            id="btnFuture"
            onClick={() => initiateTravel(Destination.Future)}
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Travel to the Future"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-10 h-10 text-blue-300" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-100 mb-1">Go to the Future</h3>
                <p className="text-sm text-blue-300/70">Forward in time</p>
              </div>
            </div>
          </button>

          <button
            id="btnPast"
            onClick={() => initiateTravel(Destination.Past)}
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Travel to the Past"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-amber-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Hourglass className="w-10 h-10 text-amber-300" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-amber-100 mb-1">Go to the Past</h3>
                <p className="text-sm text-amber-300/70">Back in time</p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Traveling Animation State */}
      {isTraveling && (
        <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-pink-500 rounded-full animate-spin [animation-direction:reverse]" />
            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-2xl text-white">
              {Math.round(progress)}%
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Initiating Warp Drive...</h2>
          <p className="text-slate-400">Targeting: {getFormattedDate()}</p>
        </div>
      )}

      {/* Success Result */}
      {destination && (
        <div id="messageBox" className={`rounded-2xl border p-8 text-center animate-in zoom-in-95 duration-500 ${configs[destination].themeColor}`}>
          <div className="mb-6 flex justify-center animate-float">
            {configs[destination].icon === 'rocket' ? (
              <Sparkles className="w-16 h-16 text-blue-300" />
            ) : (
              <Clock className="w-16 h-16 text-amber-300" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Arrival Confirmed</h2>
          <div className="text-6xl font-black mb-6 opacity-90 tracking-tighter">
            {getTargetYear()}
          </div>
          <p className="text-lg leading-relaxed mb-8 font-medium">
            🎉 Congratulations! You have successfully traveled to the {destination === Destination.Future ? 'FUTURE' : 'PAST'} — destination date: {getFormattedDate()}.
          </p>

          <button
            id="btnReset"
            onClick={handleReset}
            className="group flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span>Return to Present</span>
          </button>
        </div>
      )}

      {/* Date Picker Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              {pendingDestination === Destination.Future ? 'Choose a Future Date' : 'Choose a Past Date'}
            </h3>
            <p className="text-slate-400 mb-6 text-sm">
              {pendingDestination === Destination.Future 
                ? 'Select a date after today to begin your journey.' 
                : 'Select a date before today to rewind time.'}
            </p>

            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <label htmlFor="modalDateInput" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Select Date
                </label>
                <input
                  type="date"
                  id="modalDateInput"
                  value={targetDate}
                  min={pendingDestination === Destination.Future ? getTomorrowString() : undefined}
                  max={pendingDestination === Destination.Past ? getYesterdayString() : undefined}
                  onChange={(e) => {
                    setTargetDate(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
                />
              </div>

              {error && (
                <div id="modalError" className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2 text-red-200 text-sm animate-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  id="btnCancelDate"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  id="btnConfirmDate"
                  onClick={handleConfirmDate}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                >
                  Confirm Travel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};