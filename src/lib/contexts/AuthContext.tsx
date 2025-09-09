"use client";

import React, { createContext, useEffect, useState } from "react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { createUserProfile } from "../firebase/firebaseUtils";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: useEffect triggered");
    console.log("AuthContext: auth object:", auth);
    
    // Check if Firebase auth is available
    if (!auth) {
      console.warn("Firebase auth not available. Running in demo mode.");
      setLoading(false);
      return;
    }

    console.log("AuthContext: Setting up auth state listener");
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      console.log("AuthContext: Auth state changed, user:", user);
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log("AuthContext: Cleaning up auth listener");
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      console.warn("Firebase auth not available. Cannot sign in.");
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Create user profile in Firestore if it doesn't exist
      await createUserProfile(result.user, {
        bio: '',
        favoriteSports: [],
        followers: [],
        following: []
      });
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      console.warn("Firebase auth not available. Cannot sign in.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with email", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!auth) {
      console.warn("Firebase auth not available. Cannot sign up.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Create user profile in Firestore
      await createUserProfile(userCredential.user, {
        displayName,
        email,
        bio: '',
        favoriteSports: [],
        followers: [],
        following: []
      });
    } catch (error) {
      console.error("Error signing up with email", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      console.warn("Firebase auth not available. Cannot reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error resetting password", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    if (!auth) {
      console.warn("Firebase auth not available. Cannot sign out.");
      return;
    }

    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut: signOutUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
