'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  Building2,
  HeartPulse,
  User,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppState, UserRole } from '@/lib/store';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslation } from '@/lib/i18n';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const { login, registerUser } = useAppState();
  const { t } = useTranslation();

  const [role, setRole] = React.useState<UserRole>('patient');
  const [mode, setMode] = React.useState<AuthMode>('login');

  // Form Fields State
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [facility, setFacility] = React.useState('PHC A - Rampur');
  const [customId, setCustomId] = React.useState(''); // Worker ID, ABHA ID, Medical Reg No, Staff ID
  const [specialization, setSpecialization] = React.useState('General Physician');
  const [pin, setPin] = React.useState('');
  const [confirmPin, setConfirmPin] = React.useState('');

  // UI toggle state
  const [showPin, setShowPin] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const resetErrors = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    resetErrors();

    // Set sensible defaults for custom ID hint or auto-generation
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    if (newRole === 'patient') {
      setCustomId(`ABHA-${randomNum}`);
      setName('Rajesh Kumar');
      setMobile('9876543210');
      setPin('123456');
    } else if (newRole === 'health-worker') {
      setCustomId(`HW-${randomNum}`);
      setName('Asha Lakshmi');
      setMobile('9876543211');
      setPin('123456');
    } else if (newRole === 'doctor') {
      setCustomId(`MCI-${randomNum}`);
      setName('Dr. Ramesh Kumar');
      setMobile('9876543212');
      setPin('123456');
    } else if (newRole === 'facility-staff') {
      setCustomId(`STF-${randomNum}`);
      setName('Srinivas Rao');
      setMobile('9876543213');
      setPin('123456');
    } else {
      setCustomId(`ADM-${randomNum}`);
      setName('Priya Sharma');
      setMobile('9876543214');
      setPin('123456');
    }
  };

  React.useEffect(() => {
    handleRoleChange('patient');
  }, []);

  // Demo user defaults for 1-click Quick Login
  const demoUsers: Record<UserRole, { name: string; facility: string; defaultId: string }> = {
    'patient': { name: 'Rajesh Kumar', facility: 'PHC A - Rampur', defaultId: 'ABHA-98765' },
    'health-worker': { name: 'Asha Lakshmi', facility: 'PHC A - Rampur', defaultId: 'HW-98765' },
    'doctor': { name: 'Dr. Ramesh Kumar', facility: 'PHC A - Rampur', defaultId: 'DOC-54321' },
    'facility-staff': { name: 'Srinivas Rao', facility: 'District Hospital - Rampur', defaultId: 'STF-11223' },
    'admin': { name: 'Priya Sharma', facility: 'State Health Department', defaultId: 'ADM-00112' },
  };

  // Quick 1-click Demo Login
  const handleQuickDemoLogin = () => {
    resetErrors();
    const demo = demoUsers[role] || demoUsers['patient'];
    login({
      name: demo.name,
      role: role,
      facility: demo.facility,
      workerId: demo.defaultId,
      mobile: '9876543210',
    });
    router.push('/dashboard');
  };

  // Handle Login Form Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!mobile.trim()) {
      setErrorMsg('Please enter your Mobile Number, ABHA ID, or Worker ID.');
      return;
    }
    if (!pin.trim() || pin.length < 4) {
      setErrorMsg('Please enter a valid Security PIN (4 to 6 digits).');
      return;
    }

    const demo = demoUsers[role] || demoUsers['patient'];
    login({
      name: name.trim() || demo.name,
      role: role,
      facility: facility || demo.facility,
      workerId: customId || demo.defaultId,
      mobile: mobile,
    });

    setSuccessMsg(`Welcome back, ${name.trim() || demo.name}! Redirecting...`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  // Handle Sign Up Form Submit
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!name.trim()) {
      setErrorMsg('Full Name is required for registration.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!facility.trim()) {
      setErrorMsg('Please select or specify your primary Health Center / Facility.');
      return;
    }
    if (!pin || pin.length < 4) {
      setErrorMsg('Security PIN must be at least 4 digits.');
      return;
    }
    if (pin !== confirmPin && confirmPin.length > 0) {
      setErrorMsg('PIN and Confirm PIN do not match.');
      return;
    }

    setSuccessMsg('Account registered successfully! Accessing your care portal...');

    setTimeout(() => {
      registerUser({
        name: name.trim(),
        mobile: mobile.trim(),
        role: role,
        facility: facility.trim(),
        workerId: customId,
        abhaId: role === 'patient' ? customId : undefined,
        medicalRegNo: role === 'doctor' ? customId : undefined,
        specialization: role === 'doctor' ? specialization : undefined,
        pin: pin,
      });
      router.push('/dashboard');
    }, 500);
  };

  const roles = [
    { id: 'patient', label: 'Patient', icon: User, desc: 'Personal Records & Telehealth' },
    { id: 'health-worker', label: 'Health Worker', icon: HeartPulse, desc: 'ASHA / ANM Frontline Care' },
    { id: 'doctor', label: 'Doctor', icon: Stethoscope, desc: 'Consultations & Referrals' },
    { id: 'facility-staff', label: 'Facility Staff', icon: Building2, desc: 'Beds, Labs & Medicines' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 md:p-6">
      <div className="w-full max-w-4xl grid md:grid-cols-5 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Left Branding Panel (2 Columns) */}
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 font-black text-white text-xl shadow-lg shadow-emerald-500/30 ring-2 ring-white/20">
                RC
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block leading-none">
                  RuralCare 360
                </span>
                <span className="text-[10px] text-emerald-200/70 uppercase tracking-widest font-semibold mt-1 block">
                  Siemens / SIH 2026 Platform
                </span>
              </div>
            </div>

            <div className="space-y-4 my-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> Closed-Loop Care Continuum
              </div>
              <h1 className="text-3xl font-extrabold leading-tight text-white">
                Empowering every role in rural healthcare.
              </h1>
              <p className="text-emerald-100/80 text-sm leading-relaxed">
                Connect Patients, Frontline Workers, Doctors, and Hospital Staff with role-based features, offline sync, and instant referral tracking.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-emerald-800/60 text-xs text-emerald-300/70 flex items-center justify-between">
            <span>Multi-Role Access Control</span>
            <span className="font-mono">v1.0.0-SIH</span>
          </div>
        </div>

        {/* Right Form Panel (3 Columns) */}
        <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center bg-white">
          {/* Header & Role Selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {mode === 'login' ? t('auth.login') : 'Create Account'}
              </h2>
              <div className="flex items-center gap-2">
                <LanguageSelector />
              </div>
            </div>
            <p className="text-xs text-gray-500">Choose your member profile to continue</p>
          </div>

          {/* 1. SELECT MEMBER ROLE */}
          <div className="mb-4">
            <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2 block">
              1. Select Member Role
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id as UserRole)}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all duration-150 relative ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                    </div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-gray-900'}`}>
                      {r.label}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. MODE TOGGLE: LOG IN vs SIGN UP */}
          <div className="mb-4 flex p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setMode('login'); resetErrors(); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" /> Log In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setConfirmPin(pin); resetErrors(); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" /> Sign Up
            </button>
          </div>

          {/* Error / Success Alerts */}
          {errorMsg && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* QUICK DEMO LOGIN BOX */}
          <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-gray-800">Quick Test Profile: </span>
              <span className="text-emerald-700 font-bold">{demoUsers[role]?.name}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickDemoLogin}
              className="h-7 text-[11px] border-emerald-300 text-emerald-700 hover:bg-emerald-50 gap-1 font-semibold"
            >
              <Zap className="h-3 w-3 text-amber-500" /> Instant Sign In
            </Button>
          </div>

          {/* DYNAMIC FORM (SIGN UP vs LOG IN) */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="mobile" className="text-xs font-medium text-gray-700">
                  Mobile Number / ID *
                </Label>
                <Input
                  id="mobile"
                  placeholder="e.g. 9876543210 or ID"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="pin" className="text-xs font-medium text-gray-700">
                  Security PIN *
                </Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? 'text' : 'password'}
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="text-xs h-9 font-mono pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md mt-1"
              >
                Sign In as {roles.find((r) => r.id === role)?.label} &rarr;
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-medium text-gray-700">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Lakshmi Devi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-xs h-8.5"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signupMobile" className="text-xs font-medium text-gray-700">Mobile Number *</Label>
                  <Input
                    id="signupMobile"
                    placeholder="10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="text-xs h-8.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="facility" className="text-xs font-medium text-gray-700">Primary Health Center / Facility *</Label>
                  <select
                    id="facility"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full h-8.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="PHC A - Rampur">PHC A - Rampur</option>
                    <option value="PHC B - Chandapur">PHC B - Chandapur</option>
                    <option value="Subcenter Devipur">Subcenter Devipur</option>
                    <option value="District Hospital - Rampur">District Hospital - Rampur</option>
                    <option value="Community Health Center">Community Health Center</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="customId" className="text-xs font-medium text-gray-700">
                    {role === 'patient' ? 'ABHA Health ID' : role === 'health-worker' ? 'Worker ID' : role === 'doctor' ? 'Medical Reg No.' : 'Staff ID'}
                  </Label>
                  <Input
                    id="customId"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    className="text-xs h-8.5 font-mono"
                  />
                </div>
              </div>

              {role === 'doctor' && (
                <div className="space-y-1">
                  <Label htmlFor="specialization" className="text-xs font-medium text-gray-700">Specialization</Label>
                  <select
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full h-8.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="General Physician">General Physician</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1 relative">
                  <Label htmlFor="signupPin" className="text-xs font-medium text-gray-700">Create PIN (6-digits) *</Label>
                  <div className="relative">
                    <Input
                      id="signupPin"
                      type={showPin ? 'text' : 'password'}
                      placeholder="e.g. 123456"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-xs h-8.5 font-mono pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPin" className="text-xs font-medium text-gray-700">Confirm PIN *</Label>
                  <Input
                    id="confirmPin"
                    type="password"
                    placeholder="Re-enter PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-xs h-8.5 font-mono"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md mt-1"
              >
                Register &amp; Access Dashboard &rarr;
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
