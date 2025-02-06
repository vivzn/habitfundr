import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: "streaksly.firebaseapp.com",
  projectId: "streaksly",
  storageBucket: "streaksly.appspot.com", // Corrected the storage bucket URL format
  messagingSenderId: process.env.NEXT_PUBLIC_MSI,
  appId: process.env.NEXT_PUBLIC_APPID
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const provider = new GoogleAuthProvider();

export { provider, app };