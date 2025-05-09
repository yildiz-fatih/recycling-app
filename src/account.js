import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc, setDoc, getDoc, onSnapshot, increment, updateDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

// ---------- helpers ----------
const $ = id => document.getElementById(id);
const show = el => el.classList.remove('hide');
const hide = el => el.classList.add('hide');

const authSection = $('auth-section');
const profileSection = $('profile-section');
const msg = $('auth-msg');

// ---------- sign-up ----------
$('signup-btn').addEventListener('click', async () => {
    msg.textContent = '';
    try {
        const { user } = await createUserWithEmailAndPassword(
            auth, $('email').value, $('password').value
        );
        // create user doc with xp = 0
        await setDoc(doc(db, 'users', user.uid), { xp: 0 });
    } catch (err) {
        msg.textContent = err.message;
    }
});

// ---------- sign-in ----------
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

// ---------- log-out ----------
$('logout-btn').addEventListener('click', () => signOut(auth));

// ---------- auth state listener ----------
onAuthStateChanged(auth, user => {
    if (user) {
        // switch to profile view
        hide(authSection);
        show(profileSection);
        $('user-email').textContent = `Logged in as ${user.email}`;

        // live XP display
        const userRef = doc(db, 'users', user.uid);
        onSnapshot(userRef, snap => {
            const xp = snap.data()?.xp ?? 0;
            $('user-xp').textContent = `XP: ${xp}`;
        });

    } else {
        // switch to auth form
        show(authSection);
        hide(profileSection);
    }
});
