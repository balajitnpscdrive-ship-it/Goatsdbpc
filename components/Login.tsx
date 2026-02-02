
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
    <div className="flex items-center justify-center min-h-screen p-4 py-20 relative bg-slate-950/70">
      {/* Background blobs for depth (not glass) */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 border border-slate-800 bg-slate-900 relative">
        {/* Founder Image Overlay */}
        <div className="flex justify-center -mt-24 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20"></div>
            <img 
              src={FOUNDER_URL} 
              alt="Founder Don Bosco" 
              className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-2xl object-cover relative z-10"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Don+Bosco' }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src={LOGO_URL} 
              alt="College Logo" 
              className="h-24 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white mb-1 uppercase leading-tight">
            Don Bosco Polytechnic College
          </h1>
          <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.25em] mb-4">
            Givers of All Talent Students
          </p>
          <div className="h-0.5 w-16 bg-blue-600 mx-auto mb-4"></div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Department</label>
            <select 
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value as Department);
                setError('');
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer text-sm font-medium appearance-none"
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
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer text-sm font-medium appearance-none"
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
              placeholder="Enter Access Key"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all text-sm`}
              onKeyDown={(e) => e.key === 'Enter' && handleLoginSubmit()}
            />
            {error && <p className="text-red-500 text-[10px] font-bold mt-3 ml-2 uppercase tracking-wider">⚠️ {error}</p>}
          </div>

          <button 
            onClick={handleLoginSubmit}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-lg transform transition active:scale-[0.98] focus:outline-none mt-4 text-[11px] uppercase tracking-[0.2em]"
          >
            Authenticate Access
          </button>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[9px] text-slate-500 font-bold tracking-[0.4em] uppercase">House Point Management System</p>
          <p className="text-[8px] text-slate-600 font-medium mt-1 uppercase tracking-widest">© 2024 DBPC - G.A.T.S</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
