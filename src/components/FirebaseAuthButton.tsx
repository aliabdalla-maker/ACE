import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, firebaseSignOut, onAuthStateChanged, User, db, doc, setDoc, getDoc } from '../lib/firebase';
import { LogIn, LogOut, User as UserIcon, ShieldCheck, CheckCircle, RefreshCw } from 'lucide-react';

export function FirebaseAuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user profile to Firestore database
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'ACE Trader',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
              utcTimeCredits: 28.5,
              cashBalanceUSD: 2850
            });
          }
        } catch (e) {
          console.error('Firestore user sync error:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      alert('Sign-in error: ' + (error.message || 'Failed to authenticate with Google'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Auth...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 bg-white/20 border border-white/30 rounded-lg px-2.5 py-1 text-white text-xs">
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full border border-yellow-300" />
        ) : (
          <UserIcon className="w-4 h-4 text-yellow-300" />
        )}
        <span className="font-bold truncate max-w-[90px] sm:max-w-[120px]">{user.displayName || user.email?.split('@')[0]}</span>
        <button
          onClick={handleSignOut}
          className="ml-1 p-1 hover:bg-white/30 rounded text-blue-100 hover:text-white transition"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="p-1.5 px-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold text-xs flex items-center gap-1.5 transition shadow-sm"
      title="Sign in with Google Firebase Auth"
    >
      <LogIn className="w-4 h-4" />
      <span>Google Sign In</span>
    </button>
  );
}
