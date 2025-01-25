import { create } from "zustand";
import { auth } from "./firebase";
import { initializeAuth, onAuthStateChanged,signInWithEmailAndPassword,signOut } from "firebase/auth";

const userSessionStore = create((set) => ({
  user:null,
  loading:true,
  initializeAuth: () => {
    set({loading:true});
    const unsubscribe = onAuthStateChanged(auth,(currentUser) =>{
      set({user:currentUser,loading:false});
    });
    return unsubscribe;
  },
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user });
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  },


}));

export default userSessionStore;