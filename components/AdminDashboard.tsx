
import React, { useMemo, useState, useRef } from 'react';
import { SystemState, House, Department } from '../types';

interface AdminDashboardProps {
  state: SystemState;
  onLogout: () => void;
  onManualReset: () => void;
  onUpdateStudentNames: (dept: Department, names: string[]) => void;
}

const LOGO_URL = "https://lh3.googleusercontent.com/d/18pAKHffTYVmymmTmWgJS0S4sAE5XlMfQ";
const FOUNDER_URL = "https://lh3.googleusercontent.com/d/18u-Sxsq8BhRkFCxKeNBh4Pi85M1kmFFi";

const HOUSE_LOGOS: Record<House, string> = {
  [House.BOSCO]: "https://lh3.googleusercontent.com/d/1yrwjFPVXzTpglMlJ6GVxSDujsm2Kq-eN",
  [House.SAVIO]: "https://lh3.googleusercontent.com/d/1WMyIPGuMrRAuRbyzC8-C9sBRXM1W1VXv",
  [House.RUVA]: "https://lh3.googleusercontent.com/d/1T8A8svv8xlKtDo7zkDdKPdNZS6AuPDEZ",
  [House.THOMAS]: "https://lh3.googleusercontent.com/d/1ijMJSyCbppkc2NYSSJshQlhklbW1Gktx",
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ state, onLogout, onManualReset, onUpdateStudentNames }) => {
  const [selectedCertificate, setSelectedCertificate] = useState<{name: string, dept: Department, house: House, rank: string} | null>(null);
  const [csvDept, setCsvDept] = useState<Department>(Department.BASIC);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedWeekly = useMemo(() => {
    return (Object.entries(state.weeklyPoints) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .map(([house, score]) => ({ house: house as House, score }));
  }, [state.weeklyPoints]);

  const sortedChampionship = useMemo(() => {
    return (Object.entries(state.championshipPoints) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .map(([house, score]) => ({ house: house as House, score }));
  }, [state.championshipPoints]);

  const topStudentsPerDept = useMemo(() => {
    const departments = Object.values(Department).filter(d => d !== Department.ADMIN);
    const results: Record<string, Array<{student: string, house: House, score: number}>> = {};

    departments.forEach(dept => {
      const deptLogs = state.history.filter(l => l.department === dept);
      const studentAggregates: Record<string, {score: number, house: House}> = {};
      
      deptLogs.forEach(log => {
        if (!studentAggregates[log.studentName]) {
          studentAggregates[log.studentName] = { score: 0, house: log.house };
        }
        studentAggregates[log.studentName].score += log.points;
      });

      const sortedStudents = Object.entries(studentAggregates)
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, 3)
        .map(([name, data]) => ({ student: name, house: data.house, score: data.score }));
      
      if (sortedStudents.length > 0) results[dept] = sortedStudents;
    });

    return results;
  }, [state.history]);

  const overallTopper = useMemo(() => {
    const studentAggregates: Record<string, {score: number, house: House, dept: Department}> = {};
    state.history.forEach(log => {
      if (!studentAggregates[log.studentName]) {
        studentAggregates[log.studentName] = { score: 0, house: log.house, dept: log.department };
      }
      studentAggregates[log.studentName].score += log.points;
    });

    const entries = Object.entries(studentAggregates)
      .sort((a, b) => b[1].score - a[1].score);
    
    return entries.length > 0 ? entries[0] : null;
  }, [state.history]);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      
      const names = text.split(/\r?\n/)
        .map(line => line.split(',')[0].trim())
        .filter(name => name.length > 0 && name.toLowerCase() !== 'name');

      onUpdateStudentNames(csvDept, names);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handlePrint = () => window.print();

  const getHouseColorClass = (house: House) => {
    switch (house) {
      case House.SAVIO: return 'text-red-400';
      case House.BOSCO: return 'text-blue-400';
      case House.RUVA: return 'text-emerald-400';
      case House.THOMAS: return 'text-amber-400';
      default: return 'text-white';
    }
  };

  if (selectedCertificate) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-slate-950 flex flex-col items-center justify-center gap-8 no-print overflow-y-auto">
        <div id="certificate" className="relative w-[1123px] h-[794px] bg-white text-slate-900 p-16 flex flex-col items-center border-[15px] border-double border-indigo-900 shadow-2xl overflow-hidden print:m-0 print:border-[15px] scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 origin-center transition-transform">
          {/* Watermark Logo */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
             <img src={LOGO_URL} className="w-1/2" alt="" />
          </div>
          
          {/* Border Accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-indigo-900"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-indigo-900"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-indigo-900"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-indigo-900"></div>

          <div className="flex justify-between w-full items-center mb-6 relative z-10">
            <img src={LOGO_URL} className="h-32" alt="Logo" />
            <div className="text-center flex-1 mx-4">
              <h1 className="text-4xl font-black uppercase tracking-tight text-indigo-900 leading-tight">Don Bosco Polytechnic College</h1>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-blue-600 mt-2">Givers of All Talent Students | G.A.T.S</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest italic font-bold">Approved by AICTE & Affiliated to DOTE</p>
            </div>
            <img src={FOUNDER_URL} className="h-32 rounded-full border-4 border-slate-100 shadow-lg" alt="Founder" />
          </div>
          
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-900 to-transparent mb-10 opacity-30"></div>
          
          <div className="text-center flex-1 flex flex-col justify-center items-center relative z-10">
            <h2 className="text-6xl font-serif text-indigo-900 mb-4 tracking-wider uppercase font-black italic">Certificate of Merit</h2>
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px w-24 bg-indigo-200"></div>
               <p className="text-xl font-bold text-slate-500 uppercase tracking-[0.3em]">Recognition of Excellence</p>
               <div className="h-px w-24 bg-indigo-200"></div>
            </div>
            
            <p className="text-xl text-slate-600 mb-6 italic font-serif">This prestigious award is proudly presented to</p>
            <p className="text-7xl font-black uppercase text-indigo-950 mb-4 font-serif underline decoration-blue-600/30 underline-offset-8 tracking-tighter">{selectedCertificate.name}</p>
            
            <div className="max-w-3xl text-center space-y-4">
              <p className="text-xl text-slate-600 leading-relaxed">
                A student of <span className="font-black text-indigo-900 uppercase underline decoration-indigo-200">{selectedCertificate.dept}</span> department and a member of the <span className={`font-black uppercase ${getHouseColorClass(selectedCertificate.house).replace('text-', 'text-indigo-')}`}>{selectedCertificate.house} House</span>.
              </p>
              <p className="text-lg text-slate-500 font-medium">
                For securing the <span className="font-black text-blue-600 uppercase italic tracking-widest">"{selectedCertificate.rank}"</span> position in the academic house performance standings, demonstrating exceptional discipline, participation, and contribution to the institution's values.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between w-full mt-12 px-10 relative z-10">
            <div className="text-center">
              <div className="h-px w-56 bg-indigo-900/40 mb-3 mx-auto"></div>
              <p className="text-[10px] font-black uppercase text-indigo-900 tracking-widest">Head of Department</p>
            </div>
            <div className="flex flex-col items-center -mt-4">
               <div className="w-20 h-20 border-4 border-indigo-900/10 rounded-full flex items-center justify-center text-4xl mb-2 grayscale opacity-50">🏆</div>
               <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-center">
              <div className="h-px w-56 bg-indigo-900/40 mb-3 mx-auto"></div>
              <p className="text-[10px] font-black uppercase text-indigo-900 tracking-widest">Principal</p>
            </div>
          </div>
          
          {/* Bottom Accreditation */}
          <div className="absolute bottom-6 w-full text-center">
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.5em]">Don Bosco Polytechnic College - Excellence Through Discipline</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <button onClick={() => setSelectedCertificate(null)} className="px-10 py-4 bg-slate-800 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-700 text-white transition-all shadow-xl">Cancel</button>
          <button onClick={handlePrint} className="px-10 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 text-white transition-all shadow-xl shadow-blue-900/40">Print Certificate</button>
        </div>
        <style>{`@media print { .no-print { display: none !important; } #certificate { scale: 1 !important; margin: 0 !important; border: 15px solid #1e1b4b !important; } body { background: white !important; } }`}</style>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
          <img src={LOGO_URL} alt="Logo" className="h-16 w-auto drop-shadow-lg" />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Don Bosco Polytechnic</h1>
            <p className="text-indigo-400 font-bold text-[9px] uppercase tracking-[0.2em] mt-1">Givers of All Talent Students | Admin Panel</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={() => {if(confirm('Reset weekly scores?')) onManualReset()}} className="flex-1 md:flex-none px-6 py-3 rounded-2xl glass border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all">🔄 Weekly Reset</button>
          <button onClick={onLogout} className="p-4 rounded-2xl glass border border-white/10 hover:bg-white/10 transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      {/* CSV UPLOAD SECTION */}
      <div className="mb-12 glass rounded-[2rem] p-8 border border-white/5 bg-white/5">
        <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Import Name List (CSV)</h2>
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Select Department</label>
            <select 
              value={csvDept}
              onChange={(e) => setCsvDept(e.target.value as Department)}
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            >
              {Object.values(Department).filter(d => d !== Department.ADMIN).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:flex-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Upload File</label>
            <div className="relative group">
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".csv" 
                onChange={handleCsvUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-full bg-slate-900 border border-dashed border-white/10 rounded-xl px-4 py-3 text-sm text-slate-500 flex items-center justify-center gap-2 group-hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span>Select student list CSV</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERALL TOPPER */}
      {overallTopper && (
        <div className="mb-12 relative overflow-hidden glass rounded-[3rem] p-8 border border-indigo-500/30 bg-gradient-to-br from-indigo-600/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-indigo-500/20 rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/30">🏆</div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-indigo-950 font-black px-2 py-1 rounded text-[10px] uppercase shadow-lg">Overall</div>
            </div>
            <div>
              <p className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-1">Overall College Champion Topper</p>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">{overallTopper[0]}</h2>
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 ${getHouseColorClass(overallTopper[1].house)} bg-white/5`}>{overallTopper[1].house} House</span>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-slate-400 bg-white/5">{overallTopper[1].dept}</span>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-900/40">{overallTopper[1].score} TOTAL POINTS</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSelectedCertificate({ 
              name: overallTopper[0], 
              dept: overallTopper[1].dept, 
              house: overallTopper[1].house,
              rank: 'Overall Topper'
            })} 
            className="w-full md:w-auto px-8 py-5 bg-white text-indigo-900 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-indigo-50 transition-all shadow-xl flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Generate Overall Certificate
          </button>
        </div>
      )}

      {/* DEPARTMENT TOPPERS GRID */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-black text-white tracking-tight uppercase">Department Toppers Gallery</h2>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">Merit List</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add comment above fix: Cast Object.entries result to ensure correct type inference for 'students' array */}
          {(Object.entries(topStudentsPerDept) as [string, Array<{student: string, house: House, score: number}>][]).map(([dept, students]) => (
            <div key={dept} className="glass rounded-[2rem] p-6 border border-white/5 flex flex-col bg-white/5 hover:bg-white/[0.07] transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black group-hover:scale-125 transition-transform">🏆</div>
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">{dept}</h3>
              
              <div className="space-y-5">
                {students.map((s, idx) => (
                  <div key={idx} className={`flex items-center justify-between ${idx === 0 ? 'bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-yellow-400 text-indigo-950' : 'bg-white/5 text-slate-500'}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-black uppercase ${idx === 0 ? 'text-white' : 'text-slate-300'}`}>{s.student}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-wider ${getHouseColorClass(s.house)}`}>{s.house} House</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-black ${idx === 0 ? 'text-white' : 'text-slate-400'}`}>{s.score} PTS</span>
                      <button 
                        onClick={() => setSelectedCertificate({ 
                          name: s.student, 
                          dept: dept as Department,
                          house: s.house,
                          rank: idx === 0 ? 'Departmental Topper' : idx === 1 ? 'Departmental Rank 2' : 'Departmental Rank 3'
                        })} 
                        className={`text-[8px] font-black uppercase tracking-widest mt-1 hover:underline ${idx === 0 ? 'text-indigo-400' : 'text-slate-600'}`}
                      >
                        {idx === 0 ? 'Certificate' : 'Get Merit'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAMPIONSHIP LEADERBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="glass rounded-[2rem] p-8 border border-white/5 bg-slate-900/50">
          <h2 className="text-xl font-black text-white mb-8 tracking-tight uppercase border-b border-white/5 pb-4">6-Month Championship Standings</h2>
          <div className="space-y-4">
            {sortedChampionship.map(({ house, score }, idx) => (
              <div key={house} className={`flex items-center gap-5 p-4 rounded-2xl border ${idx === 0 ? 'bg-indigo-600/20 border-indigo-500/50 scale-[1.02]' : 'bg-white/5 border-white/5 opacity-80'}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-slate-400">
                  {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`}
                </div>
                <img src={HOUSE_LOGOS[house]} className="w-12 h-12 object-contain" alt={house} />
                <div className="flex-1">
                  <div className={`font-black text-xl tracking-tight ${getHouseColorClass(house)}`}>{house} House</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {idx === 0 ? 'Championship Leader' : 'Championship Contender'}
                  </div>
                </div>
                <div className="text-3xl font-black text-white tracking-tighter">{score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8 border border-white/5 bg-slate-900/50">
          <h2 className="text-xl font-black text-white mb-8 tracking-tight uppercase border-b border-white/5 pb-4">Active Week Standings</h2>
          <div className="space-y-4">
            {sortedWeekly.map(({ house, score }, idx) => (
              <div key={house} className="flex items-center gap-5 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-slate-950/50 flex items-center justify-center font-black text-slate-500 border border-white/5">#{idx + 1}</div>
                <img src={HOUSE_LOGOS[house]} className="w-10 h-10 object-contain" alt={house} />
                <div className="flex-1">
                  <div className={`font-black text-lg tracking-tight ${getHouseColorClass(house)}`}>{house} House</div>
                  <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${house === House.SAVIO ? 'from-red-600' : house === House.BOSCO ? 'from-blue-600' : house === House.RUVA ? 'from-emerald-600' : 'from-amber-400'} to-transparent`} style={{ width: `${Math.min(100, (score / Math.max(...sortedWeekly.map(s => s.score), 1)) * 100)}%` }}></div>
                  </div>
                </div>
                <div className="text-2xl font-black text-white tracking-tighter">{score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* HISTORY OF WEEKLY WINNERS */}
      <div className="glass rounded-[2rem] p-8 border border-white/5 bg-slate-900/50">
        <h2 className="text-xl font-black text-white mb-8 tracking-tight uppercase border-b border-white/5 pb-4">Archived Week Winners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {state.weeklyWinners.length === 0 ? (
            <div className="col-span-full py-20 text-center">
               <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">History is currently empty</p>
            </div>
          ) : (
            state.weeklyWinners.map((w, idx) => (
              <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">W/E: {w.weekEndDate}</div>
                <div className="flex items-center gap-3 mb-3">
                   <div className="text-xl">🏆</div>
                   <div className="font-black text-sm text-white uppercase">{w.winner}</div>
                </div>
                <div className="h-px w-full bg-white/5 mb-3"></div>
                <div className="flex justify-between text-[10px] font-black text-slate-500">
                   <span>2ND: {w.runner}</span>
                   <span className="text-indigo-400">{w.scores[w.winner]} PTS</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
