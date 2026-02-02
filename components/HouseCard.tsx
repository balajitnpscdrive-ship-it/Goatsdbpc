
import React, { useState } from 'react';
import { House, Category } from '../types';

interface HouseCardProps {
  house: House;
  weeklyScore: number;
  onAction: (points: number, category: string, studentName: string) => void;
  nameSuggestions: string[];
}

const HOUSE_LOGOS: Record<House, string> = {
  [House.BOSCO]: "https://lh3.googleusercontent.com/d/1yrwjFPVXzTpglMlJ6GVxSDujsm2Kq-eN",
  [House.SAVIO]: "https://lh3.googleusercontent.com/d/1WMyIPGuMrRAuRbyzC8-C9sBRXM1W1VXv",
  [House.RUVA]: "https://lh3.googleusercontent.com/d/1T8A8svv8xlKtDo7zkDdKPdNZS6AuPDEZ",
  [House.THOMAS]: "https://lh3.googleusercontent.com/d/1ijMJSyCbppkc2NYSSJshQlhklbW1Gktx",
};

const HouseCard: React.FC<HouseCardProps> = ({ house, weeklyScore, onAction, nameSuggestions }) => {
  const [studentName, setStudentName] = useState('');
  const [category, setCategory] = useState<Category>(Category.ATTENDANCE);
  const [customText, setCustomText] = useState('');

  const categories = Object.values(Category);
  const datalistId = `suggestions-${house}`;

  const handleAction = (points: number) => {
    if (!studentName.trim()) return;
    const finalCategory = category === Category.CUSTOM ? customText || 'Other Activity' : category;
    onAction(points, finalCategory, studentName);
    setStudentName('');
    setCustomText('');
  };

  const getHouseColor = () => {
    switch (house) {
      case House.SAVIO: return 'from-red-600 to-rose-600 shadow-red-900/20';
      case House.BOSCO: return 'from-blue-600 to-cyan-600 shadow-blue-900/20';
      case House.RUVA: return 'from-emerald-600 to-green-600 shadow-emerald-900/20';
      case House.THOMAS: return 'from-amber-400 to-yellow-500 shadow-amber-900/20';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getBorderColor = () => {
    switch (house) {
      case House.SAVIO: return 'border-red-500/30';
      case House.BOSCO: return 'border-blue-500/30';
      case House.RUVA: return 'border-emerald-500/30';
      case House.THOMAS: return 'border-amber-500/30';
      default: return 'border-white/10';
    }
  };

  return (
    <div className={`glass-card p-6 rounded-[2rem] border ${getBorderColor()} relative overflow-hidden group`}>
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${getHouseColor()} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{house} House</h3>
          <p className="text-3xl font-black text-white tracking-tighter">
            {weeklyScore} <span className="text-[10px] font-bold text-slate-500 tracking-normal ml-1">pts</span>
          </p>
        </div>
        <img src={HOUSE_LOGOS[house]} className="w-12 h-12 object-contain" alt={house} />
      </div>

      <div className="space-y-3 relative z-10">
        <input 
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          list={datalistId}
          className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/20 placeholder:text-slate-700"
        />
        
        <datalist id={datalistId}>
          {nameSuggestions.map((name, i) => (
            <option key={i} value={name} />
          ))}
        </datalist>
        
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 focus:outline-none"
        >
          {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
        </select>

        {category === Category.CUSTOM && (
          <input 
            type="text"
            placeholder="Reason..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button 
            disabled={!studentName.trim()}
            onClick={() => handleAction(10)}
            className="bg-green-500/10 hover:bg-green-500/20 disabled:opacity-20 text-green-400 border border-green-500/20 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Add +10
          </button>
          <button 
            disabled={!studentName.trim()}
            onClick={() => handleAction(-5)}
            className="bg-red-500/10 hover:bg-red-500/20 disabled:opacity-20 text-red-400 border border-red-500/20 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Loss -5
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
