
import React, { useState, useEffect, useCallback } from 'react';
import { Department, SystemState, House, AcademicYear, PointLog, Category, WeeklyWinner } from './types';
import { loadState, saveState } from './services/storage';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ department: Department; year?: AcademicYear } | null>(null);
  const [state, setState] = useState<SystemState>(loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const checkWeeklyReset = useCallback(() => {
    const now = new Date();
    const lastReset = new Date(state.lastResetTimestamp);
    
    const getTargetWednesday = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = (day <= 3) ? (3 - day) : (10 - day);
      d.setDate(d.getDate() + diff);
      d.setHours(10, 0, 0, 0);
      if (d > date) d.setDate(d.getDate() - 7);
      return d;
    };

    const targetWednesday = getTargetWednesday(now);
    if (lastReset < targetWednesday) {
      handleReset(targetWednesday.getTime());
    }
  }, [state.lastResetTimestamp]);

  useEffect(() => {
    const interval = setInterval(checkWeeklyReset, 60000);
    checkWeeklyReset();
    return () => clearInterval(interval);
  }, [checkWeeklyReset]);

  const handleReset = (timestamp: number) => {
    setState(prev => {
      const sorted = (Object.entries(prev.weeklyPoints) as [string, number][])
        .sort(([, a], [, b]) => b - a)
        .map(([house]) => house as House);

      const winnerData: WeeklyWinner = {
        weekEndDate: new Date(timestamp).toLocaleDateString(),
        winner: sorted[0],
        runner: sorted[1],
        secondRunner: sorted[2],
        scores: { ...prev.weeklyPoints }
      };

      return {
        ...prev,
        weeklyPoints: {
          [House.BOSCO]: 0,
          [House.SAVIO]: 0,
          [House.RUVA]: 0,
          [House.THOMAS]: 0,
        },
        weeklyWinners: [winnerData, ...prev.weeklyWinners],
        lastResetTimestamp: timestamp
      };
    });
    toast.success('Weekly standings archived and reset!');
  };

  const addPoints = (house: House, points: number, category: string, dept: Department, year: AcademicYear, studentName: string) => {
    const trimmedName = studentName.trim();
    if (!trimmedName) return;

    const log: PointLog = {
      id: Math.random().toString(36).substr(2, 9),
      studentName: trimmedName,
      house,
      points,
      category,
      department: dept,
      year,
      timestamp: Date.now(),
      type: points > 0 ? 'addition' : 'subtraction'
    };

    setState(prev => {
      // Ensure the student name is saved to the department's list for future suggestions
      const currentNames = prev.studentNames[dept] || [];
      const updatedNames = currentNames.includes(trimmedName) 
        ? currentNames 
        : [...currentNames, trimmedName];

      return {
        ...prev,
        weeklyPoints: {
          ...prev.weeklyPoints,
          [house]: prev.weeklyPoints[house] + points
        },
        championshipPoints: {
          ...prev.championshipPoints,
          [house]: prev.championshipPoints[house] + points
        },
        history: [log, ...prev.history],
        studentNames: {
          ...prev.studentNames,
          [dept]: updatedNames
        }
      };
    });
    toast.success(`Successfully recorded points for ${trimmedName}!`);
  };

  const updateStudentNames = (dept: Department, names: string[]) => {
    setState(prev => ({
      ...prev,
      studentNames: {
        ...prev.studentNames,
        [dept]: names
      }
    }));
    toast.success(`Updated ${names.length} student names for ${dept}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={(dept, year) => setCurrentUser({ department: dept, year })} />;
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      {currentUser.department === Department.ADMIN ? (
        <AdminDashboard 
          state={state} 
          onLogout={handleLogout} 
          onManualReset={() => handleReset(Date.now())}
          onUpdateStudentNames={updateStudentNames}
        />
      ) : (
        <TeacherDashboard 
          state={state} 
          department={currentUser.department}
          year={currentUser.year || AcademicYear.FIRST}
          onLogout={handleLogout}
          onAddPoints={addPoints}
        />
      )}
    </div>
  );
};

export default App;
