
import React, { useState } from 'react';
import { Department, AcademicYear } from '../types';

interface LoginProps {
  onLogin: (dept: Department, year?: AcademicYear) => void;
}

const LOGO_URL = "https://lh3.googleusercontent.com/d/18pAKHffTYVmymmTmWgJS0S4sAE5XlMfQ";
const FOUNDER_URL = "https://lh3.googleusercontent.com/d/18u-Sxsq8BhRkFCxKeNBh4Pi85M1kmFFi";

// Mapping of Departments to their unique passwords
const DEPARTMENT_PASSWORDS: Record<Department, string> = {
  [Department.ADMIN]: "Admin@DBPC",
  [Department.MECH]: "Mech@DBPC",
  [Department.EEE]: "EEE@DBPC",
  [Department.CIVIL]: "Civil@DBPC",
  [Department.CSE]: "CSE@DBPC",
  [Department.ECE]: "ECE@DBPC",
  [Department.BASIC]: "Basic@DBPC",
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedDept, setSelectedDept] = useState<Department>(Department.BASIC);
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(AcademicYear.FIRST);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const departments = Object.values(Department);
  const years = Object.values(AcademicYear);

  const handleLoginSubmit = () => {
    setError('');
    const correctPassword = DEPARTMENT_PASSWORDS[selectedDept];

    if (password === correctPassword) {
      if (selectedDept === Department.ADMIN) {
        onLogin(selectedDept);
      } else {
        onLogin(selectedDept, selectedYear);
      }
    } else {
      setError(`Invalid security key for ${selectedDept}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-20 overflow-hidden relative">
      {/* Background blobs for depth */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>

      <div className="glass w-full max-w-md p-8 rounded-[3rem] shadow-2xl z-10 border border-white/10 relative">
        {/* Founder Image Overlay */}
        <div className="flex justify-center -mt-24 mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img 
              src={FOUNDER_URL} 
              alt="Founder Don Bosco" 
              className="w-36 h-36 rounded-full border-4 border-white/20 shadow-2xl object-cover relative z-10 transform transition group-hover:scale-105 duration-500"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Don+Bosco' }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={LOGO_URL} 
              alt="College Logo" 
              className="h-28 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-float"
            />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white mb-1 uppercase leading-tight">
            Don Bosco Polytechnic College
          </h1>
          <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.25em] mb-4">
            Givers of All Talent Students
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto mb-4"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Department</label>
            <select 
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value as Department);
                setError('');
              }}
              className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-sm font-medium"
            >
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-slate-900">{dept}</option>
              ))}
            </select>
          </div>

          {selectedDept !== Department.ADMIN && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Academic Year</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as AcademicYear)}
                className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-sm font-medium"
              >
                {years.map(year => (
                  <option key={year} value={year} className="bg-slate-900">{year}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Security Key</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className={`w-full bg-slate-900/60 border ${error ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm tracking-widest`}
              onKeyDown={(e) => e.key === 'Enter' && handleLoginSubmit()}
            />
            {error && <p className="text-red-400 text-[10px] font-bold mt-3 ml-2 uppercase tracking-wider animate-pulse">⚠️ {error}</p>}
          </div>

          <button 
            onClick={handleLoginSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 transform transition active:scale-[0.98] hover:scale-[1.01] focus:outline-none mt-6 text-[11px] uppercase tracking-[0.2em]"
          >
            Authenticate Access
          </button>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-[9px] text-slate-600 font-bold tracking-[0.4em] uppercase">House Point Management System</p>
          <p className="text-[8px] text-slate-500 font-medium mt-1 uppercase tracking-widest">© 2024 DBPC - Towards Excellence</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
