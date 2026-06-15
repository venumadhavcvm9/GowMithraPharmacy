import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SalesVelocityChartProps {
  data: { name: string; sales: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs py-2 px-3 rounded-lg shadow-md border border-slate-700 font-mono">
        <p className="font-semibold mb-1 text-slate-300">{label}</p>
        <p>
          <span className="text-emerald-400">Sales: </span>
          ₹{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export function SalesVelocityChart({ data }: SalesVelocityChartProps) {
  return (
    <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Weekly Sales Velocity</h3>
        <p className="text-xs text-slate-400 font-medium">Displaying aggregated payments trend (Last 7 Days)</p>
      </div>
      <div className="h-64 mt-6 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar 
              dataKey="sales" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Active Vault (Cash/UPI)</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Last Updated Just Now</span>
      </div>
    </div>
  );
}
