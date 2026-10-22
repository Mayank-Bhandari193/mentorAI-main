import React, { useState } from 'react';

export default function AuthPage() {
  // Pehle hamesha Register (Create Account) open hoga
  const [isRegister, setIsRegister] = useState(true);
  
  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetGoal, setTargetGoal] = useState('Full Stack Mastery');

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI state feedback
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const goals = [
    { id: 'dev', label: '🚀 Get First Dev Job' },
    { id: 'faang', label: '💼 Crack Tech Interviews' },
    { id: 'dsa', label: '⚡ Master DSA & Logic' },
    { id: 'ai', label: '🤖 Learn AI/ML Systems' }
  ];

  // 1. Pehle Register handle hoga
  const handleRegister = (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!regName || !regEmail || !regPassword) {
      setFeedback({ type: 'error', text: 'Kripya sabhi zaroori fields bharein!' });
      return;
    }
    if (regPassword !== confirmPassword) {
      setFeedback({ type: 'error', text: 'Passwords match nahi ho rahe hain!' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Registered user ko local database (localStorage) me save karein
      const newUser = {
        name: regName,
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        goal: targetGoal,
        registeredAt: new Date().toISOString()
      };

      // Users array update karein
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const userExists = existingUsers.some(u => u.email === newUser.email);

      if (userExists) {
        setLoading(false);
        setFeedback({ type: 'error', text: 'Yeh email pehle se registered hai! Kripya Sign In karein.' });
        return;
      }

      existingUsers.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));

      setLoading(false);
      // Ab seedhe Sign In par switch karein
      setIsRegister(false);
      setLoginEmail(newUser.email);
      setFeedback({ 
        type: 'success', 
        text: 'Account safalta-purvak ban gaya! Ab sign-in karke dashboard access karein.' 
      });
    }, 700);
  };

  // 2. Register ke baad Sign In handle hoga
  const handleLogin = (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!loginEmail || !loginPassword) {
      setFeedback({ type: 'error', text: 'Email aur password dono daalna zaroori hai.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const foundUser = existingUsers.find(
        u => u.email === loginEmail.trim().toLowerCase() && u.password === loginPassword
      );

      if (!foundUser) {
        setLoading(false);
        setFeedback({ type: 'error', text: 'Galat Email ya Password! Pehle account create karein.' });
        return;
      }

      // Login session store karein
      localStorage.setItem('currentUser', JSON.stringify({
        name: foundUser.name,
        email: foundUser.email,
        goal: foundUser.goal,
        token: 'auth-session-' + Date.now(),
        isLoggedIn: true
      }));

      localStorage.setItem('hasCompletedOnboarding', 'true');
      localStorage.setItem('onboarding_completed', 'true');

      // Dashboard redirect
      window.location.href = '/';
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] p-4 font-sans text-slate-100">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl shadow-indigo-950/40">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 mb-3 text-2xl font-black">
            🧠
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isRegister ? 'Pehle Create Account Karein' : 'Ab Sign In Karein'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister 
              ? 'Step 1: Apna naya mentor profile banayein' 
              : 'Step 2: Apne banaye hue account se dashboard kholein'}
          </p>
        </div>

        {/* Tab Indicator */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6 border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setIsRegister(true); setFeedback({ type: '', text: '' }); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              isRegister 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Create Account
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setFeedback({ type: '', text: '' }); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              !isRegister 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Sign In
          </button>
        </div>

        {/* Status Alerts */}
        {feedback.text && (
          <div className={`mb-5 p-3 rounded-xl border text-xs font-medium text-center ${
            feedback.type === 'error' 
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {feedback.text}
          </div>
        )}

        {/* --- FORM 1: CREATE ACCOUNT (PEHLE YEH AAYEGA) --- */}
        {isRegister ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Aapka Poora Naam"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full rounded-xl bg-slate-800/60 border border-slate-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-800/60 border border-slate-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="Password banayein"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-800/60 border border-slate-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Wahi password dubara likhein"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-800/60 border border-slate-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Engineering Goal
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {goals.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setTargetGoal(g.label)}
                    className={`px-3 py-2 text-xs rounded-xl border text-left font-medium transition ${
                      targetGoal === g.label
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account & Proceed to Sign In →'}
            </button>
          </form>
        ) : (
          /* --- FORM 2: SIGN IN (CREATE ACCOUNT KE BAAD) --- */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Registered Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-800/60 border border-slate-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="Apna password enter karein"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-800/60 border border-slate-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
            </button>
          </form>
        )}

        {/* Bottom Switcher */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegister ? 'Already registered?' : 'Naya account banana hai?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setFeedback({ type: '', text: '' });
            }}
            className="text-indigo-400 font-semibold hover:text-indigo-300 ml-1 underline underline-offset-2"
          >
            {isRegister ? 'Direct Sign In karein' : 'Create Account yahan karein'}
          </button>
        </div>

      </div>
    </div>
  );
}