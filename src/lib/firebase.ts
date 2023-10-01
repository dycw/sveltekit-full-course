import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { Readable } from "svelte/motion";
import { derived, writable } from "svelte/store";

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

// export const userData = writable<any>(null);

// user.subscribe((user) => {
// 	if (user) {
// 		const docRef = doc(db, `users/${user.uid}`);
// 		onSnapshot(docRef, (snapshot) => {
// 			userData.set(snapshot.data());
// 		});
// 	}
// });

export function docStore<T>(path: string) {
  let unsubscribe: () => void;

  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
}

interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  published: boolean;
  links: any[];
}

export const userData: Readable<UserData | null> = derived(
  user,
  ($user, set) => {
    if ($user) {
      return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
      set(null);
    }
  },
);
