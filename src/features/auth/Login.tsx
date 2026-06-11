import React from 'react';
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLogin } from './hooks/useLogin';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const {
    username, setUsername, password, setPassword,
    showPassword, setShowPassword, error, isLoading, handleSubmit
  } = useLogin(onLoginSuccess);

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#10B981] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight">Pharmacy Portal</h2>
          <p className="text-[#64748B] text-sm mt-1">Secure Professional Login</p>
        </div>
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-[#94A3B8]" />
              </div>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#334155] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all sm:text-sm font-medium" placeholder="pharmacy_admin" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-[#94A3B8]" />
              </div>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#334155] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all sm:text-sm font-medium" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#64748B] focus:outline-none">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center pt-1 pb-3">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#10B981] focus:ring-[#10B981] border-[#CBD5E1] rounded" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[#64748B] font-medium">Keep me logged in</label>
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? 'Authenticating...' : 'Submit Credentials'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-sm font-semibold text-[#10B981] hover:text-[#059669]">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
