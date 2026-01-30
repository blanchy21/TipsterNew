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
import { auth } from "@/lib/firebase/firebase";
import { createUserProfile } from "@/lib/firebase/firebaseUtils";

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
  signInWithGoogle: async () => { },
  signInWithEmail: async () => { },
  signUpWithEmail: async () => { },
  resetPassword: async () => { },
  signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      return;
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Create user profile in Firestore if it doesn't exist
    // Fire-and-forget is fine here since createUserProfile checks existence first
    // and the profile data is non-critical for immediate use
    try {
      await createUserProfile(result.user, {
        bio: '',
        favoriteSports: [],
        followers: [],
        following: []
      });
    } catch (profileError) {
      // Profile creation failure shouldn't block sign-in
      console.error('Failed to create user profile:', profileError);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!auth) {
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Create user profile in Firestore
    try {
      await createUserProfile(userCredential.user, {
        displayName,
        email,
        bio: '',
        favoriteSports: [],
        followers: [],
        following: []
      });
    } catch (profileError) {
      // Profile creation failure shouldn't block sign-up - auth already succeeded
      console.error('Failed to create user profile:', profileError);
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      return;
    }

    await sendPasswordResetEmail(auth, email);
  };

  const signOutUser = async () => {
    if (!auth) {
      return;
    }

    await firebaseSignOut(auth);
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
