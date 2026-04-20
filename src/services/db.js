import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ========================================
// MISSIONS C.R.U.D
// ========================================

export async function createMission(userId, title, description) {
  if(!db) throw new Error("Database not initialized");
  const docRef = await addDoc(collection(db, 'missions'), {
    userId,
    title,
    description,
    createdAt: serverTimestamp(),
    status: 'active' // active, completed
  });
  return docRef.id;
}

export async function getUserMissions(userId) {
  if(!db) return [];
  const q = query(
    collection(db, 'missions'), 
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Sort on client-side to avoid needing Firestore Composite Indexes
  return data.sort((a, b) => {
    const timeA = a.createdAt?.toMillis?.() || 0;
    const timeB = b.createdAt?.toMillis?.() || 0;
    return timeB - timeA;
  });
}

export async function updateMission(missionId, data) {
  if(!db) return;
  const missionRef = doc(db, 'missions', missionId);
  await updateDoc(missionRef, data);
}

export async function deleteMission(missionId) {
  if(!db) return;
  const missionRef = doc(db, 'missions', missionId);
  await deleteDoc(missionRef);
}

// ========================================
// SESSIONS C.R.U.D
// ========================================

export async function logSession(userId, missionId, durationMinutes, focusScore, notes) {
  if(!db) throw new Error("Database not initialized");
  const docRef = await addDoc(collection(db, 'sessions'), {
    userId,
    missionId,
    durationMinutes,
    focusScore, // 1-10
    notes,
    loggedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getUserSessions(userId) {
  if(!db) return [];
  const q = query(
    collection(db, 'sessions'), 
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Sort on client-side to avoid needing Firestore Composite Indexes
  return data.sort((a, b) => {
    const timeA = a.loggedAt?.toMillis?.() || 0;
    const timeB = b.loggedAt?.toMillis?.() || 0;
    return timeB - timeA;
  });
}
