import React, { useState } from 'react';
import { ChatPanel } from '../Chat/ChatPanel';
import { AiAssistant } from '../Chat/AiAssistant';

const MOCK_QUEUE = [
    {
        id: 'INC-8821',
        title: 'Structure Fire + Ammonia HazMat',
        location: '442 Market St • Zone Alpha (400m)',
        priority: 'P1',
        type: 'fire',
        time: '02m ago',
        status: 'Dispatched',
        units: 'Medic-02, Engine-09'
    },
    {
        id: 'INC-8822',
        title: 'Cardiac Arrest / CPR in Progress',
        location: '120 Post St • 0.3 km',
        priority: 'P1',
        type: 'medical',
        time: '04m ago',
        status: 'En Route',
        units: 'Medic-04'
    },
    {
        id: 'INC-8823',
        title: 'Multi-Vehicle Collision',
        location: 'Hwy 101 N Exit 432',
        priority: 'P2',
        type: 'security',
        time: '07m ago',
        status: 'Triage Pending',
        units: 'Patrol-11'
    }
];

export function AegisCommandView({ activeIncidents, onAcceptSos }) {
    const [selectedIncident, setSelectedIncident] = useState(MOCK_QUEUE[0]);
    const [filterPriority, setFilterPriority] = useState('ALL');

    const incidentsList = [
        ...activeIncidents.map((inc, i) => ({
            id: inc.id || `LIVE-${i + 1}`,
            title: `${inc.type?.toUpperCase() || 'EMERGENCY'} - Live Citizen SOS`,
            location: `${inc.lat?.toFixed(4) || '37.77'}, ${inc.lng?.toFixed(4) || '-122.41'}`,
            priority: 'P1',
            type: inc.type || 'medical',
            time: 'Just now',
            status: 'Incoming Broadcast',
            units: 'Assigning...'
        })),
        ...MOCK_QUEUE
    ];

    const filtered = incidentsList.filter(item => {
        if (filterPriority === 'ALL') return true;
        return item.priority === filterPriority;
    });

    return (
        <div className="relative z-10 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full flex flex-col gap-6 text-slate-100">
            {/* Top Tactical Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                        <span className="text-xs font-mono font-bold uppercase text-cyan-400">DEFCON 4 OPERATIONAL</span>
                    </div>
                    <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-400 text-sm">warning</span>
                        <span className="text-xs font-mono font-bold uppercase text-red-400">{filtered.length} Active Queue</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-mono text-slate-300">
                        RADIO UPLINK: <span className="text-cyan-400 font-bold">408.25 MHz TAC-1</span>
                    </div>
                    <button 
                        onClick={() => alert('🚨 Emergency CAD Flash broadcast to all registered regional responders!')}
                        className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition"
                    >
                        Broadcast Alert
                    </button>
                </div>
            </div>

            {/* Main Command Matrix Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Incident Queue Matrix (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-white/10">
                        <span className="text-xs font-mono uppercase font-bold text-white tracking-wide">Incident Matrix</span>
                        <div className="flex gap-1">
                            {['ALL', 'P1', 'P2'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setFilterPriority(p)}
                                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition ${
                                        filterPriority === p ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                        {filtered.map(inc => (
                            <div
                                key={inc.id}
                                onClick={() => setSelectedIncident(inc)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                                    selectedIncident?.id === inc.id
                                        ? 'bg-slate-800/90 border-red-500 shadow-lg'
                                        : 'bg-slate-900/70 border-white/10 hover:bg-slate-800/60'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-cyan-400">{inc.id}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                        inc.priority === 'P1' ? 'bg-red-600/30 text-red-400 border border-red-500/40' : 'bg-amber-600/30 text-amber-400 border border-amber-500/40'
                                    }`}>
                                        {inc.priority} PRIORITY
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                                    <span>{inc.location}</span>
                                    <span>{inc.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Incident Action Console (7 Cols) */}
                <div className="lg:col-span-7 bg-slate-900/90 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                    <div className="flex items-start justify-between border-b border-white/10 pb-3">
                        <div>
                            <span className="text-xs font-mono text-slate-400">DISPATCH CONSOLE // {selectedIncident?.id}</span>
                            <h3 className="text-lg font-bold text-white mt-0.5">{selectedIncident?.title}</h3>
                            <span className="text-xs text-slate-300 font-mono">{selectedIncident?.location}</span>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                            {selectedIncident?.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-[220px] bg-slate-950/80 border border-white/10 rounded-xl overflow-hidden">
                            <ChatPanel sosId={selectedIncident?.id} isResponder={true} />
                        </div>
                        <div className="h-[220px] bg-slate-950/80 border border-white/10 rounded-xl overflow-hidden">
                            <AiAssistant crisisType={selectedIncident?.type} description={selectedIncident?.title} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-slate-400 font-mono">Assigned Units: {selectedIncident?.units}</span>
                        <button
                            type="button"
                            onClick={() => alert(`Responder unit dispatched to ${selectedIncident?.id}`)}
                            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition"
                        >
                            Acknowledge & Deploy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
