import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  User, Mail, Briefcase, Bell, Globe, Palette, Check, 
  Settings, CreditCard, Cloud, Shield, Save, CheckCircle2,
  Moon, Sun, HelpCircle
} from 'lucide-react';

interface SettingsViewProps {
  user: FirebaseUser;
  userData: {
    isPremium: boolean;
    storageUsedBytes: number;
    displayName?: string;
    jobTitle?: string;
    avatarColor?: string;
    preferences?: {
      theme: 'light' | 'dark';
      language: string;
      notifications: boolean;
    };
  };
  onToast: (msg: string) => void;
  onUpgradeClick: () => void;
}

const AVATAR_COLORS = [
  { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-600', text: 'text-indigo-600 font-bold bg-indigo-50 border-indigo-200' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-600', text: 'text-blue-600 font-bold bg-blue-50 border-blue-200' },
  { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-600', text: 'text-emerald-600 font-bold bg-emerald-50 border-emerald-200' },
  { name: 'Violet', value: 'violet', bg: 'bg-violet-600', text: 'text-violet-600 font-bold bg-violet-50 border-violet-200' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-600', text: 'text-orange-600 font-bold bg-orange-50 border-orange-200' },
  { name: 'Rose', value: 'rose', bg: 'bg-rose-600', text: 'text-rose-600 font-bold bg-rose-50 border-rose-200' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  user, 
  userData, 
  onToast, 
  onUpgradeClick 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'billing'>('profile');
  
  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [avatarColor, setAvatarColor] = useState('indigo');
  const [savingProfile, setSavingProfile] = useState(false);

  // Preferences States
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('English (US)');
  const [notifications, setNotifications] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Sync state with incoming props
  useEffect(() => {
    setFullName(userData.displayName || user.displayName || user.email?.split('@')[0] || 'Shaheer');
    setJobTitle(userData.jobTitle || 'Product Owner');
    setAvatarColor(userData.avatarColor || 'indigo');
    
    if (userData.preferences) {
      setTheme(userData.preferences.theme || 'light');
      setLanguage(userData.preferences.language || 'English (US)');
      setNotifications(userData.preferences.notifications !== false);
    }
  }, [userData, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: fullName,
        jobTitle: jobTitle,
        avatarColor: avatarColor
      });
      onToast("Profile saved successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        preferences: {
          theme,
          language,
          notifications
        }
      });
      
      // Apply theme to HTML
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      onToast("Preferences updated successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setSavingPrefs(false);
    }
  };

  // Format bytes helper
  const formatBytes = (bytes: number): string => {
    if (bytes <= 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const cloudQuotaBytes = userData.isPremium 
    ? 100 * 1024 * 1024 * 1024  // 100 GB
    : 2 * 1024 * 1024 * 1024;    // 2 GB

  const storagePercent = Math.min(
    100, 
    Math.round((userData.storageUsedBytes / cloudQuotaBytes) * 100) || 0
  );

  const activeColorObj = AVATAR_COLORS.find(c => c.value === avatarColor) || AVATAR_COLORS[0];

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Settings Title */}
      <div className="mb-8">
        <h1 className="font-display font-black text-brand-text text-3xl sm:text-4xl tracking-tight leading-none">
          Workspace Settings
        </h1>
        <p className="text-brand-gray text-xs sm:text-sm mt-2 font-semibold">
          Manage your document preferences, account security, and subscription billing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Settings Navigation Tabs Sidebar */}
        <div className="md:col-span-3 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10'
                : 'bg-white hover:bg-brand-bg text-brand-gray hover:text-brand-text border border-brand-border/40'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm cursor-pointer shrink-0 ${
              activeTab === 'preferences'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10'
                : 'bg-white hover:bg-brand-bg text-brand-gray hover:text-brand-text border border-brand-border/40'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm cursor-pointer shrink-0 ${
              activeTab === 'billing'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10'
                : 'bg-white hover:bg-brand-bg text-brand-gray hover:text-brand-text border border-brand-border/40'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Billing & Storage</span>
          </button>
        </div>

        {/* Settings Content Box */}
        <div className="md:col-span-9">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/40 shadow-xl shadow-brand-text/5 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
                <h3 className="text-lg font-display font-black text-brand-text">Personal Profile</h3>
                <span className="text-[10px] font-extrabold bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full uppercase">
                  Active Member
                </span>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
                  {/* Dynamic Initials Avatar */}
                  <div className="relative group">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner border border-brand-border/80 uppercase select-none ${activeColorObj.text}`}>
                      {fullName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-md">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Pick Avatar Color */}
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
                      Avatar Theme Accent
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_COLORS.map((col) => (
                        <button
                          key={col.value}
                          type="button"
                          onClick={() => setAvatarColor(col.value)}
                          className={`w-6 h-6 rounded-full ${col.bg} transition-all relative cursor-pointer hover:scale-110 active:scale-95`}
                          title={col.name}
                        >
                          {avatarColor === col.value && (
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                              <Check className="w-3 h-3 stroke-[3px]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-brand-gray font-semibold">
                      Choose your personalized initial fallback theme color.
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Shaheer Khan"
                        className="w-full bg-brand-bg hover:bg-brand-border/10 focus:bg-white border border-brand-border/50 focus:border-brand-primary rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-brand-text outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
                      Job Title
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Product Designer"
                        className="w-full bg-brand-bg hover:bg-brand-border/10 focus:bg-white border border-brand-border/50 focus:border-brand-primary rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-brand-text outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative opacity-80">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray w-4 h-4" />
                      <input
                        type="email"
                        readOnly
                        disabled
                        value={user.email || 'guest@naughty-pdf.com'}
                        className="w-full bg-slate-50 border border-brand-border/60 rounded-xl py-2.5 pl-10 pr-12 text-xs sm:text-sm font-semibold text-brand-gray cursor-not-allowed outline-none"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 select-none">
                        <Check className="w-3 h-3 stroke-[2.5px]" />
                        <span className="text-[9px] font-bold uppercase">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-brand-border/40">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="py-3 px-6 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-brand-primary/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? 'Saving...' : 'Save Profile Details'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/40 shadow-xl shadow-brand-text/5 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
                <h3 className="text-lg font-display font-black text-brand-text">System Preferences</h3>
                <span className="text-[10px] font-bold text-brand-gray">Configure Workspace UX</span>
              </div>

              <div className="flex flex-col gap-6">
                {/* Theme toggler */}
                <div className="flex items-center justify-between py-2 border-b border-brand-border/40">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-xs sm:text-sm font-extrabold text-brand-text">Interface Theme</span>
                    <span className="text-[10px] sm:text-xs text-brand-gray font-semibold leading-tight">
                      Choose between light and dark ambient modes.
                    </span>
                  </div>
                  <div className="flex bg-brand-bg p-1 rounded-xl border border-brand-border/40">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-white text-brand-primary shadow-sm'
                          : 'text-brand-gray hover:text-brand-text'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-white text-brand-primary shadow-sm'
                          : 'text-brand-gray hover:text-brand-text'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Dark</span>
                    </button>
                  </div>
                </div>

                {/* Language Select */}
                <div className="flex items-center justify-between py-2 border-b border-brand-border/40">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-xs sm:text-sm font-extrabold text-brand-text">OCR & System Language</span>
                    <span className="text-[10px] sm:text-xs text-brand-gray font-semibold leading-tight">
                      Default language used for AI processing, summaries, and text scanners.
                    </span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-brand-bg hover:bg-brand-border/10 border border-brand-border/60 rounded-xl px-3 py-2 text-xs font-bold text-brand-text outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all"
                  >
                    <option>English (US)</option>
                    <option>German (DE)</option>
                    <option>French (FR)</option>
                    <option>Spanish (ES)</option>
                    <option>Arabic (AR)</option>
                  </select>
                </div>

                {/* Notifications switch */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-xs sm:text-sm font-extrabold text-brand-text">Smart Web Notifications</span>
                    <span className="text-[10px] sm:text-xs text-brand-gray font-semibold leading-tight">
                      Alert me with toast popups immediately when PDF processing is finished.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-brand-border/40 mt-2">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    disabled={savingPrefs}
                    className="py-3 px-6 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-brand-primary/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{savingPrefs ? 'Updating...' : 'Apply Preferences'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Premium Plan Card */}
              <div className="relative overflow-hidden bg-brand-primary p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-brand-primary/10 border border-brand-primary/20">
                {/* Backdrop ambient blur */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                      <Cloud className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {userData.isPremium ? 'Premium Active' : 'Free Tier'}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-black">Storage Capacity Meter</h3>
                    
                    <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-white h-full transition-all duration-700 rounded-full" 
                        style={{ width: `${storagePercent}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs font-bold text-white/95 mt-1">
                      <span>{formatBytes(userData.storageUsedBytes)} Used</span>
                      <span>{formatBytes(cloudQuotaBytes)} Allocation</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[180px]">
                    {!userData.isPremium ? (
                      <button
                        type="button"
                        onClick={onUpgradeClick}
                        className="w-full bg-white text-brand-primary font-bold py-3 px-5 rounded-xl text-xs sm:text-sm hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer shadow-md"
                      >
                        Upgrade to 100GB
                      </button>
                    ) : (
                      <div className="bg-white/10 border border-white/20 text-center py-3 px-4 rounded-xl font-bold text-xs">
                        🎉 Premium Enabled
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onToast("Retrieving previous invoices...")}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all border border-white/20 text-center cursor-pointer"
                    >
                      View Billing History
                    </button>
                  </div>
                </div>
              </div>

              {/* Information / security banner */}
              <div className="bg-white p-6 rounded-3xl border border-brand-border/40 shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-brand-border/60 flex items-center justify-center text-brand-gray shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-brand-text">Bank-Grade Document Safety</h4>
                  <p className="text-[10px] sm:text-xs text-brand-gray font-semibold mt-1 leading-relaxed">
                    All document conversions are isolated in temporary in-memory sessions, secured using AES-256 state-of-the-art parameters. Files are automatically cleared after inactivity.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
