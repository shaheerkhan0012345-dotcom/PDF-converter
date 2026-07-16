import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, signOut } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import logoUrl from '../assets/images/logo.jpg';
import { 
  LayoutDashboard, Minimize2, RefreshCw, Shield, Sparkles, 
  HelpCircle, Search, Bell, Settings, LogOut, ChevronDown, 
  FileText, FileDown, Table, FileSpreadsheet, Presentation, 
  ImageIcon, Code, Globe, ScanLine, CheckSquare, 
  FileEdit, RotateCw, Scissors, Stamp, Layers, Signature, 
  Combine, Wrench, Lock, Unlock, Copy, ArrowRight, ArrowLeft, X, Check
} from 'lucide-react';
import InteractiveWorkspace from './InteractiveWorkspace';
import { SettingsView } from './SettingsView';
import { PDF_TOOLS } from '../data';

// Format bytes helper
const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getIconComponent = (iconName: string, className: string = 'w-5 h-5') => {
  const icons: Record<string, any> = {
    FileText, FileDown, Table, FileSpreadsheet, Presentation, 
    ImageIcon, Code, Globe, ScanLine, CheckSquare, 
    FileEdit, RotateCw, Scissors, Stamp, Layers, Signature, 
    Combine, Wrench, Lock, Unlock, Copy, Sparkles, Shield
  };
  const IconComp = icons[iconName] || FileText;
  return <IconComp className={className} />;
};

interface LuminaDashboardProps {
  user: User;
  onToast: (msg: string) => void;
}

export const LuminaDashboard: React.FC<LuminaDashboardProps> = ({ user, onToast }) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'workspace' | 'settings'>('dashboard');
  const [activeToolId, setActiveToolId] = useState<string>('pdf-to-word');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Firestore user data state
  const [userData, setUserData] = useState<{ 
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
  }>({
    isPremium: false,
    storageUsedBytes: 0,
    displayName: '',
    jobTitle: 'Product Owner',
    avatarColor: 'indigo',
    preferences: {
      theme: 'light',
      language: 'English (US)',
      notifications: true,
    }
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Sync profile data from Firestore
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserData({
          isPremium: !!data.isPremium,
          storageUsedBytes: typeof data.storageUsedBytes === 'number' ? data.storageUsedBytes : 0,
          displayName: data.displayName || '',
          jobTitle: data.jobTitle || 'Product Owner',
          avatarColor: data.avatarColor || 'indigo',
          preferences: data.preferences || {
            theme: 'light',
            language: 'English (US)',
            notifications: true,
          }
        });
      } else {
        const initialData = {
          isPremium: false,
          storageUsedBytes: 0,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Shaheer',
          jobTitle: 'Product Owner',
          avatarColor: 'indigo',
          preferences: {
            theme: 'light',
            language: 'English (US)',
            notifications: true,
          },
          createdAt: new Date()
        };
        try {
          await setDoc(userDocRef, initialData);
          setUserData({ 
            isPremium: false, 
            storageUsedBytes: 0,
            displayName: initialData.displayName,
            jobTitle: initialData.jobTitle,
            avatarColor: initialData.avatarColor,
            preferences: initialData.preferences
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });
    return () => unsubscribe();
  }, [user]);

  // Filter tools based on query and category
  const filteredTools = useMemo(() => {
    return PDF_TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleToolSelect = (toolId: string, toolName: string) => {
    setActiveToolId(toolId);
    setViewMode('workspace');
    onToast(`Opened ${toolName}`);
  };

  const handleSidebarNav = (category: string) => {
    setMobileSidebarOpen(false);
    if (category === 'dashboard') {
      setViewMode('dashboard');
      setSelectedCategory('all');
    } else if (category === 'compress') {
      setActiveToolId('compress-pdf');
      setViewMode('workspace');
    } else if (category === 'convert') {
      setViewMode('dashboard');
      setSelectedCategory('convert');
    } else if (category === 'security') {
      setViewMode('dashboard');
      setSelectedCategory('security');
    } else if (category === 'ai') {
      setActiveToolId('ocr-scanner'); // Or direct to AI helper
      setViewMode('workspace');
      onToast('Opened AI PDF Assistant Workspace');
    } else if (category === 'settings') {
      setViewMode('settings');
      onToast('Opening Workspace Settings');
    }
  };

  // Determine user name
  const displayName = userData.displayName || (user.isAnonymous 
    ? 'Shaheer' // Use personalized fallback as requested in spec
    : (user.displayName || user.email?.split('@')[0] || 'Shaheer'));

  // Define Quota based on isPremium
  const cloudQuotaBytes = userData.isPremium 
    ? 100 * 1024 * 1024 * 1024  // 100 GB
    : 2 * 1024 * 1024 * 1024;    // 2 GB

  const storagePercent = Math.min(
    100, 
    Math.round((userData.storageUsedBytes / cloudQuotaBytes) * 100) || 0
  );

  const formattedStorage = formatBytes(userData.storageUsedBytes);
  const formattedQuota = userData.isPremium ? '100 GB' : '2 GB';

  return (
    <div className="bg-background text-on-background min-h-screen font-sans flex flex-col antialiased">
      {/* Top Glass Header */}
      <header className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-brand-border/40 z-50 flex items-center shadow-sm">
        <div className="w-full max-w-[1440px] mx-auto px-6 flex justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 select-none">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 text-brand-text hover:bg-brand-bg rounded-xl transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 bg-white border border-brand-border/40 rounded-xl flex items-center justify-center shadow-md shadow-brand-primary/5 overflow-hidden">
              <img src={logoUrl} alt="DocuFlow Logo" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-brand-primary">
              Naughty PDF
            </span>
            {userData.isPremium ? (
              <span className="text-[10px] font-bold bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full select-none hidden sm:inline-block">
                Premium
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full select-none hidden sm:inline-block">
                  Free Plan
                </span>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="text-[10px] font-extrabold bg-brand-primary text-white hover:bg-brand-primary/90 px-2.5 py-0.5 rounded-full transition-all cursor-pointer hidden sm:inline-block shadow-sm"
                >
                  Upgrade
                </button>
              </div>
            )}
          </div>

          {/* Central Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray w-4.5 h-4.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 30+ PDF tools..."
              className="w-full bg-brand-bg hover:bg-brand-border/20 focus:bg-white border border-brand-border/40 focus:border-brand-primary rounded-full py-2.5 pl-12 pr-4 focus:ring-4 focus:ring-brand-primary/5 text-sm font-semibold text-brand-text placeholder-brand-gray/60 outline-none transition-all"
            />
          </div>

          {/* Trailing Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onToast("No new notifications")}
              className="p-2.5 text-brand-gray hover:text-brand-text hover:bg-brand-bg rounded-xl transition-all relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <button 
              onClick={() => {
                setViewMode('settings');
                onToast("Workspace Settings loaded");
              }}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'settings' 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-brand-gray hover:text-brand-text hover:bg-brand-bg'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="h-6 w-[1px] bg-brand-border/60 mx-1"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-brand-bg transition-all cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-md select-none border ${
                  userData.avatarColor === 'indigo' ? 'bg-indigo-600 text-white border-indigo-500' :
                  userData.avatarColor === 'blue' ? 'bg-blue-600 text-white border-blue-500' :
                  userData.avatarColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-500' :
                  userData.avatarColor === 'violet' ? 'bg-violet-600 text-white border-violet-500' :
                  userData.avatarColor === 'orange' ? 'bg-orange-600 text-white border-orange-500' :
                  userData.avatarColor === 'rose' ? 'bg-rose-600 text-white border-rose-500' :
                  'bg-indigo-600 text-white border-indigo-500'
                }`}>
                  {displayName.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-brand-gray" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-brand-border/60 rounded-2xl shadow-xl p-4 z-40"
                    >
                      <div className="mb-3 pb-3 border-b border-brand-border/40">
                        <p className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">Active User</p>
                        <p className="text-xs font-extrabold text-brand-text truncate mt-0.5">{displayName}</p>
                        <p className="text-[10px] text-brand-gray font-semibold truncate mt-0.5">{user.email || 'guest@naughty-pdf.com'}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setViewMode('settings');
                          onToast("Workspace Settings loaded");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-brand-text hover:bg-brand-bg transition-all flex items-center gap-2 mb-1.5 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-brand-gray" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await signOut(auth);
                          onToast("Signed out successfully.");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout wrapper */}
      <div className="flex-1 pt-16 flex relative">
        {/* Desktop Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] hidden lg:flex flex-col bg-white border-r border-brand-border/30 p-6 justify-between z-25">
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => handleSidebarNav('dashboard')}
              className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                viewMode === 'dashboard' && selectedCategory === 'all'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                  : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => handleSidebarNav('compress')}
              className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                viewMode === 'workspace' && activeToolId === 'compress-pdf'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                  : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
              }`}
            >
              <Minimize2 className="w-4.5 h-4.5" />
              <span>Compress PDF</span>
            </button>
            <button 
              onClick={() => handleSidebarNav('convert')}
              className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                viewMode === 'dashboard' && selectedCategory === 'convert'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                  : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
              }`}
            >
              <RefreshCw className="w-4.5 h-4.5" />
              <span>Convert Documents</span>
            </button>
            <button 
              onClick={() => handleSidebarNav('security')}
              className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                viewMode === 'dashboard' && selectedCategory === 'security'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                  : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
              }`}
            >
              <Shield className="w-4.5 h-4.5" />
              <span>Security Suite</span>
            </button>
            <button 
              onClick={() => handleSidebarNav('ai')}
              className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                viewMode === 'workspace' && activeToolId === 'ocr-scanner'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                  : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>AI Suite</span>
            </button>
            <button 
              onClick={() => handleSidebarNav('settings')}
              className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                viewMode === 'settings'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                  : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Storage Meter & Support */}
          <div className="flex flex-col gap-4 pt-6 border-t border-brand-border/40">
            <button 
              onClick={() => onToast("Opening support channel...")}
              className="flex items-center gap-3.5 text-brand-gray hover:text-brand-primary px-4 py-2 text-sm font-semibold transition-all w-full text-left cursor-pointer"
            >
              <HelpCircle className="w-4.5 h-4.5" />
              <span>Help Support</span>
            </button>
            
            <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/40">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">Cloud Storage</span>
                <span className="text-[10px] font-extrabold text-brand-primary">{storagePercent}% Used</span>
              </div>
              <div className="w-full h-2 bg-brand-border/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-primary rounded-full transition-all duration-500" 
                  style={{ width: `${storagePercent}%` }}
                ></div>
              </div>
              <p className="text-[10px] mt-2 font-semibold text-brand-gray leading-none">
                {formattedStorage} of {formattedQuota} cloud allocation
              </p>
              {!userData.isPremium && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full mt-3 py-1.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center block shadow-sm shadow-brand-primary/10"
                >
                  Expand Storage to 100GB
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Slide-out Sidebar Drawer */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-brand-text/30 backdrop-blur-sm z-40 lg:hidden" 
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-brand-border/30 p-6 flex flex-col justify-between z-50 lg:hidden shadow-2xl"
              >
                <div className="flex flex-col gap-6">
                  {/* Brand inside Mobile Drawer */}
                  <div className="flex items-center gap-3 pb-4 border-b border-brand-border/40">
                    <div className="w-9 h-9 bg-white border border-brand-border/40 rounded-xl flex items-center justify-center overflow-hidden">
                      <img src={logoUrl} alt="DocuFlow Logo" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <span className="font-display font-black text-xl tracking-tight text-brand-primary">
                      Naughty PDF
                    </span>
                  </div>

                  <nav className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleSidebarNav('dashboard')}
                      className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                        viewMode === 'dashboard' && selectedCategory === 'all'
                          ? 'bg-brand-primary text-white shadow-lg' 
                          : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
                      }`}
                    >
                      <LayoutDashboard className="w-4.5 h-4.5" />
                      <span>Dashboard</span>
                    </button>
                    <button 
                      onClick={() => handleSidebarNav('compress')}
                      className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                        viewMode === 'workspace' && activeToolId === 'compress-pdf'
                          ? 'bg-brand-primary text-white shadow-lg' 
                          : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
                      }`}
                    >
                      <Minimize2 className="w-4.5 h-4.5" />
                      <span>Compress PDF</span>
                    </button>
                    <button 
                      onClick={() => handleSidebarNav('convert')}
                      className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                        viewMode === 'dashboard' && selectedCategory === 'convert'
                          ? 'bg-brand-primary text-white shadow-lg' 
                          : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
                      }`}
                    >
                      <RefreshCw className="w-4.5 h-4.5" />
                      <span>Convert Documents</span>
                    </button>
                    <button 
                      onClick={() => handleSidebarNav('security')}
                      className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                        viewMode === 'dashboard' && selectedCategory === 'security'
                          ? 'bg-brand-primary text-white shadow-lg' 
                          : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
                      }`}
                    >
                      <Shield className="w-4.5 h-4.5" />
                      <span>Security Suite</span>
                    </button>
                    <button 
                      onClick={() => handleSidebarNav('ai')}
                      className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                        viewMode === 'workspace' && activeToolId === 'ocr-scanner'
                          ? 'bg-brand-primary text-white shadow-lg' 
                          : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
                      }`}
                    >
                      <Sparkles className="w-4.5 h-4.5" />
                      <span>AI Suite</span>
                    </button>
                    <button 
                      onClick={() => handleSidebarNav('settings')}
                      className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm ${
                        viewMode === 'settings'
                          ? 'bg-brand-primary text-white shadow-lg' 
                          : 'text-brand-text/80 hover:bg-brand-bg hover:text-brand-primary'
                      }`}
                    >
                      <Settings className="w-4.5 h-4.5" />
                      <span>Settings</span>
                    </button>
                  </nav>
                </div>

                {/* Storage Meter */}
                <div className="flex flex-col gap-4 pt-6 border-t border-brand-border/40">
                  <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/40">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">Cloud Storage</span>
                      <span className="text-[10px] font-extrabold text-brand-primary">{storagePercent}% Used</span>
                    </div>
                    <div className="w-full h-2 bg-brand-border/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary rounded-full transition-all duration-500" 
                        style={{ width: `${storagePercent}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] mt-2 font-semibold text-brand-gray leading-none">
                      {formattedStorage} of {formattedQuota} cloud allocation
                    </p>
                    {!userData.isPremium && (
                      <button
                        onClick={() => {
                          setMobileSidebarOpen(false);
                          setShowUpgradeModal(true);
                        }}
                        className="w-full mt-3 py-1.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center block shadow-sm"
                      >
                        Expand Storage to 100GB
                      </button>
                    )}
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Pane */}
        <main className="flex-1 lg:ml-[280px] px-6 py-10 max-w-[1160px] mx-auto w-full">
          {viewMode === 'dashboard' ? (
            /* Dashboard View containing dynamic filters and tools grid */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Welcome Section */}
              <section className="mb-10">
                <h1 className="font-display font-black text-brand-text text-3xl sm:text-4xl tracking-tight leading-none">
                  Welcome back, {displayName} 👋
                </h1>
                <p className="text-brand-gray text-sm sm:text-base mt-2 font-semibold">
                  Choose a PDF tool to get started securely.
                </p>
              </section>

              {/* Sticky category filters */}
              <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md py-4 mb-8 border-b border-brand-border/30 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {[
                  { id: 'all', label: 'All Tools' },
                  { id: 'convert', label: 'Convert' },
                  { id: 'edit', label: 'Edit' },
                  { id: 'organize', label: 'Organize' },
                  { id: 'security', label: 'Security' },
                  { id: 'ocr', label: 'OCR' },
                  { id: 'ai', label: 'AI Suite' }
                ].map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedCategory(chip.id)}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === chip.id
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15 scale-102'
                        : 'bg-white border border-brand-border/40 hover:border-brand-primary/40 text-brand-text/90 hover:bg-brand-bg'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.01 }}
                      onClick={() => handleToolSelect(tool.id, tool.name)}
                      className="group bg-white border border-brand-border/40 hover:border-brand-primary/30 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/[0.02] hover:-translate-y-1 cursor-pointer select-none"
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${tool.color}`}>
                          {getIconComponent(tool.icon, 'w-5.5 h-5.5 stroke-[2px]')}
                        </div>
                        <span className="w-8 h-8 rounded-full bg-brand-bg hover:bg-brand-primary/10 text-brand-gray group-hover:text-brand-primary flex items-center justify-center transition-all group-hover:translate-x-1">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-brand-text text-base group-hover:text-brand-primary transition-colors mb-1.5">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-brand-gray leading-relaxed font-medium line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                    <Search className="w-12 h-12 text-brand-gray mb-4 stroke-[1.5px]" />
                    <h3 className="font-display font-extrabold text-brand-text text-lg">No tools found</h3>
                    <p className="text-xs text-brand-gray mt-1 max-w-sm">
                      We couldn't find any tools matching "{searchQuery}". Try editing your query or clearing filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : viewMode === 'settings' ? (
            /* Workspace Settings View */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Back breadcrumb bar */}
              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-brand-bg text-brand-text border border-brand-border/50 hover:border-brand-primary/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
                <div className="h-4 w-[1.5px] bg-brand-border/60"></div>
                <div className="text-xs font-bold text-brand-gray select-none flex items-center gap-2">
                  <span>Workspace</span>
                  <ArrowRight className="w-3 h-3 text-brand-border" />
                  <span className="text-brand-text">Settings</span>
                </div>
              </div>

              <SettingsView 
                user={user} 
                userData={userData} 
                onToast={onToast} 
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />
            </div>
          ) : (
            /* Active Interactive Workspace view with breadcrumbs */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Back breadcrumb bar */}
              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-brand-bg text-brand-text border border-brand-border/50 hover:border-brand-primary/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
                <div className="h-4 w-[1.5px] bg-brand-border/60"></div>
                <div className="text-xs font-bold text-brand-gray select-none flex items-center gap-2">
                  <span>Workspace</span>
                  <ArrowRight className="w-3 h-3 text-brand-border" />
                  <span className="text-brand-text">Active Tool</span>
                </div>
              </div>

              {/* Render fully-functional workspace */}
              <InteractiveWorkspace 
                activeToolId={activeToolId} 
                onToolChange={(id) => setActiveToolId(id)} 
                user={user}
              />
            </div>
          )}
        </main>
      </div>

      {/* Upgrade Premium Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-brand-text/50 backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 border border-brand-border/40 shadow-2xl z-10 flex flex-col gap-6"
            >
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-5 right-5 p-2 text-brand-gray hover:text-brand-text hover:bg-brand-bg rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center shadow-inner text-brand-primary">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-display font-black text-brand-text text-2xl tracking-tight">
                    Upgrade to Premium
                  </h2>
                  <p className="text-brand-gray text-xs sm:text-sm mt-1 font-semibold leading-relaxed">
                    Get unlimited document processing, advanced AI assistance, and 100 GB of secure cloud storage.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 py-2">
                {[
                  "100 GB Secure Cloud Storage (Up from 2GB)",
                  "Unlock Advanced OCR Scanning & AI PDF Assistant",
                  "Process multiple and unlimited files simultaneously",
                  "AES-256 military-grade secure password protections",
                  "High-priority C++ fast-processing server queues"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                    </div>
                    <span className="text-xs font-semibold text-brand-text/90 leading-tight">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={async () => {
                    try {
                      const userDocRef = doc(db, 'users', user.uid);
                      await updateDoc(userDocRef, { isPremium: true });
                      onToast("Successfully upgraded to Naughty PDF Premium!");
                      setShowUpgradeModal(false);
                    } catch (err) {
                      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
                    }
                  }}
                  className="w-full py-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-brand-primary/10 cursor-pointer text-center block"
                >
                  Activate Premium (Demo)
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-3.5 border border-brand-border hover:border-brand-primary text-brand-text hover:bg-brand-bg font-bold text-xs rounded-xl transition-all cursor-pointer text-center block"
                >
                  No thanks, keep current limit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
