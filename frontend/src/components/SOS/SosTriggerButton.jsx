import React, { useState, useRef, useEffect } from 'react';

export function SosTriggerButton({ onTrigger, isVoiceActive, onToggleVoice }) {
    const [isAnon, setIsAnon] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const holdTimerRef = useRef(null);
    const progressIntervalRef = useRef(null);

    const HOLD_DURATION = 1500; // 1.5 seconds hold

    const startHold = () => {
        setIsHolding(true);
        setHoldProgress(0);
        const startTime = Date.now();

        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
            setHoldProgress(progress);
        }, 30);

        holdTimerRef.current = setTimeout(() => {
            setIsHolding(false);
            setHoldProgress(0);
            clearInterval(progressIntervalRef.current);
            onTrigger(isAnon);
        }, HOLD_DURATION);
    };

    const cancelHold = () => {
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setIsHolding(false);
        setHoldProgress(0);
    };

    useEffect(() => {
        return () => {
            if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col gap-3 w-full select-none">
            {/* Main HOLD TO SEND SOS Button */}
            <div className="relative">
                <button
                    type="button"
                    onMouseDown={startHold}
                    onMouseUp={cancelHold}
                    onMouseLeave={cancelHold}
                    onTouchStart={startHold}
                    onTouchEnd={cancelHold}
                    onClick={() => {
                        // Quick click triggers immediately if user didn't hold
                        if (!isHolding && holdProgress === 0) {
                            onTrigger(isAnon);
                        }
                    }}
                    className={`w-full relative group overflow-hidden py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-red-600/40 hover:shadow-red-600/60 transition-all transform cursor-pointer border border-red-400/40 ${
                        isHolding ? 'scale-[0.98]' : 'hover:scale-[1.01]'
                    }`}
                >
                    {/* Hold Progress Bar Overlay */}
                    {holdProgress > 0 && (
                        <div 
                            className="absolute inset-0 bg-white/30 transition-all duration-75"
                            style={{ width: `${holdProgress}%` }}
                        />
                    )}

                    <span className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                        <span className="flex items-center gap-2 text-base font-extrabold tracking-wider">
                            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {isHolding ? `DISPATCHING... ${Math.round(holdProgress)}%` : 'HOLD TO SEND SOS'}
                        </span>
                        <span className="text-[11px] font-normal text-red-100 opacity-90">
                            Press & hold 1.5s to alert nearby helpers
                        </span>
                    </span>
                </button>
            </div>

            {/* Voice Emergency Guidance Bar */}
            <button
                type="button"
                onClick={onToggleVoice}
                className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full border transition-all cursor-pointer ${
                    isVoiceActive
                        ? 'bg-red-950/80 border-red-500/60 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : 'bg-slate-900/80 border-white/10 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
            >
                <div className={`w-2.5 h-2.5 rounded-full ${isVoiceActive ? 'bg-red-500 animate-ping' : 'bg-slate-500'}`} />
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 02-3-3V5a3 3 0 116 0v6a3 3 0 02-3 3z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-medium tracking-wide">
                    {isVoiceActive ? 'Listening to voice trigger... Speak now' : 'Or speak what happened... tap to listen'}
                </span>
            </button>

            {/* Keep My Name Private Checkbox */}
            <div className="flex items-center justify-center gap-2 pt-1 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={isAnon}
                        onChange={(e) => setIsAnon(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-red-500 focus:ring-offset-slate-950 cursor-pointer"
                    />
                    <span>Keep my name private</span>
                </label>
            </div>
        </div>
    );
}
