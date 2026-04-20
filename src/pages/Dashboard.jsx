import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageShell } from '../components/layout/PageShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getUserSessions, getUserMissions } from '../services/db';
import { Link } from 'react-router-dom';
import { Target, Activity, Clock, Plus } from 'lucide-react';

export function Dashboard() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userSessions, userMissions] = await Promise.all([
          getUserSessions(currentUser.uid),
          getUserMissions(currentUser.uid),
        ]);
        setSessions(userSessions);
        setMissions(userMissions);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser.uid]);

  // Intermediate React concept: useMemo for expensive aggregations
  const stats = useMemo(() => {
    const totalMinutes = sessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    
    const avgFocus = sessions.length > 0 
      ? (sessions.reduce((acc, s) => acc + (Number(s.focusScore) || 0), 0) / sessions.length).toFixed(1)
      : 0;
      
    const activeMissions = missions.filter(m => m.status === 'active').length;

    return { totalHours, avgFocus, activeMissions, totalSessions: sessions.length };
  }, [sessions, missions]);

  if (loading) {
    return (
      <PageShell title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <span className="animate-pulse text-gray-400 font-mono">Loading data...</span>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell 
      title="Dashboard" 
      description={`Welcome back, ${currentUser.displayName || 'Architect'}.`}
      actions={
        <Link to="/sessions">
          <Button><Plus className="w-4 h-4 mr-2" /> Log Session</Button>
        </Link>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-t-4 border-t-black">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Deep Work Time
            </CardDescription>
            <CardTitle className="text-4xl">{stats.totalHours} <span className="text-xl text-gray-500 font-normal">hrs</span></CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> Avg Focus Score
            </CardDescription>
            <CardTitle className="text-4xl">{stats.avgFocus} <span className="text-xl text-gray-500 font-normal">/ 10</span></CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target className="w-4 h-4" /> Active Missions
            </CardDescription>
            <CardTitle className="text-4xl">{stats.activeMissions}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> Total Sessions
            </CardDescription>
            <CardTitle className="text-4xl">{stats.totalSessions}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8 border border-gray-200 rounded-xl p-8 text-center bg-gray-50">
        <h3 className="text-lg font-semibold tracking-tight">System Status</h3>
        <p className="text-gray-500 mt-2 text-sm max-w-lg mx-auto">
          The dashboard is tracking your progress. To maintain peak output, ensure you define a core mission before logging daily deep work sessions.
        </p>
      </div>
    </PageShell>
  );
}
