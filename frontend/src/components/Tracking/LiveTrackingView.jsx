import React from 'react';
import { ChatPanel } from '../Chat/ChatPanel';
import { AiAssistant } from '../Chat/AiAssistant';

export function LiveTrackingView({ activeIncident, onCancelSos, isConnected }) {
    const incidentType = activeIncident?.type || 'medical';

    return (
        <div className="relative z-10 px-4 md:px-8 py-6 max-w-5xl mx-auto w-full flex flex-col gap-6 text-slate-100">
            {/* Top Telemetry Status Pill */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-white">
                        Location Synced • Live Responder GPS Active
                    </span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Emergency Channel Encrypted</span>
                </div>
            </div>

            {/* Main Active SOS Command Card */}
            <div className="bg-slate-900/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
                {/* Reassuring Status Badge & ETA */}
                <div className="rounded-2xl bg-slate-800/80 p-4 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-2xl animate-pulse">near_me</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <span className="text-xs font-bold uppercase text-emerald-400">Help is on the way</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                {incidentType.toUpperCase()} Alert Active
                            </h3>
                            <p className="text-xs text-slate-400">Responder Unit #04 dispatched to your GPS location</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:items-end">
                        <span className="text-[10px] font-mono uppercase text-slate-400">ESTIMATED ARRIVAL</span>
                        <span className="text-2xl font-mono font-extrabold text-cyan-400">03m 42s</span>
                        <span className="text-xs text-slate-400">Distance: 450 meters</span>
                    </div>
                </div>

                {/* Emergency Responders & Chat Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Live Emergency Chat */}
                    <div className="h-[280px] bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                        <ChatPanel 
                            sosId={activeIncident?.id || activeIncident?._id || 'active-sos'} 
                            isResponder={false} 
                        />
                    </div>

                    {/* AI First-Responder Copilot */}
                    <div className="h-[280px] bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                        <AiAssistant 
                            crisisType={incidentType} 
                            description={activeIncident?.description} 
                        />
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                    <span className="text-xs text-slate-400">
                        Stay where you are if safe. Emergency responders can see your live telemetry.
                    </span>
                    <button
                        type="button"
                        onClick={onCancelSos}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer border border-white/10 self-end sm:self-auto"
                    >
                        Resolve / Cancel SOS
                    </button>
                </div>
            </div>
        </div>
    );
}
