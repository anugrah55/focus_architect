import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageShell } from '../components/layout/PageShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getUserMissions, createMission, deleteMission } from '../services/db';
import { motion, AnimatePresence } from 'framer-motion';

export function Missions() {
  const { currentUser } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    fetchMissions();
  }, [currentUser.uid]);

  async function fetchMissions() {
    try {
      const data = await getUserMissions(currentUser.uid);
      setMissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMission(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    
    if (!title) return;
    
    setSubmitting(true);
    try {
      await createMission(currentUser.uid, title, description);
      formRef.current?.reset();
      await fetchMissions();
  } catch (err) {
      console.error("Failed to create mission", err);
      alert(`Database Error: ${err.message}\n\nMake sure you have clicked "Create Database" under Firestore Database in the Firebase Console, and set the security rules to "Test Mode" or allow reads/writes.`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(missionId) {
    if (!confirm('Are you sure you want to delete this mission?')) return;
    try {
      await deleteMission(missionId);
      setMissions(missions.filter(m => m.id !== missionId));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  }

  return (
    <PageShell 
      title="Missions" 
      description="Define high-level goals. Deep work sessions revolve around these."
    >
      <div className="grid gap-8 md:grid-cols-3 items-start">
        <div className="md:col-span-1 sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">New Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <form ref={formRef} onSubmit={handleAddMission} className="space-y-4">
                <Input name="title" label="Mission Title" placeholder="e.g. Learn System Design" required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                    placeholder="Why does this mission matter?"
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={submitting}>
                  Initialize Mission
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="animate-pulse bg-gray-100 h-32 rounded-xl w-full"></div>
          ) : missions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl text-gray-500">
              No active missions. Initialize one to start tracking deep work.
            </div>
          ) : (
            <AnimatePresence>
              {missions.map((mission) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-3 flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{mission.title}</CardTitle>
                        <CardDescription className="mt-1">{mission.description}</CardDescription>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-black px-2.5 py-0.5 text-xs font-semibold text-white">
                        {mission.status}
                      </span>
                    </CardHeader>
                    <CardFooter className="pt-0 justify-end border-t border-gray-100 mt-4 rounded-b-xl py-3">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(mission.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Abandon Mission
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageShell>
  );
}
