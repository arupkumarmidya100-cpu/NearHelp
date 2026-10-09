import React, { useState } from 'react';

const FIRST_AID_PROTOCOLS = [
    {
        id: 'cpr',
        title: 'CPR & Chest Compressions',
        category: 'Life Support',
        icon: 'cardiology',
        steps: [
            'Check responsiveness: Tap shoulders and shout "Are you OK?"',
            'Call 911 or direct someone nearby to call immediately.',
            'Position hands in center of chest, interlock fingers.',
            'Push hard and fast: 100-120 compressions/min (2 inches deep).',
            'Continue until emergency medical responders arrive or AED is ready.'
        ]
    },
    {
        id: 'choking',
        title: 'Choking (Heimlich Maneuver)',
        category: 'Airway',
        icon: 'air',
        steps: [
            'Confirm choking: Ask "Are you choking?" Look for inability to speak.',
            'Stand behind person, wrap arms around their waist.',
            'Make a fist with one hand, place thumb side just above navel.',
            'Grasp fist with other hand and give quick upward thrusts.',
            'Repeat until object is dislodged or person becomes unconscious.'
        ]
    },
    {
        id: 'bleeding',
        title: 'Severe Arterial Bleeding',
        category: 'Trauma',
        icon: 'bloodtype',
        steps: [
            'Apply immediate direct pressure with sterile gauze or clean cloth.',
            'Do NOT remove soaked dressings; layer more gauze on top.',
            'Elevate injured limb above heart level if no fractures suspected.',
            'If severe extremity bleed won\'t stop, apply tourniquet 2-3 inches above wound.',
            'Keep patient warm and calm to prevent hypovolemic shock.'
        ]
    },
    {
        id: 'burns',
        title: 'Thermal & Chemical Burns',
        category: 'Burns',
        icon: 'local_fire_department',
        steps: [
            'Stop burning process: Remove from heat or flush chemicals with cool water for 20 min.',
            'Do NOT apply ice directly or pop blisters.',
            'Cover loosely with a sterile, non-adherent dressing.',
            'Remove jewelry or tight clothing near the burn before swelling begins.',
            'Seek immediate medical care for burns larger than palm size or on face/joints.'
        ]
    }
];

export function FirstAidView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProtocol, setSelectedProtocol] = useState(FIRST_AID_PROTOCOLS[0]);

    const filtered = FIRST_AID_PROTOCOLS.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.steps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="relative z-10 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full flex flex-col gap-6 text-slate-100">
            {/* Header Section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs uppercase">
                            <span className="material-symbols-outlined text-[14px]">offline_pin</span>
                            Offline Cache Ready
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-mono text-xs uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            Local Sync
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                        Emergency First Aid Guides
                    </h1>
                    <p className="text-sm text-slate-400">
                        Standard Operating Life-Support Procedures. Operational without active network uplink.
                    </p>
                </div>

                <a 
                    href="tel:911"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 active:scale-95 transition-all self-start md:self-auto"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                    <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                    <span>EMERGENCY DIAL 911</span>
                </a>
            </section>

            {/* Search Input */}
            <div className="relative w-full rounded-xl bg-slate-900/80 border border-white/10 shadow-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search symptoms: choking, bleeding, 3rd-degree burn, CPR, seizure..."
                    className="w-full pl-11 pr-12 py-3 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                )}
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Protocol Selector List */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                        Emergency Protocols ({filtered.length})
                    </span>
                    {filtered.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedProtocol(item)}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                                selectedProtocol.id === item.id
                                    ? 'bg-red-600/20 border-red-500 text-white shadow-lg'
                                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800/80'
                            }`}
                        >
                            <span className="material-symbols-outlined text-red-400 text-2xl">
                                {item.icon}
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                                <span className="text-xs text-slate-400">{item.category}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Active Guide Steps */}
                <div className="md:col-span-2 bg-slate-900/90 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <span className="text-xs font-mono uppercase text-cyan-400">{selectedProtocol.category} PROTOCOL</span>
                            <h2 className="text-xl font-bold text-white">{selectedProtocol.title}</h2>
                        </div>
                        <span className="material-symbols-outlined text-3xl text-red-500">
                            {selectedProtocol.icon}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {selectedProtocol.steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-white/5">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 flex items-center justify-center font-bold text-xs">
                                    {idx + 1}
                                </span>
                                <p className="text-sm text-slate-200 leading-relaxed">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
