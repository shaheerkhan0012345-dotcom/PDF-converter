import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, FileDown, ScanLine, Combine, Scissors, FileEdit, 
  Image as ImageIcon, Minimize2, Lock, Unlock, RotateCw, Stamp, 
  Signature, Table, Presentation, FileUp, X, Check, Loader2, 
  Shield, Trash2, Download, Sparkles, Plus, ArrowRight, Eye, 
  EyeOff, Grid, FileSpreadsheet, Copy, FileCheck, Zap, ChevronDown, 
  Star, Award, ShieldCheck, CheckCircle2, XCircle, Globe, Share2, 
  LogOut, Menu, ArrowUpRight, HelpCircle, Info, Users, Monitor, Cloud, DollarSign
} from 'lucide-react';

import { PDF_TOOLS, TRUSTED_COMPANIES, STATISTICS_CARDS, PREMIUM_FEATURES, HOW_IT_WORKS_STEPS, TESTIMONIALS, FAQS, PRICING_PLANS } from './data';
import InteractiveWorkspace from './components/InteractiveWorkspace';
import PricingRoiCalculator from './components/PricingRoiCalculator';
import { AnimatedStatValue } from './components/AnimatedStatValue';
import { AuthModal } from './components/AuthModal';
import { LuminaDashboard } from './components/LuminaDashboard';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function App() {
  const [activeToolId, setActiveToolId] = useState('pdf-to-word');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Auth states
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialSignUp, setAuthModalInitialSignUp] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const openAuthModal = (isSignUp: boolean) => {
    setAuthModalInitialSignUp(isSignUp);
    setAuthModalOpen(true);
  };

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Monitor scrolling to style header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger floating toast messages
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Switch workspace tool and scroll up
  const selectTool = (toolId: string, toolName: string) => {
    setActiveToolId(toolId);
    triggerToast(`Switched workspace active tool to: ${toolName}`);
    
    const element = document.getElementById('interactive-workspace-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getToolIconComponent = (iconName: string, className: string = 'w-6 h-6') => {
    const icons: Record<string, any> = {
      FileText, FileDown, ScanLine, Combine, Scissors, FileEdit, 
      Image: ImageIcon, Minimize2, Lock, Unlock, RotateCw, Stamp, 
      Signature, Table, Presentation, FileUp
    };
    const Comp = icons[iconName] || FileText;
    return <Comp className={className} />;
  };

  const getFeatureIconComponent = (iconName: string, className: string = 'w-6 h-6') => {
    const icons: Record<string, any> = {
      Zap, ShieldCheck, Sparkles, Cloud, Trash2, Monitor
    };
    // Fallback dictionary for features
    const dic: Record<string, any> = {
      'Zap': Zap,
      'ShieldCheck': ShieldCheck,
      'Sparkles': Sparkles,
      'Cloud': Globe,
      'Trash2': Trash2,
      'Monitor': Monitor
    };
    const Comp = dic[iconName] || Sparkles;
    return <Comp className={className} />;
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background text-on-background font-sans antialiased selection:bg-brand-primary selection:text-white relative overflow-x-hidden">
        {/* FLOATING TOAST NOTIFICATION */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 bg-brand-text text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 max-w-sm"
            >
              <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
              <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white shrink-0 ml-1.5">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <LuminaDashboard user={user} onToast={triggerToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased selection:bg-brand-primary selection:text-white relative overflow-x-hidden">
      
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-[800px] mesh-gradient -z-20 opacity-90"></div>
      <div className="absolute top-[2200px] right-0 w-[600px] h-[600px] mesh-gradient -z-20 opacity-30 blur-3xl"></div>
      <div className="absolute bottom-[800px] left-0 w-[700px] h-[700px] mesh-gradient -z-20 opacity-40 blur-3xl"></div>

      {/* FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-brand-text text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 max-w-sm"
          >
            <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
            <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white shrink-0 ml-1.5">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP STICKY HEADER */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-brand-border/40 py-4 shadow-sm' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <FileCheck className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-brand-text">
              DocuFlow<span className="text-brand-primary">.</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#toolkit-section" className="text-sm font-semibold text-brand-text/80 hover:text-brand-primary transition-colors">
              PDF Toolkit
            </a>
            <a href="#features-section" className="text-sm font-semibold text-brand-text/80 hover:text-brand-primary transition-colors">
              Premium Features
            </a>
            <a href="#pricing-section" className="text-sm font-semibold text-brand-text/80 hover:text-brand-primary transition-colors">
              Pricing Calculator
            </a>
            <a href="#faq-section" className="text-sm font-semibold text-brand-text/80 hover:text-brand-primary transition-colors">
              Frequently Asked
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-bg transition-all cursor-pointer select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white font-display font-black text-sm flex items-center justify-center shadow-md">
                    {user.isAnonymous ? 'G' : (user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U')}
                  </div>
                  <span className="text-xs font-bold text-brand-text max-w-[100px] truncate">
                    {user.isAnonymous ? 'Secure Guest' : (user.displayName || user.email?.split('@')[0])}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-gray" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <>
                      {/* Dropdown Clickaway Backdrop */}
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-brand-border/60 rounded-2xl shadow-xl p-4 z-40"
                      >
                        <div className="mb-3 pb-3 border-b border-brand-border/40">
                          <p className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">Account Status</p>
                          <p className="text-xs font-extrabold text-brand-text truncate mt-0.5">
                            {user.isAnonymous ? 'Guest Workspace' : (user.displayName || user.email)}
                          </p>
                          {!user.isAnonymous && <p className="text-[10px] text-brand-gray font-semibold truncate mt-0.5">{user.email}</p>}
                        </div>
                        <button
                          onClick={async () => {
                            setUserDropdownOpen(false);
                            await signOut(auth);
                            triggerToast("Signed out successfully.");
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
            ) : (
              <button 
                onClick={() => openAuthModal(false)} 
                className="text-sm font-bold text-brand-text/80 hover:text-brand-primary transition-colors px-3 py-2 cursor-pointer"
              >
                Sign In
              </button>
            )}
            {user ? (
              <a 
                href="#interactive-workspace-container"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('interactive-workspace-container');
                }}
                className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-brand-primary/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                Go to Workspace
              </a>
            ) : (
              <button 
                onClick={() => openAuthModal(true)}
                className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-brand-primary/10 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Get Started Free
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-brand-text p-1.5 rounded-xl hover:bg-brand-border/40 transition-all">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 w-full bg-white border-b border-brand-border z-35 shadow-xl px-6 py-8 md:hidden flex flex-col gap-5"
          >
            <a 
              href="#toolkit-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-brand-text hover:text-brand-primary transition-colors"
            >
              PDF Toolkit
            </a>
            <a 
              href="#features-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-brand-text hover:text-brand-primary transition-colors"
            >
              Premium Features
            </a>
            <a 
              href="#pricing-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-brand-text hover:text-brand-primary transition-colors"
            >
              Pricing Calculator
            </a>
            <a 
              href="#faq-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-brand-text hover:text-brand-primary transition-colors"
            >
              Frequently Asked
            </a>
            <hr className="border-brand-border/60" />
            <div className="flex gap-4">
              {user ? (
                <div className="flex-1 flex flex-col gap-2">
                  <div className="px-4 py-2 bg-brand-bg border border-brand-border/40 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white font-display font-black text-sm flex items-center justify-center shrink-0">
                      {user.isAnonymous ? 'G' : (user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-brand-text truncate">
                        {user.isAnonymous ? 'Secure Guest' : (user.displayName || user.email?.split('@')[0])}
                      </p>
                      <p className="text-[10px] font-bold text-brand-gray truncate">
                        {user.isAnonymous ? 'Guest Workspace' : user.email}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await signOut(auth);
                      triggerToast("Signed out successfully.");
                    }} 
                    className="w-full border border-red-200 hover:border-red-300 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal(false);
                  }} 
                  className="flex-1 border border-brand-border py-3 rounded-xl text-sm font-bold text-brand-text hover:bg-brand-bg transition-all cursor-pointer"
                >
                  Sign In
                </button>
              )}
              {user ? (
                <a 
                  href="#interactive-workspace-container"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    scrollToSection('interactive-workspace-container');
                  }}
                  className="flex-1 bg-brand-primary text-center text-white py-3 rounded-xl text-sm font-bold shadow-md"
                >
                  Go to Workspace
                </a>
              ) : (
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal(true);
                  }}
                  className="flex-1 bg-brand-primary text-center text-white py-3 rounded-xl text-sm font-bold shadow-md cursor-pointer"
                >
                  Start Converting
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            
            {/* Encryption Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold mb-6 font-mono shadow-sm">
              <Shield className="w-3.5 h-3.5 text-brand-primary" />
              256-Bit Encrypted Secure Processing
            </span>

            {/* Display Headline */}
            <h1 className="font-display font-black text-brand-text text-4xl sm:text-5xl md:text-[64px] leading-[1.15] tracking-tight mb-6">
              Convert, Edit &amp; <br />
              Manage <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">PDFs instantly</span>
            </h1>

            {/* Paragraph Subtitle */}
            <p className="text-brand-gray text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Meet the next-generation PDF workspace. Blazing fast, client-interactive parameters, military security, and complete zero-data retention. Engineered for professionals.
            </p>

            {/* Features list */}
            <div className="flex flex-col gap-3.5 mb-8 text-sm font-semibold text-brand-text/95">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3px]" />
                </div>
                <span>99.9% layout accuracy on Word &amp; Excel sheets</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3px]" />
                </div>
                <span>Advanced AI-powered OCR character indexing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3px]" />
                </div>
                <span>Zero signup required—drop a file and begin immediately</span>
              </div>
            </div>

            {/* Actions CTA */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {user ? (
                <a 
                  href="#interactive-workspace-container"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('interactive-workspace-container');
                  }}
                  className="flex-1 sm:flex-initial text-center bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-base px-8 py-4.5 rounded-[18px] transition-all shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Convert PDFs Free
                </a>
              ) : (
                <button 
                  onClick={() => openAuthModal(true)}
                  className="flex-1 sm:flex-initial text-center bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-base px-8 py-4.5 rounded-[18px] transition-all shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Convert PDFs Free
                </button>
              )}
              <a 
                href="#features-section"
                className="flex-1 sm:flex-initial text-center flex items-center justify-center gap-2 border border-brand-border bg-white/60 hover:bg-white text-brand-text font-bold text-base px-8 py-4.5 rounded-[18px] transition-all hover:shadow-md"
              >
                Learn More
                <ArrowRight className="w-4.5 h-4.5 text-brand-gray" />
              </a>
            </div>
          </div>

          {/* Hero Visual Sandbox Right */}
          <div id="interactive-workspace-container" className="lg:col-span-7 w-full">
            <InteractiveWorkspace 
              activeToolId={activeToolId} 
              onToolChange={(id) => setActiveToolId(id)} 
              user={user}
            />
          </div>

        </div>
      </section>

      {/* TRUSTED COMPANIES SEPARATOR */}
      <section className="py-12 border-y border-brand-border/40 bg-white/20 backdrop-blur-sm overflow-hidden">
        <div className="max-w-[1320px] mx-auto text-center">
          <p className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-8 px-6">
            TRUSTED BY PROFESSIONAL TEAMS AROUND THE GLOBE
          </p>
          
          <div className="relative w-full overflow-hidden px-6">
            {/* Soft gradient edge fade to blend perfectly */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-brand-bg/90 via-brand-bg/50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-brand-bg/90 via-brand-bg/50 to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex animate-marquee whitespace-nowrap gap-16 pause-on-hover py-2 w-max select-none cursor-pointer">
              {/* Set 1 */}
              {TRUSTED_COMPANIES.map((company, idx) => (
                <span key={`comp-1-${idx}`} className="font-display font-extrabold text-base sm:text-lg text-brand-gray/50 hover:text-brand-primary transition-all duration-300 tracking-widest flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-brand-border group-hover:bg-brand-primary transition-all"></span>
                  {company.name.toUpperCase()}
                </span>
              ))}
              {/* Set 2 */}
              {TRUSTED_COMPANIES.map((company, idx) => (
                <span key={`comp-2-${idx}`} className="font-display font-extrabold text-base sm:text-lg text-brand-gray/50 hover:text-brand-primary transition-all duration-300 tracking-widest flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-brand-border group-hover:bg-brand-primary transition-all"></span>
                  {company.name.toUpperCase()}
                </span>
              ))}
              {/* Set 3 */}
              {TRUSTED_COMPANIES.map((company, idx) => (
                <span key={`comp-3-${idx}`} className="font-display font-extrabold text-base sm:text-lg text-brand-gray/50 hover:text-brand-primary transition-all duration-300 tracking-widest flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-brand-border group-hover:bg-brand-primary transition-all"></span>
                  {company.name.toUpperCase()}
                </span>
              ))}
              {/* Set 4 */}
              {TRUSTED_COMPANIES.map((company, idx) => (
                <span key={`comp-4-${idx}`} className="font-display font-extrabold text-base sm:text-lg text-brand-gray/50 hover:text-brand-primary transition-all duration-300 tracking-widest flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-brand-border group-hover:bg-brand-primary transition-all"></span>
                  {company.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CORE STATS STATISTICS CARDS */}
      <section className="py-24 px-6 max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATISTICS_CARDS.map((stat, idx) => {
            // Pick static icon based on label
            const iconMap: Record<string, any> = {
              'FileCheck2': FileCheck,
              'Cpu': ScanLine,
              'Zap': Zap,
              'ShieldAlert': ShieldCheck
            };
            const IconComp = iconMap[stat.icon] || FileCheck;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white border border-brand-border/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white flex items-center justify-center shadow-md`}>
                    <IconComp className="w-5.5 h-5.5 stroke-[2px]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-brand-gray">SECURE STAT</span>
                </div>
                
                <div>
                  <h3 className="font-display font-black text-brand-text text-3xl md:text-4xl leading-none tracking-tight mb-1.5 flex items-center">
                    <AnimatedStatValue value={stat.value} />
                  </h3>
                  <p className="text-xs font-bold text-brand-text/95 uppercase tracking-wide mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PDF TOOLS GRID SECTION */}
      <section id="toolkit-section" className="py-24 px-6 max-w-[1320px] mx-auto scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold font-sans">
            <Grid className="w-3 h-3" /> Core Workspace Tools
          </span>
          <h2 className="font-display font-black text-brand-text text-3xl sm:text-[38px] leading-tight mt-3 mb-4">
            Complete PDF Processing Toolkit
          </h2>
          <p className="text-brand-gray text-base leading-relaxed">
            Everything you need to convert and modify documents in one modern cloud interface. No installations, no hidden page paywalls.
          </p>
        </div>

        {/* 16 Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PDF_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => selectTool(tool.id, tool.name)}
              className={`p-6 rounded-[24px] border transition-all cursor-pointer flex flex-col justify-between select-none relative overflow-hidden group ${
                activeToolId === tool.id 
                  ? 'bg-white border-brand-primary shadow-xl shadow-brand-primary/5 ring-1 ring-brand-primary/40' 
                  : 'bg-white border-brand-border/50 hover:border-brand-primary/40 hover:shadow-lg hover:shadow-brand-primary/[0.02]'
              }`}
            >
              {/* Corner Tag/Badge */}
              {tool.badge && (
                <span className="absolute top-0 right-0 bg-brand-primary text-white text-[9px] font-bold px-2.5 py-0.5 rounded-bl-xl shadow-sm">
                  {tool.badge}
                </span>
              )}

              <div>
                <div className={`w-11 h-11 ${tool.bgClass} ${tool.colorClass} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                  {getToolIconComponent(tool.icon, 'w-5.5 h-5.5')}
                </div>
                <h4 className="font-display font-extrabold text-brand-text text-lg mb-1.5 group-hover:text-brand-primary transition-colors">
                  {tool.name}
                </h4>
                <p className="text-xs text-brand-gray leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-brand-primary mt-auto">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US / PREMIUM FEATURES */}
      <section id="features-section" className="py-24 bg-white/40 border-y border-brand-border/40 backdrop-blur-sm">
        <div className="max-w-[1320px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary/10 text-brand-secondary text-xs font-bold font-sans">
              <Award className="w-3.5 h-3.5" /> Engineered for Excellence
            </span>
            <h2 className="font-display font-black text-brand-text text-3xl sm:text-[38px] leading-tight mt-3 mb-4">
              Premium Performance Metrics
            </h2>
            <p className="text-brand-gray text-base">
              A high-end SaaS alternative for legal teams, engineering clusters, and compliance-first corporations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PREMIUM_FEATURES.map((feat, idx) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-8 rounded-[28px] border border-white/40 flex flex-col items-start gap-5 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center shadow-inner">
                  {getFeatureIconComponent(feat.icon, 'w-5.5 h-5.5')}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-brand-text text-lg mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / TIMELINE */}
      <section className="py-24 px-6 max-w-[1320px] mx-auto relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold font-sans">
            <Info className="w-3.5 h-3.5" /> Workflow Architecture
          </span>
          <h2 className="font-display font-black text-brand-text text-3xl sm:text-[38px] leading-tight mt-3 mb-4">
            Four Steps to Secure Success
          </h2>
          <p className="text-brand-gray text-base">
            How DocuFlow automates conversions while maintaining a strictly airtight secure isolated session.
          </p>
        </motion.div>

        {/* Step Cards with connection line */}
        <div className="relative">
          {/* Horizontal connection line for desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 border-t border-dashed border-brand-border -z-10"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5"
              >
                {/* Step Circle */}
                <div className="w-16 h-16 rounded-full bg-brand-primary text-white font-display font-black text-lg flex items-center justify-center shadow-lg shadow-brand-primary/20 ring-[8px] ring-white">
                  {step.step}
                </div>
                
                <div className="bg-white border border-brand-border/50 p-6 rounded-2xl shadow-sm w-full">
                  <h4 className="font-display font-extrabold text-brand-text text-base mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON METHOD SECTION */}
      <section className="py-24 px-6 bg-brand-text text-white relative rounded-[32px] mx-6 my-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 dark-mesh-gradient opacity-40 -z-10"></div>
        
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-accent text-xs font-bold font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> SECURE AUDIT CHECK
              </span>
              <h2 className="font-display font-black text-3xl sm:text-[38px] leading-tight mt-3 mb-4">
                Stop Wasting Team Time on Clunky PDF Legacy Software
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                Desktop PDF readers are heavily prone to zero-day memory exploits, require massive local installations, and tie teams down to expensive annual user seat fees.
              </p>
            </div>
            
            <div className="lg:col-span-6 flex flex-wrap gap-4 lg:justify-end">
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <Check className="w-4 h-4 text-brand-accent" />
                <span>Web-Based Zero Install</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <Check className="w-4 h-4 text-brand-accent" />
                <span>CCPA &amp; GDPR Data Protection</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Old Method Card */}
            <div className="p-8 rounded-[28px] bg-white/5 border border-white/10 flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
              <div>
                <h4 className="text-red-400 font-display font-black text-lg flex items-center gap-2 mb-6">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  THE CLUNKY LEGACY WAY
                </h4>
                
                <ul className="flex flex-col gap-4 text-xs text-white/70">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <span>Wasted local CPU space running continuous background updates and licensing checks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <span>Unsecure server caches that retain files for days, creating immediate target leaks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <span>Restrictive limitations forcing signups simply to split or extract a page range.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <span>Expensive enterprise site packages costing up to $30 per employee seat monthly.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6 mt-8">
                <p className="text-[10px] uppercase font-mono tracking-wider text-white/40">RESULTING OUTCOME</p>
                <p className="text-sm font-semibold text-white/90 mt-1">High friction overhead and constant security risk exposure.</p>
              </div>
            </div>

            {/* DocuFlow Method Card */}
            <div className="p-8 rounded-[28px] bg-brand-primary border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-accent text-brand-text text-[10px] font-bold px-3.5 py-1 rounded-bl-2xl">
                SECURE &amp; CERTIFIED
              </div>

              <div>
                <h4 className="text-brand-accent font-display font-black text-lg flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0" />
                  THE DOCUFLOW SYSTEM
                </h4>
                
                <ul className="flex flex-col gap-4 text-xs text-white/90">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0"></span>
                    <span>Sub-second multi-threaded processing speeds triggered instantly in-browser.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0"></span>
                    <span>Airtight ephemeral cloud instances purged automatically within 60 minutes.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0"></span>
                    <span>No registration required—enjoy unlimited operations without setting password walls.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0"></span>
                    <span>Simple, fully transparent ROI pricing starting at $12 for unlimited workspaces.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6 mt-8">
                <p className="text-[10px] uppercase font-mono tracking-wider text-white/70">RESULTING OUTCOME</p>
                <p className="text-sm font-bold text-white mt-1">Streamlined layouts, secure records, and instant professional execution.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRICING & ROI CALCULATOR */}
      <section id="pricing-section" className="py-24 px-6 max-w-[1320px] mx-auto scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold font-sans">
            <DollarSign className="w-3.5 h-3.5" /> Pricing Options &amp; ROI
          </span>
          <h2 className="font-display font-black text-brand-text text-3xl sm:text-[38px] leading-tight mt-3 mb-4">
            Transparent Pricing Built for Scale
          </h2>
          <p className="text-brand-gray text-base leading-relaxed">
            Choose a plan that fits your document workflow volumes. Save over 20% on annual billing cycles.
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-brand-text' : 'text-brand-gray'}`}>Monthly Billing</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-brand-primary p-0.5 transition-colors relative flex items-center"
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-brand-text' : 'text-brand-gray'} flex items-center gap-1.5`}>
              Yearly Save 20%
              <span className="text-[10px] font-bold text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full uppercase">HOT</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {PRICING_PLANS.map((plan) => {
            const price = billingCycle === 'yearly' ? Math.round(plan.priceMonthly * 0.8) : plan.priceMonthly;
            return (
              <div
                key={plan.name}
                className={`p-8 rounded-[28px] border transition-all flex flex-col relative ${
                  plan.isPopular 
                    ? 'bg-white border-brand-primary shadow-2xl scale-[1.02] z-10' 
                    : 'bg-white border-brand-border/60 shadow-sm'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute top-5 right-5 bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    MOST POPULAR
                  </span>
                )}

                <div className="mb-8">
                  <h4 className="font-display font-black text-brand-text text-xl mb-1">{plan.name}</h4>
                  <p className="text-xs text-brand-gray min-h-[40px] leading-relaxed">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-display font-black text-brand-text">${price}</span>
                    <span className="text-xs text-brand-gray font-semibold">/ month</span>
                  </div>
                </div>

                <hr className="border-brand-border/50 mb-8" />

                <ul className="flex flex-col gap-4 mb-8 text-xs text-brand-text/90">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-4.5 h-4.5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5px]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={async () => {
                    if (user) {
                      if (plan.priceMonthly > 0) {
                        try {
                          const { doc, updateDoc } = await import('firebase/firestore');
                          const { db } = await import('./firebase');
                          await updateDoc(doc(db, 'users', user.uid), { isPremium: true });
                          triggerToast(`Successfully subscribed to ${plan.name} Premium!`);
                        } catch (err) {
                          console.error(err);
                          triggerToast(`Subscribed to demo ${plan.name}!`);
                        }
                      } else {
                        triggerToast(`Subscribed to demo ${plan.name}!`);
                      }
                    } else {
                      openAuthModal(true);
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-sm mt-auto transition-all cursor-pointer ${
                    plan.isPopular 
                      ? 'bg-brand-primary text-white hover:bg-brand-primary/95 shadow-lg shadow-brand-primary/20' 
                      : 'border border-brand-border hover:border-brand-primary text-brand-text hover:bg-brand-bg'
                  }`}
                >
                  {user ? (plan.priceMonthly === 0 ? 'Convert Now Free' : 'Secure Premium Plan') : 'Sign Up to Start'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Dynamic ROI Savings Calculator Component */}
        <PricingRoiCalculator />
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-white/40 border-y border-brand-border/40 backdrop-blur-sm">
        <div className="max-w-[1320px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold font-sans">
              <Users className="w-3.5 h-3.5" /> Customer Testimonials
            </span>
            <h2 className="font-display font-black text-brand-text text-3xl sm:text-[38px] leading-tight mt-3 mb-4">
              Loved by Fast Teams Everywhere
            </h2>
            <p className="text-brand-gray text-base">
              A portfolio-grade standard of execution that builds immediate trust and efficiency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-card p-8 rounded-[28px] border border-white/40 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
              >
                <div>
                  {/* Star rating */}
                  <div className="flex gap-1.5 text-brand-warning mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-brand-warning stroke-none" />
                    ))}
                  </div>

                  <p className="text-brand-text/90 italic text-sm leading-relaxed mb-8">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 border-t border-brand-border/40 pt-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-primary/20 shadow-sm shrink-0 bg-brand-bg">
                    <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-text text-sm leading-none">{t.name}</h5>
                    <p className="text-[10px] text-brand-gray font-semibold uppercase tracking-wider mt-1.5">
                      {t.role} at <strong className="text-brand-primary">{t.company}</strong>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section id="faq-section" className="py-24 px-6 max-w-[920px] mx-auto scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold font-sans">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked
          </span>
          <h2 className="font-display font-black text-brand-text text-3xl sm:text-[38px] leading-tight mt-3 mb-4">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-brand-gray text-base">
            Understand how DocuFlow delivers premium C++ speed, layout security, and zero footprint.
          </p>
        </div>

        {/* 8 Accordion Questions */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'border-2 border-l-[6px] border-brand-primary shadow-lg shadow-brand-primary/5' 
                    : 'border border-l-[4px] border-brand-border/60 hover:border-brand-primary/40 hover:border-l-brand-primary/40 shadow-sm hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none transition-colors group cursor-pointer"
                >
                  <span className={`font-display font-extrabold text-brand-text text-sm sm:text-base leading-tight pr-4 transition-colors duration-300 ${isOpen ? 'text-brand-primary' : 'group-hover:text-brand-primary/90'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isOpen 
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' 
                      : 'bg-brand-bg text-brand-gray border border-brand-border/40 group-hover:bg-brand-primary group-hover:text-white'
                  }`}>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="border-t border-brand-border/40 bg-brand-bg/10"
                    >
                      <div className="px-6 py-5 text-xs sm:text-sm text-brand-gray leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA CONVERSION BANNER */}
      <section className="mx-6 mb-24 max-w-[1320px] md:mx-auto relative rounded-[32px] overflow-hidden py-24 px-8 text-center bg-brand-text text-white shadow-2xl">
        {/* Dark mesh gradient overlay */}
        <div className="absolute inset-0 dark-mesh-gradient opacity-60 -z-10"></div>
        <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-[1px] -z-10"></div>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-brand-accent text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> START CONVERTING TODAY
          </span>
          
          <h2 className="font-display font-black text-3xl sm:text-[44px] leading-tight text-white tracking-tight">
            Ready to transform your document workflows?
          </h2>
          
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Join thousands of professional CTOs, legal departments, and digital creators who trust DocuFlow with their sensitive PDF requirements. Wiped in 60 minutes.
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full sm:w-auto">
            {user ? (
              <a
                href="#interactive-workspace-container"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('interactive-workspace-container');
                }}
                className="w-full sm:w-auto bg-white hover:bg-brand-bg text-brand-primary font-bold text-base px-10 py-4.5 rounded-[18px] shadow-2xl hover:scale-105 transition-transform"
              >
                Go to Workspace
              </a>
            ) : (
              <button
                onClick={() => openAuthModal(true)}
                className="w-full sm:w-auto bg-white hover:bg-brand-bg text-brand-primary font-bold text-base px-10 py-4.5 rounded-[18px] shadow-2xl hover:scale-105 transition-transform cursor-pointer"
              >
                Get Started Free
              </button>
            )}
            <button
              onClick={() => triggerToast("Contact Sales demo activated. A secure rep will follow up shortly.")}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 font-bold text-base px-10 py-4.5 rounded-[18px] transition-all"
            >
              Contact Sales
            </button>
          </div>

          <div className="flex items-center gap-5 mt-6 text-xs text-white/80 font-semibold bg-white/5 border border-white/10 px-5 py-3 rounded-full shadow-inner">
            <div className="flex -space-x-2.5">
              <div className="w-8 h-8 rounded-full border-2 border-brand-text bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-[10px] font-black">A</div>
              <div className="w-8 h-8 rounded-full border-2 border-brand-text bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-[10px] font-black">B</div>
              <div className="w-8 h-8 rounded-full border-2 border-brand-text bg-gradient-to-tr from-purple-500 to-amber-500 flex items-center justify-center text-[10px] font-black">C</div>
            </div>
            <span>Join 45,000+ happy modern teams</span>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL FOOTER */}
      <footer className="bg-brand-text text-white py-16 border-t border-white/5">
        <div className="max-w-[1320px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-5 flex flex-col items-start gap-4 text-left">
            <a href="#" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity mb-2">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <FileCheck className="w-4.5 h-4.5 stroke-[2.5px]" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                DocuFlow<span className="text-brand-primary">.</span>
              </span>
            </a>
            
            <p className="text-white/50 text-xs leading-relaxed max-w-sm">
              Precision C++ conversion engines, robust client-interactive workspace parameters, and HIPAA/GDPR standard data privacy. Files are destroyed forever in 60 minutes.
            </p>
            
            <p className="text-white/40 text-[10px] font-mono mt-4">
              © 2026 DocuFlow AI Corporation. All rights reserved globally.
            </p>
          </div>

          <div className="md:col-span-2 text-left">
            <h5 className="font-bold text-xs uppercase tracking-widest text-brand-accent mb-6">Product Tools</h5>
            <ul className="flex flex-col gap-3.5 text-xs text-white/60">
              <li><button onClick={() => selectTool('pdf-to-word', 'PDF to Word')} className="hover:text-white transition-colors text-left">PDF to Word</button></li>
              <li><button onClick={() => selectTool('ocr-scanner', 'OCR Scanner')} className="hover:text-white transition-colors text-left">OCR Scanning</button></li>
              <li><button onClick={() => selectTool('compress-pdf', 'Compress PDF')} className="hover:text-white transition-colors text-left">Compress Size</button></li>
              <li><button onClick={() => selectTool('protect-pdf', 'Protect PDF')} className="hover:text-white transition-colors text-left">Password Protect</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 text-left">
            <h5 className="font-bold text-xs uppercase tracking-widest text-brand-accent mb-6">Platform</h5>
            <ul className="flex flex-col gap-3.5 text-xs text-white/60">
              <li><a href="#features-section" className="hover:text-white transition-colors">Performance</a></li>
              <li><a href="#pricing-section" className="hover:text-white transition-colors">ROI Calculator</a></li>
              <li><a href="#faq-section" className="hover:text-white transition-colors">GDPR Privacy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); triggerToast("API docs playground is disabled for preview mode."); }} className="hover:text-white transition-colors">Developer API</a></li>
            </ul>
          </div>

          <div className="md:col-span-3 text-left">
            <h5 className="font-bold text-xs uppercase tracking-widest text-brand-accent mb-6">Newsletter Subscription</h5>
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              Get the latest updates about security patches and new conversion engines.
            </p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast("Demo Newsletter subscribed successfully!");
                (e.target as any).reset();
              }}
              className="flex gap-2"
            >
              <input
                required
                type="email"
                placeholder="Secure email address..."
                className="flex-1 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
              <button 
                type="submit"
                className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all"
              >
                Join
              </button>
            </form>
          </div>

        </div>
      </footer>

      <AuthModal 
        isOpen={authModalOpen} 
        initialSignUp={authModalInitialSignUp}
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={triggerToast} 
      />

    </div>
  );
}
