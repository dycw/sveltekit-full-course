import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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