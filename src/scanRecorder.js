// src/scanRecorder.js ------------------------------------------------------
import { auth, db } from './firebase';
import {
    collection, addDoc, serverTimestamp,
    doc, updateDoc, increment
} from 'firebase/firestore';

/**
 * Record a confirmed scan + bump XP and category counters
 * @param {string}  itemName
 * @param {boolean} recyclable   true  → yellow bin, false → red bin
 */
export async function recordScan(itemName, recyclable) {
    const user = auth.currentUser;
    if (!user) return;                      // ignore anonymous scans

    const xpDelta = recyclable ? 10 : 0;
    const yellowDelta = recyclable ? 1 : 0;
    const redDelta = recyclable ? 0 : 1;

    // 1) store this scan
    await addDoc(collection(db, 'scans'), {
        userId: user.uid,
        itemName,
        recyclable,
        ts: serverTimestamp()
    });

    // 2) bump counters on the user doc
    await updateDoc(doc(db, 'users', user.uid), {
        xp: increment(xpDelta),
        totalScans: increment(1),
        yellowCount: increment(yellowDelta),
        redCount: increment(redDelta)
    });
}
