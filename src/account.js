// src/account.js -----------------------------------------------------------
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc, setDoc, onSnapshot, updateDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const show = el => el.classList.remove('hide');
const hide = el => el.classList.add('hide');

const authSection = $('auth-section');
const profileSection = $('profile-section');
const msg = $('auth-msg');

/* ---------- sign-up ---------- */
$('signup-btn').addEventListener('click', async () => {
    msg.textContent = '';
    try {
        const { user } = await createUserWithEmailAndPassword(
            auth, $('email').value, $('password').value
        );
        // create user doc with default counters
        await setDoc(doc(db, 'users', user.uid), {
            fullName: '',
            xp: 0,
            totalScans: 0,
            yellowCount: 0,
            redCount: 0
        });
    } catch (err) {
        msg.textContent = err.message;
    }
});

/* ---------- sign-in ---------- */
$('login-btn').addEventListener('click', async () => {
    msg.textContent = '';
    try {
        await signInWithEmailAndPassword(
            auth, $('email').value, $('password').value
        );
    } catch (err) {
        msg.textContent = err.message;
    }
});

/* ---------- log-out ---------- */
$('logout-btn').addEventListener('click', () => signOut(auth));

/* ---------- name editing ---------- */
$('user-fullname').addEventListener('click', () => {
    hide($('user-fullname'));
    show($('name-input'));
    show($('save-name-btn'));
});

$('save-name-btn').addEventListener('click', async () => {
    const name = $('name-input').value.trim();
    if (!name) return;
    try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            fullName: name
        });
    } finally {
        $('name-input').value = '';
    }
});

/* ---------- auth-state listener ---------- */
onAuthStateChanged(auth, user => {
    if (user) {
        hide(authSection);
        show(profileSection);

        const userRef = doc(db, 'users', user.uid);
        onSnapshot(userRef, snap => {
            const d = snap.data() || {};
            $('user-email').textContent = `Logged in as ${user.email}`;
            $('user-fullname').textContent =
                d.fullName ? d.fullName : 'Tap to add your name';
            $('total-scans').textContent = `Items scanned: ${d.totalScans ?? 0}`;
            $('yellow-count').textContent = `Yellow-bin items: ${d.yellowCount ?? 0}`;
            $('red-count').textContent = `Red-bin items: ${d.redCount ?? 0}`;
            $('user-xp').textContent = `XP: ${d.xp ?? 0}`;

            // reset edit UI
            show($('user-fullname'));
            hide($('name-input'));
            hide($('save-name-btn'));
        });

    } else {
        show(authSection);
        hide(profileSection);
    }
});
