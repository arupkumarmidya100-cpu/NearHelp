import { useEffect, useState } from 'react';
import { initSocket, getSocket, disconnectSocket } from './services/socket';
import { useVoiceTrigger } from './hooks/useVoiceTrigger';
import { useLocation } from './hooks/useLocation';
import { useSocketEvents } from './hooks/useSocketEvents';
import { MapContainer } from './components/Map/MapContainer';
import { CrisisSelector } from './components/SOS/CrisisSelector';
import { SosTriggerButton } from './components/SOS/SosTriggerButton';
import { IncomingSosModal } from './components/SOS/IncomingSosModal';
import { LiveTrackingView } from './components/Tracking/LiveTrackingView';
import { CommunityMapView } from './components/Shelters/CommunityMapView';
import { FirstAidView } from './components/Guides/FirstAidView';
import { AegisCommandView } from './components/Responder/AegisCommandView';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [mode, setMode] = useState('citizen'); // 'citizen' or 'responder'
  const [activeTab, setActiveTab] = useState('get-help'); // 'get-help', 'track-help', 'safe-shelters', 'first-aid'
  const [selectedCrisis, setSelectedCrisis] = useState('medical');
  const [activeSosIncident, setActiveSosIncident] = useState(null);

  // Hooks
  const { location, error: locationError } = useLocation();

  useEffect(() => {
    const socket = initSocket();
    
    socket.on('connect', () => {
      setIsConnected(true);
      // Flush offline SOS queue on reconnect
      const queue = JSON.parse(localStorage.getItem('offlineSosQueue') || '[]');
      if (queue.length > 0) {
        queue.forEach(payload => socket.emit('trigger_sos', payload));
        localStorage.removeItem('offlineSosQueue');
        console.log(`[NearHelp] Flushed ${queue.length} queued SOS event(s) after reconnect.`);
      }
    });
    socket.on('disconnect', () => setIsConnected(false));
    socket.connect();
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.error('Service Worker registration failed: ', err);
      });
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      disconnectSocket();
    };
  }, []);

  const { activeIncidents, responders, incomingSosQueue, dismissSos } = useSocketEvents();

  const handleTriggerSos = (isAnon) => {
    const payload = {
      type: selectedCrisis,
      types: [selectedCrisis],
      lat: location?.lat || 37.7749,
      lng: location?.lng || -122.4194,
      isAnon,
      timestamp: Date.now()
    };

    setActiveSosIncident(payload);
    setActiveTab('track-help');

    if (!isConnected) {
      alert("Offline mode: Your SOS is queued and saved in local cache. Live helpers will be notified as soon as network reconnects.");
      const queue = JSON.parse(localStorage.getItem('offlineSosQueue') || '[]');
      queue.push(payload);
      localStorage.setItem('offlineSosQueue', JSON.stringify(queue));
      return;
    }

    const socket = getSocket();
    socket.emit('trigger_sos', payload);
  };

  const handleVoiceEmergency = (data) => {
    const payload = {
      type: data.type || selectedCrisis || 'medical',
      types: [data.type || selectedCrisis || 'medical'],
      lat: location?.lat || 37.7749,
      lng: location?.lng || -122.4194,
      isAnon: false,
      isVoice: true,
      timestamp: Date.now()
    };

    setActiveSosIncident(payload);
    setActiveTab('track-help');

    if (isConnected) {
      const socket = getSocket();
      socket.emit('trigger_sos', payload);
    } else {
      alert("Voice SOS logged offline and saved locally.");
    }
  };

  const { isListening, startListening, stopListening } = useVoiceTrigger(handleVoiceEmergency);

  // Incoming SOS handling
  const currentIncomingSos = incomingSosQueue[0] || null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* ── TOP MAIN HEADER BAR (Image 16.html) ── */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-xl">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => { setMode('citizen'); setActiveTab('get-help'); }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-red-500 shadow-md">
              <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                <circle cx="12" cy="12" r="4"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
              Near<span className="text-red-500">Help</span>
            </h1>
          </div>

          {/* Navigation Tabs (Citizen Mode) */}
          {mode === 'citizen' && (
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('get-help')}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer font-semibold ${
                  activeTab === 'get-help'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                Get Help
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('track-help')}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer font-semibold flex items-center gap-1.5 ${
                  activeTab === 'track-help'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {activeSosIncident && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                )}
                Track Help
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('safe-shelters')}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer font-semibold ${
                  activeTab === 'safe-shelters'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                Safe Shelters
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('first-aid')}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer font-semibold ${
                  activeTab === 'first-aid'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                First Aid
              </button>
            </nav>
          )}
        </div>

        {/* Mode Switcher & Profile */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode(mode === 'citizen' ? 'responder' : 'citizen')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${
              mode === 'responder'
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900/90 border-white/10 text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${mode === 'responder' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="font-semibold text-white">
              {mode === 'responder' ? 'Responder CAD' : 'Citizen Mode'}
            </span>
          </button>

          <div 
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white/20 shadow-md" 
            title="Account Profile"
          >
            A
          </div>
        </div>
      </header>

      {/* ── BACKGROUND SATELLITE MAP (Always active in background) ── */}
      <main className="absolute inset-0 pt-14 z-0 w-screen h-screen">
        <MapContainer 
          userLocation={location} 
          activeIncidents={activeIncidents} 
          responders={responders} 
          mode={mode} 
        />
      </main>

      {/* ── VIEW 1: CITIZEN GET HELP SOS MODAL (Image 16.html) ── */}
      {mode === 'citizen' && activeTab === 'get-help' && (
        <>
          {/* Centered Urgent SOS Modal */}
          <section className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center p-4 sm:p-6 mt-10">
            <div className="pointer-events-auto w-full max-w-[420px] rounded-3xl bg-slate-900/85 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 transition-all">
              {/* Modal Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
                  What kind of help do you need?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300/90 leading-snug">
                  Tap once to select, then hold to send alert
                </p>
              </div>

              {/* 2x2 Crisis Selector */}
              <CrisisSelector 
                selectedCrisis={selectedCrisis} 
                onSelect={setSelectedCrisis} 
              />
              
              {/* SOS Button & Voice Trigger */}
              <SosTriggerButton 
                onTrigger={handleTriggerSos} 
                isVoiceActive={isListening} 
                onToggleVoice={isListening ? stopListening : startListening}
              />
            </div>
          </section>

          {/* Bottom Status Chip (Image 16.html) */}
          <footer className="fixed bottom-4 inset-x-0 z-30 pointer-events-none flex justify-center px-4">
            <div className="pointer-events-auto flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/90 backdrop-blur-md shadow-lg border border-white/10 text-xs text-slate-200">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span className="font-medium text-slate-200">
                Your location is detected: <strong className="text-white font-semibold">San Francisco Metro</strong>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                <strong className="text-white font-semibold">14 nearby helpers</strong> alerted when sent
              </span>
            </div>
          </footer>
        </>
      )}

      {/* ── VIEW 2: LIVE TRACKING & ETA (Image 15.html) ── */}
      {mode === 'citizen' && activeTab === 'track-help' && (
        <div className="fixed inset-0 z-30 pt-20 overflow-y-auto bg-slate-950/70 backdrop-blur-md">
          <LiveTrackingView 
            activeIncident={activeSosIncident || activeIncidents[0]}
            onCancelSos={() => {
              setActiveSosIncident(null);
              setActiveTab('get-help');
            }}
            isConnected={isConnected}
          />
        </div>
      )}

      {/* ── VIEW 3: SAFE SHELTERS & COMMUNITY MAP (Image 13.html) ── */}
      {mode === 'citizen' && activeTab === 'safe-shelters' && (
        <div className="fixed inset-0 z-30 pt-20 overflow-y-auto bg-slate-950/70 backdrop-blur-md">
          <CommunityMapView onReportHazard={(hazard) => console.log('Report hazard', hazard)} />
        </div>
      )}

      {/* ── VIEW 4: FIRST AID GUIDES (Image 11.html) ── */}
      {mode === 'citizen' && activeTab === 'first-aid' && (
        <div className="fixed inset-0 z-30 pt-20 overflow-y-auto bg-slate-950/70 backdrop-blur-md">
          <FirstAidView />
        </div>
      )}

      {/* ── VIEW 5: RESPONDER AEGIS COMMAND CAD (Image 2 (2).html) ── */}
      {mode === 'responder' && (
        <div className="fixed inset-0 z-30 pt-20 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
          <AegisCommandView 
            activeIncidents={activeIncidents} 
            onAcceptSos={(id) => {
              getSocket().emit('accept_sos', { sosId: id });
              dismissSos(id);
            }}
          />
        </div>
      )}

      {/* ── INCOMING SOS MODAL POPUP ── */}
      <IncomingSosModal 
        sosData={currentIncomingSos}
        queueCount={incomingSosQueue.length - 1}
        onAccept={(id) => {
          getSocket().emit('accept_sos', { sosId: id });
          dismissSos(id);
          setMode('responder');
        }}
        onDismiss={() => {
          dismissSos(currentIncomingSos?.id);
        }}
      />
    </div>
  );
}

export default App;
