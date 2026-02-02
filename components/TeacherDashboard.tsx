
import React, { useMemo, useState } from 'react';
import { Department, AcademicYear, SystemState, House } from '../types';
import HouseCard from './HouseCard';

declare const confetti: any;

interface TeacherDashboardProps {
  state: SystemState;
  department: Department;
  year: AcademicYear;
  onLogout: () => void;
  onAddPoints: (house: House, points: number, category: string, dept: Department, year: AcademicYear, studentName: string) => void;
}

const LOGO_URL = "https://lh3.googleusercontent.com/d/18pAKHffTYVmymmTmWgJS0S4sAE5XlMfQ";

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  state, department, year, onLogout, onAddPoints 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sessionPoints = useMemo(() => {
    return state.history
      .filter(log => log.department === department && log.year === year)
      .reduce((acc, log) => acc + log.points, 0);
  }, [state.history, department, year]);

  const uniqueNames = useMemo(() => {
    const names = new Set<string>();
    
    // Add names from the Admin-uploaded list for this department
    const uploadedNames = state.studentNames[department] || [];
    uploadedNames.forEach(name => names.add(name));

    // Add names from existing history in this department
    state.history
      .filter(log => log.department === department)
      .forEach(log => names.add(log.studentName));
      
    return Array.from(names);
  }, [state.history, state.studentNames, department]);

  const filteredActivity = useMemo(() => {
    return state.history
      .filter(log => log.department === department && log.year === year)
      .filter(log => 
        log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 15);
  }, [state.history, department, year, searchTerm]);

  const handleHouseAction = (house: House, points: number, category: string, studentName: string) => {
    onAddPoints(house, points, category, department, year, studentName);
    if (points > 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
          <img src={LOGO_URL} alt="Logo" className="h-16 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-none">Don Bosco Polytechnic</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-blue-400 font-bold text-[9px] uppercase tracking-[0.2em]">Givers of All Talent Students</span>
              <span className="text-slate-600">|</span>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{department} • {year}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="glass px-6 py-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Session Total</span>
            <span className={`text-xl font-black ${sessionPoints >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {sessionPoints > 0 ? '+' : ''}{sessionPoints}
            </span>
          </div>
          <button onClick={onLogout} className="p-4 rounded-2xl glass border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Object.values(House).map(house => (
          <HouseCard 
            key={house} 
            house={house} 
            weeklyScore={state.weeklyPoints[house]} 
            onAction={(pts, cat, name) => handleHouseAction(house, pts, cat, name)} 
            nameSuggestions={uniqueNames}
          />
        ))}
      </div>

      <div className="glass rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Live Logs</span>
          </div>
          <div className="relative w-full md:w-64">
            <input 
              type="text"
              placeholder="Search Student or Reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/40">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">House</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Points</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredActivity.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium italic">No matches found.</td></tr>
              ) : (
                filteredActivity.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-black text-white">{log.studentName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{log.house}</td>
                    <td className={`px-6 py-4 font-black ${log.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {log.points > 0 ? '+' : ''}{log.points}
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-500 font-bold uppercase">{log.category}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
