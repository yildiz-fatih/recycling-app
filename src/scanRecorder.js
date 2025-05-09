import { auth, db } from './firebase';
import {
    collection, addDoc, serverTimestamp,
    doc, updateDoc, increment
} from 'firebase/firestore';

/**
 * Call after the user presses “Yes”.
 * @param {string} itemName  e.g. "bottle"
 * @param {boolean} recyclable
 */
export async function recordScan(itemName, recyclable) {
    const user = auth.currentUser;
    if (!user) return;            // ignore anonymous scans

    const xpDelta = recyclable ? 10 : 0;   // tweak value as you like

    // 1) store the scan
    await addDoc(collection(db, 'scans'), {
        userId: user.uid,
        itemName,
        recyclable,
        ts: serverTimestamp()
    });

    // 2) bump XP
    if (xpDelta) {
        await updateDoc(doc(db, 'users', user.uid), {
            xp: increment(xpDelta)
        });
    }
}
