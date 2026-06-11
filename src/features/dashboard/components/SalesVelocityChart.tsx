import React from 'react';

interface SalesVelocityChartProps {
  recentDaysSales: number[];
  maxDaySales: number;
}

export function SalesVelocityChart({ recentDaysSales, maxDaySales }: SalesVelocityChartProps) {
  return (
    <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Weekly Sales Velocity</h3>
        <p className="text-xs text-slate-400 font-medium">Displaying aggregated payments trend (Day 1 - Current Day)</p>
      </div>
      <div className="h-44 my-4 flex items-end gap-3 justify-between px-2 pt-4 relative">
        <div className="absolute inset-0 w-full flex flex-col justify-between pointer-events-none opacity-5 mt-4">
          <div className="border-t border-slate-900 w-full h-[1px]"></div>
          <div className="border-t border-slate-900 w-full h-[1px]"></div>
          <div className="border-t border-slate-900 w-full h-[1px]"></div>
        </div>
        {recentDaysSales.map((salesAmt, idx) => {
          const heightPercent = (salesAmt / maxDaySales) * 100;
          const isToday = idx === recentDaysSales.length - 1;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div className="w-full bg-slate-50 group-hover:bg-slate-100 rounded-lg flex items-end h-32 overflow-hidden border border-slate-100 transition-colors">
                <div 
                  className={`w-full rounded-t-md transition-all duration-500 ${isToday ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/10' : 'bg-gradient-to-t from-slate-400 to-slate-300'}`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
              </div>
              <div className="absolute -top-6 bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono tracking-tight shadow-md z-10">
                ₹{salesAmt.toFixed(0)}
              </div>
              <span className="text-[10px] font-semibold text-slate-400 font-mono">
                {isToday ? 'Today' : `Day ${idx + 1}`}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Active Vault (Cash)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span>Historic Average</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Last Updated Just Now</span>
      </div>
    </div>
  );
}
