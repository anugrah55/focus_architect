import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageShell } from '../components/layout/PageShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getUserSessions, getUserMissions, logSession } from '../services/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Activity } from 'lucide-react';

export function Sessions() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [currentUser.uid]);

  async function fetchData() {
    try {
      const [sData, mData] = await Promise.all([
        getUserSessions(currentUser.uid),
        getUserMissions(currentUser.uid)
      ]);
      setSessions(sData);
      setMissions(mData.filter(m => m.status === 'active'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogSession(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const missionId = formData.get('missionId');
    const durationMinutes = formData.get('durationMinutes');
    const focusScore = formData.get('focusScore');
    const notes = formData.get('notes');
    
    if (!missionId || !durationMinutes || !focusScore) return;
    
    setSubmitting(true);
    try {
      await logSession(
        currentUser.uid, 
        missionId, 
        Number(durationMinutes), 
        Number(focusScore), 
        notes
      );
      formRef.current?.reset();
      await fetchData();
    } catch (err) {
      console.error("Failed to log session", err);
      alert("Error logging session");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell 
      title="Deep Work Sessions" 
      description="Log and analyze your focus blocks."
    >
      <div className="grid gap-8 md:grid-cols-3 items-start">
        <div className="md:col-span-1 sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Log Session</CardTitle>
            </CardHeader>
            <CardContent>
              {missions.length === 0 ? (
                <div className="text-sm border border-red-200 bg-red-50 text-red-600 p-3 rounded-md mb-4">
                  You must create an active mission before you can log a session.
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleLogSession} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Mission</label>
                    <select 
                      name="missionId" 
                      required 
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                    >
                      <option value="" disabled selected>Select mission...</option>
                      {missions.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="durationMinutes" type="number" min="1" max="600" label="Duration (min)" placeholder="120" required />
                    <Input name="focusScore" type="number" min="1" max="10" label="Focus (1-10)" placeholder="8" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Notes (Optional)</label>
                    <textarea 
                      name="notes" 
                      className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                      placeholder="What did you achieve?"
                    />
                  </div>
                  <Button type="submit" className="w-full" isLoading={submitting}>
                    Commit Session
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="animate-pulse bg-gray-100 h-32 rounded-xl w-full"></div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl text-gray-500">
              No sessions logged yet. Enter deep work and log your results.
            </div>
          ) : (
            <AnimatePresence>
              {sessions.map((session) => {
                const mission = missions.find(m => m.id === session.missionId);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                  >
                    <Card className="hover:shadow-md transition-shadow duration-300">
                      <CardHeader className="pb-3 flex flex-row items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center rounded-sm bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              {mission ? mission.title : 'Unknown Mission'}
                            </span>
                          </div>
                          {session.notes && <CardDescription className="mt-2 text-black/80">{session.notes}</CardDescription>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {session.durationMinutes} min
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Activity className="w-4 h-4 text-gray-400" />
                            {session.focusScore}/10 focus
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageShell>
  );
}
