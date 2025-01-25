
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAt0Pf3NHgCB4aAdNgRzKhwXOQrMK15_8E",
  authDomain: "rating-movies-b9b41.firebaseapp.com",
  projectId: "rating-movies-b9b41",
  storageBucket: "rating-movies-b9b41.firebasestorage.app",
  messagingSenderId: "778419239065",
  appId: "1:778419239065:web:7e7385fa51fddca1a76008"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);