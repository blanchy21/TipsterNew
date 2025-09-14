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
  const [loading, setLoading] = useState(false); // Temporarily set to false for performance testing

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log("AuthContext: Starting auth setup, auth object:", auth);
    }

    // Check if Firebase auth is available
    if (!auth) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log("AuthContext: No auth object available, setting loading to false");
      }
      setLoading(false);
      return;
    }

    // Check if auth object has the required methods
    if (typeof auth.onAuthStateChanged !== 'function') {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("AuthContext: auth.onAuthStateChanged is not a function");
      }
      setLoading(false);
      return;
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log("AuthContext: Setting up auth listener");
      }
      const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log("AuthContext: Auth state changed", user ? "user logged in" : "no user");
        }
        setUser(user);
        setLoading(false);

        // If user is signed in, close any open auth modals
        if (user) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log("AuthContext: User signed in, closing modals");
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log("AuthContext: No user, showing landing page");
          }
        }
      });

      // Check current user immediately in case the listener doesn't fire
      const currentUser = auth.currentUser;

      if (currentUser !== null) {

        setUser(currentUser);
        setLoading(false);
      }

      // Add a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log("AuthContext: Timeout reached, setting loading to false");
        }
        setLoading(false);
      }, 500); // Very short timeout for performance testing

      return () => {

        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("AuthContext: Error setting up auth listener:", error);
      }
      setLoading(false);
    }

    // Additional fallback to ensure loading is always resolved
    const fallbackTimeout = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log("AuthContext: Fallback timeout reached, forcing loading to false");
      }
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {

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
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error signing in with Google", error);
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {

      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error signing in with email", error);
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!auth) {

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
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error signing up with email", error);
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {

      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error resetting password", error);
      }
      throw error;
    }
  };

  const signOutUser = async () => {
    if (!auth) {

      return;
    }

    try {
      await firebaseSignOut(auth);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error signing out", error);
      }
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
