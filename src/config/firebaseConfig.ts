import {FirebaseError, initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// auth
export const auth = getAuth(app);

// Cache offline on IndexedDB
const tabManager = {tabManager: persistentMultipleTabManager()};
const localCache = {localCache: persistentLocalCache(tabManager)};

export const db = initializeFirestore(app, localCache);

// login / logout
export const login = () => signInWithPopup(auth, new GoogleAuthProvider());
export const logout = () => signOut(auth);

export const emailLogin = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email.trim(), password);

export const emailRegister = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email.trim(), password);

export const passwordReset = (email: string) => sendPasswordResetEmail(auth, email.trim());

// messaggi di errore tradotti
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email o password non corretti.',
  'auth/invalid-login-credentials': 'Email o password non corretti.',
  'auth/wrong-password': 'Email o password non corretti.',
  'auth/user-not-found': 'Email o password non corretti.',
  'auth/invalid-email': "L'indirizzo email non è valido.",
  'auth/missing-password': 'Inserisci la password.',
  'auth/email-already-in-use': 'Esiste già un account con questa email.',
  'auth/weak-password': 'La password deve avere almeno 6 caratteri.',
  'auth/too-many-requests': 'Troppi tentativi. Riprova tra qualche minuto.',
  'auth/network-request-failed': 'Connessione assente. Controlla la rete e riprova.',
  'auth/user-disabled': 'Questo account è stato disattivato.',
  'auth/popup-blocked': 'Il browser ha bloccato la finestra di Google. Consenti i popup e riprova.',
  'auth/account-exists-with-different-credential': "Esiste già un account con questa email, ma con un altro metodo di accesso.",
};

const SILENT_AUTH_ERRORS = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

export const getAuthErrorMessage = (error: unknown): string | null => {
  const code = error instanceof FirebaseError ? error.code : (error as {code?: unknown} | null)?.code;

  if (typeof code === 'string') {
    if (SILENT_AUTH_ERRORS.includes(code)) return null;
    return AUTH_ERROR_MESSAGES[code] ?? 'Qualcosa è andato storto. Riprova.';
  }

  return 'Qualcosa è andato storto. Riprova.';
};