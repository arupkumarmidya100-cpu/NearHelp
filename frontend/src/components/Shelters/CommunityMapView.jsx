import React, { useState } from 'react';

const SHELTERS_AND_HAZARDS = [
    {
        id: 'shelter-1',
        type: 'shelter',
        title: 'St. Jude Emergency Safe Haven',
        address: '840 Harrison St',
        capacity: '84% Capacity (42/50 Beds)',
        status: 'Open • Power & Medical Ready',
        distance: '0.6 km',
        icon: 'night_shelter',
        badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
        id: 'triage-2',
        type: 'medical',
        title: 'Triage Medical Station Beta',
        address: '442 Market St',
        capacity: 'Paramedics on-site',
        status: 'Operational • Level 2 Trauma',
        distance: '0.4 km',
        icon: 'local_hospital',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
        id: 'hazard-1',
        type: 'hazard',
        title: '4th Ave Gas Leak / Road Closed',
        address: '4th Ave & Mission St',
        capacity: 'Perimeter 200m Evacuated',
        status: 'Severe Danger • Do Not Enter',
        distance: '0.9 km',
        icon: 'traffic',
        badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
];

export function CommunityMapView({ onReportHazard }) {
    const [filter, setFilter] = useState('all');
    const [isReporting, setIsReporting] = useState(false);
    const [reportType, setReportType] = useState('hazard');
    const [reportText, setReportText] = useState('');

    const filteredList = SHELTERS_AND_HAZARDS.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    const handleSubmitReport = (e) => {
        e.preventDefault();
        if (!reportText.trim()) return;
        alert(`Report logged: [${reportType.toUpperCase()}] ${reportText}`);
        setReportText('');
        setIsReporting(false);
    };

    return (
        <div className="relative z-10 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full flex flex-col gap-6 text-slate-100">
            {/* Top Tactical Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 px-4 py-2 rounded-xl">
                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">satellite_alt</span>
                    <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">GRID VECTOR SECTOR 04</span>
                        <span className="text-xs font-mono text-white font-semibold">37°46'35.2"N 122°24'59.1"W</span>
                    </div>
                </div>

                <button 
                    onClick={() => setIsReporting(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all cursor-pointer self-start sm:self-auto"
                >
                    <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
                    <span>+ Report Hazard or Safe Haven</span>
                </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                        filter === 'all'
                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                            : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                >
                    All Alerts ({SHELTERS_AND_HAZARDS.length})
                </button>
                <button
                    onClick={() => setFilter('shelter')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                        filter === 'shelter'
                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                            : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                >
                    Shelters (1)
                </button>
                <button
                    onClick={() => setFilter('medical')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                        filter === 'medical'
                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                            : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                >
                    Medical (1)
                </button>
                <button
                    onClick={() => setFilter('hazard')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                        filter === 'hazard'
                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                            : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                >
                    Hazards (1)
                </button>
            </div>

            {/* List of Shelters and Hazards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredList.map((item) => (
                    <div 
                        key={item.id}
                        className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-xl hover:border-cyan-500/40 transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400">
                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                                    <span className="text-xs text-slate-400">{item.address} • {item.distance}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5 text-xs">
                            <span className="text-slate-300 font-medium">{item.capacity}</span>
                            <span className={`px-2 py-1 rounded-md border text-[11px] font-mono w-max ${item.badgeColor}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Reporting Hazard */}
            {isReporting && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
                    <form 
                        onSubmit={handleSubmitReport}
                        className="w-full max-w-md bg-slate-900 border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Report Hazard or Safe Haven</h3>
                            <button 
                                type="button" 
                                onClick={() => setIsReporting(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setReportType('hazard')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition ${
                                    reportType === 'hazard' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                Hazard / Blockage
                            </button>
                            <button
                                type="button"
                                onClick={() => setReportType('shelter')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition ${
                                    reportType === 'shelter' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                Safe Haven
                            </button>
                        </div>

                        <textarea
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            placeholder="Describe location and situation (e.g. Flooded road on 5th street)..."
                            className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 h-24"
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsReporting(false)}
                                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                            >
                                Broadcast Report
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
