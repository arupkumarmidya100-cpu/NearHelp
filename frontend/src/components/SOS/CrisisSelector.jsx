import React from 'react';

const CRISIS_TYPES = [
    { 
        id: 'medical', 
        label: 'Medical', 
        subtext: 'Injuries, illness', 
        color: 'red',
        activeBg: 'bg-red-600/20 border-red-500 shadow-red-950/40',
        activeIconBg: 'bg-red-600 text-white',
        dotColor: 'bg-red-400',
        hoverIconBg: 'group-hover:bg-red-600/30 text-red-400',
        iconPath: (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        )
    },
    { 
        id: 'fire', 
        label: 'Fire', 
        subtext: 'Fire, smoke, gas', 
        color: 'amber',
        activeBg: 'bg-amber-600/20 border-amber-500 shadow-amber-950/40',
        activeIconBg: 'bg-amber-600 text-white',
        dotColor: 'bg-amber-400',
        hoverIconBg: 'group-hover:bg-amber-600/30 text-amber-400',
        iconPath: (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.61 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
            </svg>
        )
    },
    { 
        id: 'security', 
        label: 'Police / Safety', 
        subtext: 'Danger, break-in', 
        color: 'blue',
        activeBg: 'bg-blue-600/20 border-blue-500 shadow-blue-950/40',
        activeIconBg: 'bg-blue-600 text-white',
        dotColor: 'bg-blue-400',
        hoverIconBg: 'group-hover:bg-blue-600/30 text-blue-400',
        iconPath: (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
        )
    },
    { 
        id: 'other', 
        label: 'Other', 
        subtext: 'Accidents, hazards', 
        color: 'purple',
        activeBg: 'bg-purple-600/20 border-purple-500 shadow-purple-950/40',
        activeIconBg: 'bg-purple-600 text-white',
        dotColor: 'bg-purple-400',
        hoverIconBg: 'group-hover:bg-purple-600/30 text-purple-400',
        iconPath: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )
    }
];

export function CrisisSelector({ selectedCrisis, onSelect }) {
    return (
        <div aria-label="Incident Type" className="grid grid-cols-2 gap-3 mb-4" role="radiogroup">
            {CRISIS_TYPES.map((crisis) => {
                const isSelected = selectedCrisis === crisis.id;
                return (
                    <button
                        key={crisis.id}
                        type="button"
                        onClick={() => onSelect(crisis.id)}
                        className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                            isSelected
                                ? `${crisis.activeBg} border-2 shadow-md`
                                : 'bg-slate-900/60 border border-white/10 hover:border-white/25'
                        }`}
                    >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition ${
                            isSelected
                                ? crisis.activeIconBg
                                : `bg-slate-800/80 ${crisis.hoverIconBg}`
                        }`}>
                            {crisis.iconPath}
                        </span>
                        <span className="text-xs font-semibold text-white tracking-wide">
                            {crisis.label}
                        </span>
                        <span className="text-[10px] text-slate-400">
                            {crisis.subtext}
                        </span>
                        {isSelected && (
                            <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${crisis.dotColor} animate-pulse`} />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
