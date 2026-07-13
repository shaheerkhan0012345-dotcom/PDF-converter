import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, User, X, Sparkles, CheckCircle, AlertCircle, LogIn, UserPlus, Shield } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialSignUp?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialSignUp = false }) => {
  const [isSignUp, setIsSignUp] = useState(initialSignUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSignUp(initialSignUp);
      setError(null);
      setEmail('');
      setPassword('');
      setFullName('');
    }
  }, [isOpen, initialSignUp]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update user display name
        if (fullName.trim()) {
          await updateProfile(userCredential.user, {
            displayName: fullName.trim()
          });
        }
        onSuccess(`Welcome to Naughty PDF, ${fullName || email}!`);
      } else {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onSuccess(`Welcome back, ${userCredential.user.displayName || email}!`);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let errMsg = 'An unexpected error occurred. Please try again.';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Authentication provider is not enabled. Please go to the Firebase Console for "glassy-logic-1qmt3", navigate to Authentication > Sign-in method, and enable "Email/Password" and "Anonymous" providers.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already in use by another account.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Please provide a valid email address.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      onSuccess(`Welcome back, ${userCredential.user.displayName || userCredential.user.email}!`);
      onClose();
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Google Sign-In failed. Please try email/password or Guest mode.';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Google sign-in is not enabled. Please enable Google provider in your Firebase Authentication Console.';
      } else if (err.code === 'auth/popup-blocked') {
        errMsg = 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'The sign-in popup was closed before completion.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      onSuccess('Logged in as Guest. Your conversions are fully secure.');
      onClose();
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Guest login failed. Please register an account.';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Guest / Anonymous sign-in is not enabled. Please go to the Firebase Console for "glassy-logic-1qmt3", navigate to Authentication > Sign-in method, and enable the "Anonymous" provider.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-text/45 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md bg-white border border-brand-border/60 rounded-[32px] shadow-2xl p-8 overflow-hidden z-10"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-2xl -z-10 pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-display font-extrabold text-xl tracking-tight text-brand-text">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-brand-bg hover:bg-brand-border/40 text-brand-gray hover:text-brand-text flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2 text-red-700 text-xs font-semibold leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              {isSignUp && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray/60" />
                    <input 
                      type="text"
                      required
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-brand-border/60 hover:border-brand-primary/40 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 rounded-xl text-sm font-semibold text-brand-text placeholder-brand-gray/50 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray/60" />
                  <input 
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-brand-border/60 hover:border-brand-primary/40 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 rounded-xl text-sm font-semibold text-brand-text placeholder-brand-gray/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray/60" />
                  <input 
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-brand-border/60 hover:border-brand-primary/40 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 rounded-xl text-sm font-semibold text-brand-text placeholder-brand-gray/50 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isSignUp ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-border/40"></div>
              </div>
              <span className="relative px-3 bg-white text-[10px] font-bold text-brand-gray uppercase tracking-wider">or continue with</span>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-brand-bg text-brand-text border border-brand-border/60 hover:border-brand-primary/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mb-3 shadow-sm"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-brand-primary font-black text-[13px]">G</span>
              <span>Continue with Google</span>
            </button>

            {/* Guest Action */}
            <button
              onClick={handleGuestSignIn}
              disabled={loading}
              className="w-full py-3 bg-brand-bg hover:bg-brand-border/40 text-brand-text border border-brand-border/60 hover:border-brand-text/20 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mb-6"
            >
              Secure Guest Mode (Anonymous Sign In)
            </button>

            {/* Footer switcher */}
            <div className="text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-semibold text-brand-gray hover:text-brand-primary transition-colors cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up Free"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
