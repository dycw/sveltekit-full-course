import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable } from "svelte/store";

const firebaseConfig = {
  apiKey: "AIzaSyB1Ak-MlO9Kb-eioj7REhTVku29QAFm2VE",
  authDomain: "svelte-course-cf1d1.firebaseapp.com",
  projectId: "svelte-course-cf1d1",
  storageBucket: "svelte-course-cf1d1.appspot.com",
  messagingSenderId: "359357891200",
  appId: "1:359357891200:web:588a53c534719024cddc65",
  measurementId: "G-H1HVNWPGN0",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");

    const { subscribe } = writable<User | null>(null);
    return { subscribe };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return { subscribe };
}

export const user = userStore();
