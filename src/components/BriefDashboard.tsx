import React from 'react';
import { 
  Activity,
  IndianRupee, 
  CreditCard, 
  Users, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { Sale, Product, Customer } from '../types';

interface BriefDashboardProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
  setActiveTab: (tab: string) => void;
}

export default function BriefDashboard({ sales, products, customers, setActiveTab }: BriefDashboardProps) {
  // Calculations
  const totalSalesVal = sales.reduce((acc, sale) => acc + sale.total, 0);
  const cashSalesVal = sales
    .filter(s => s.paymentMode === 'Cash')
    .reduce((acc, s) => acc + s.total, 0);
  const upiSalesVal = sales
    .filter(s => s.paymentMode === 'UPI')
    .reduce((acc, s) => acc + s.total, 0);

  const outstandingBal = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);

  // Simple dataset for trend representing simulated sales of past 6 days
  const recentDaysSales = [320, 410, 290, 580, 490, totalSalesVal];
  const maxDaySales = Math.max(...recentDaysSales, 1);

  return (
    <div id="dashboard-tab" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Store Performance Overview</h2>
          <p className="text-sm text-slate-500">Real-time statistics for pharmaceutical sales, reconciliation, and audit logs.</p>
        </div>
        <button 
          onClick={() => setActiveTab('shop')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md shadow-emerald-600/15 group"
        >
          Open POS Counter
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Calculated Revenue */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="p-2.5 bg-indigo-100/60 text-indigo-700 rounded-xl">
              <Activity className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Gross Total
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-4">Calculated Revenue</p>
          <p className="text-2xl font-bold text-slate-800 tracking-tight mt-1">₹{totalSalesVal.toFixed(2)}</p>
          <div className="mt-2 text-xs text-slate-400 font-medium">From {sales.length} orders settled</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="p-2.5 bg-sky-100/60 text-sky-700 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
              Cash Drawer
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-4">EOD Cash Collected</p>
          <p className="text-2xl font-bold text-slate-800 tracking-tight mt-1">₹{cashSalesVal.toFixed(2)}</p>
          <div className="mt-2 text-xs text-slate-400 font-medium">Awaiting vault deposit approval</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="p-2.5 bg-purple-100/60 text-purple-700 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
              UPI Gateway
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-4">UPI Settlement</p>
          <p className="text-2xl font-bold text-slate-800 tracking-tight mt-1">₹{upiSalesVal.toFixed(2)}</p>
          <div className="mt-2 text-xs text-slate-400 font-medium">Deposited directly to bank</div>
        </div>

      </div>

      {/* Main Grid: Revenue Trend & Store Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sparkline & Bar Chart Visualizer */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Weekly Sales Velocity</h3>
            <p className="text-xs text-slate-400 font-medium">Displaying aggregated payments trend (Day 1 - Current Day)</p>
          </div>
          
          {/* Custom SVG Line & Bar Composite Chart */}
          <div className="h-44 my-4 flex items-end gap-3 justify-between px-2 pt-4 relative">
            {/* Grid Line Guides */}
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
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isToday 
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/10' 
                          : 'bg-gradient-to-t from-slate-400 to-slate-300'
                      }`}
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
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Active Vault (Cash)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>Historic Average</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
              Last Updated Just Now
            </span>
          </div>
        </div>

        {/* Quick Outstanding Customer List */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Credit Log Accounts</h3>
              <span className="p-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-[10px] font-bold">Pending Recovers</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-4">Unsettled outstanding account receivables.</p>
            
            <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
              {customers.map((cust) => (
                <div key={cust.id} className="flex justify-between items-center text-sm border-b border-dashed border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-slate-700 leading-tight">{cust.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cust.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 font-mono">₹{cust.outstandingBalance.toFixed(2)}</p>
                    <button 
                      onClick={() => setActiveTab('shop')}
                      className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold leading-none mt-0.5 hover:underline"
                    >
                      Clear balance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Total Credit Receivables</span>
              <span className="font-bold text-slate-800 font-mono text-sm text-[15px]">₹{outstandingBal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
