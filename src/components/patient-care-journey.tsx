'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  Stethoscope,
  Activity,
  Building2,
  Video,
  Calendar,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Heart,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/status-badge';
import { useAppState } from '@/lib/store';
import { useToast } from '@/components/toast-provider';
import { facilities, Patient } from '@/lib/demo-data';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function PatientCareJourney() {
  const router = useRouter();
  const { state, addPatient, addReferral, addFollowUp, addAuditEntry } = useAppState();
  const { toast } = useToast();

  const currentUser = state.currentUser;

  // Step state
  const [step, setStep] = useState<Step>(1);

  // Active Patient Details (Matched from store or pre-filled from current user session)
  const activePatient = useMemo(() => {
    const matched = state.patients.find(
      (p) =>
        p.name.toLowerCase() === currentUser.name.toLowerCase() ||
        p.id === currentUser.workerId ||
        p.phone === currentUser.mobile
    );
    if (matched) return matched;

    return {
      id: currentUser.workerId || `P-${Math.floor(1000 + Math.random() * 9000)}`,
      name: currentUser.name || 'Rajesh Kumar',
      age: 36,
      gender: 'male' as const,
      phone: currentUser.mobile || '9876543210',
      village: currentUser.facility || 'PHC A - Rampur',
      assignedWorker: 'Asha Lakshmi',
      riskLevel: 'low' as const,
      careStage: 'registered' as const,
      primaryCondition: 'General Health Screening',
      lastVisit: new Date().toISOString().split('T')[0],
      nextFollowUp: 'In 7 days',
      medicalHistory: ['Hypertension screening'],
      vitals: {
        bp: '120/80',
        spo2: 98,
        pulse: 72,
        temperature: 36.8,
        recordedAt: new Date().toISOString(),
      },
    };
  }, [currentUser, state.patients]);

  // Step 2: Symptom & Disease Entry State
  const [diseaseCategory, setDiseaseCategory] = useState('Fever & Respiratory');
  const [symptomDescription, setSymptomDescription] = useState('');
  const [duration, setDuration] = useState('2-3 days');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe' | 'critical'>('moderate');
  const [bpInput, setBpInput] = useState('125/82');
  const [spo2Input, setSpo2Input] = useState('97');
  const [tempInput, setTempInput] = useState('38.1');

  // Step 4: Facility Selection State
  const [selectedFacility, setSelectedFacility] = useState<typeof facilities[0]>(facilities[0]);

  // Step 5: Booking State
  const [bookingMode, setBookingMode] = useState<'teleconsultation' | 'in-person'>('teleconsultation');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:30 AM');
  const [bookingRefId, setBookingRefId] = useState('');

  // Step 6: Referral State
  const [needsSpecialistReferral, setNeedsSpecialistReferral] = useState(false);
  const [referralSpecialty, setReferralSpecialty] = useState('Cardiology');
  const [generatedReferralId, setGeneratedReferralId] = useState('');

  // Computed Triage Risk Level
  const calculatedRiskLevel = useMemo(() => {
    if (severity === 'critical' || Number(spo2Input) < 92) return 'critical';
    if (severity === 'severe' || Number(tempInput) > 39) return 'high';
    if (severity === 'moderate' || duration === '> 2 weeks') return 'medium';
    return 'low';
  }, [severity, spo2Input, tempInput, duration]);

  // Handle Step 3 -> 4 Advance
  const handleProceedToFacility = () => {
    setStep(4);
  };

  // Handle Step 5 Booking Submit
  const handleConfirmBooking = () => {
    const refId = `BK-${Date.now().toString().slice(-6)}`;
    setBookingRefId(refId);

    if (calculatedRiskLevel === 'high' || calculatedRiskLevel === 'critical') {
      setNeedsSpecialistReferral(true);
    }

    toast(`Consultation booked successfully! Ref: ${refId}`, 'success');
    setStep(6);
  };

  // Handle Step 7 Final Digital Record Update & Save
  const handleCompleteCareJourney = () => {
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    // 1. Save or update Patient Record in state
    const updatedPatient: Patient = {
      ...activePatient,
      riskLevel: calculatedRiskLevel,
      careStage: needsSpecialistReferral ? 'referred' : 'consulted',
      primaryCondition: `${diseaseCategory}: ${symptomDescription.slice(0, 40) || 'Registered Health Condition'}`,
      lastVisit: today,
      nextFollowUp: 'In 7 days',
      vitals: {
        bp: bpInput || '120/80',
        spo2: Number(spo2Input) || 98,
        pulse: 74,
        temperature: Number(tempInput) || 37.0,
        recordedAt: now,
      },
    };
    addPatient(updatedPatient);

    // 2. Dispatch Referral if requested/needed
    if (needsSpecialistReferral) {
      const refId = `REF-${Date.now().toString().slice(-6)}`;
      setGeneratedReferralId(refId);
      addReferral({
        id: refId,
        patientId: activePatient.id,
        patientName: activePatient.name,
        reason: symptomDescription || diseaseCategory,
        specialty: referralSpecialty,
        diagnosticTests: ['CBC', 'ECG'],
        urgency: calculatedRiskLevel === 'critical' ? 'emergency' : 'priority',
        status: 'created',
        sourceFacility: activePatient.village,
        destinationFacility: selectedFacility.name,
        createdAt: now,
        appointmentDate: bookingDate,
        timeline: [
          {
            status: 'created',
            timestamp: now,
            facility: activePatient.village,
            user: activePatient.name,
            notes: 'Self-registered patient care journey referral dispatch.',
          },
        ],
      });
    }

    // 3. Schedule Follow-up task
    addFollowUp({
      id: `FU-${Date.now().toString().slice(-6)}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      condition: diseaseCategory,
      followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignedWorker: 'Asha Lakshmi',
      priority: calculatedRiskLevel === 'critical' ? 'urgent' : 'routine',
      status: 'scheduled',
    });

    // 4. Add Audit Log
    addAuditEntry({
      id: `AUD-${Date.now()}`,
      timestamp: now,
      user: activePatient.name,
      action: 'Completed 7-stage digital care journey',
      entityId: activePatient.id,
      entityType: 'PatientCareJourney',
      status: 'Completed',
    });

    toast('Digital Health Passport updated successfully!', 'success');
    setStep(7);
  };

  const stepsList = [
    { num: 1, title: 'Registration', icon: UserCheck },
    { num: 2, title: 'Symptom Entry', icon: Stethoscope },
    { num: 3, title: 'Triage', icon: Activity },
    { num: 4, title: 'Facility Finder', icon: Building2 },
    { num: 5, title: 'Booking', icon: Video },
    { num: 6, title: 'Referral Check', icon: Send },
    { num: 7, title: 'Digital Record', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Header Banner */}
      <Card className="bg-gradient-to-r from-teal-900 via-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-xl border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Sparkles className="h-3.5 w-3.5" /> End-to-End Patient Care Journey
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Personal Health Assessment &amp; Doctor Consultation
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1">
              Active Patient: <strong className="text-white">{activePatient.name}</strong> (ID: {activePatient.id}) &bull; {activePatient.village}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60 text-xs text-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>ABHA Compliant Digital Health Record</span>
          </div>
        </div>

        {/* Workflow 7-Step Stepper */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mt-6 pt-4 border-t border-emerald-800/60">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                onClick={() => { if (s.num <= step) setStep(s.num as Step); }}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-500 text-white shadow-md ring-2 ring-white/30'
                    : isDone
                    ? 'bg-emerald-800/50 text-emerald-200 hover:bg-emerald-800/80'
                    : 'bg-emerald-950/40 text-emerald-400/50'
                }`}
              >
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-xs font-bold mb-1">
                  {isDone ? '✓' : s.num}
                </div>
                <span className="text-[10px] font-semibold hidden sm:block truncate w-full">{s.title}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* STEP 1: PATIENT REGISTRATION & PROFILE CONFIRMATION */}
      {step === 1 && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" /> 1. Patient Profile &amp; Identity Verification
              </h2>
              <p className="text-xs text-gray-500">Verify your patient details before registering symptoms.</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Verified Profile</Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
            <div>
              <span className="text-gray-500 block">Full Name</span>
              <span className="font-bold text-gray-900 text-sm">{activePatient.name}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Patient ID / ABHA ID</span>
              <span className="font-mono font-bold text-emerald-800 text-sm">{activePatient.id}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Age / Gender</span>
              <span className="font-semibold text-gray-900">{activePatient.age} years / {activePatient.gender}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Mobile Phone</span>
              <span className="font-mono font-semibold text-gray-900">{activePatient.phone}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Assigned PHC Subcenter</span>
              <span className="font-semibold text-gray-900">{activePatient.village}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Assigned ASHA Worker</span>
              <span className="font-semibold text-gray-900">{activePatient.assignedWorker}</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => setStep(2)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 h-10 shadow-sm"
            >
              Confirm Identity &amp; Register Symptoms &rarr;
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: SYMPTOM & DISEASE ENTRY */}
      {step === 2 && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-emerald-600" /> 2. Register Disease &amp; Health Symptoms
              </h2>
              <p className="text-xs text-gray-500">Record your present health condition and severity.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Health Category / Disease *</Label>
              <Select value={diseaseCategory} onValueChange={setDiseaseCategory}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Select health condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fever & Respiratory" className="text-xs">Fever &amp; Respiratory Infection</SelectItem>
                  <SelectItem value="Cardiovascular & BP" className="text-xs">Hypertension &amp; Chest Discomfort</SelectItem>
                  <SelectItem value="Orthopedic & Joint Pain" className="text-xs">Orthopedic &amp; Severe Joint Pain</SelectItem>
                  <SelectItem value="Gastrointestinal" className="text-xs">Abdominal Pain &amp; Digestive Distress</SelectItem>
                  <SelectItem value="Diabetes & Endocrine" className="text-xs">Diabetes &amp; Blood Glucose Issue</SelectItem>
                  <SelectItem value="Skin & Allergy" className="text-xs">Dermatology / Skin Allergy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Symptom Duration *</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="< 24 hours" className="text-xs">Less than 24 hours</SelectItem>
                  <SelectItem value="2-3 days" className="text-xs">2 to 3 days</SelectItem>
                  <SelectItem value="1 week" className="text-xs">About 1 week</SelectItem>
                  <SelectItem value="> 2 weeks" className="text-xs">More than 2 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">Detailed Symptom Description *</Label>
            <Textarea
              placeholder="Describe what symptoms you are feeling (e.g., fever with chills, body ache, high blood pressure, fatigue)..."
              value={symptomDescription}
              onChange={(e) => setSymptomDescription(e.target.value)}
              className="min-h-24 text-xs"
            />
          </div>

          <div className="grid sm:grid-cols-4 gap-3 border-t pt-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Severity Rating</Label>
              <Select value={severity} onValueChange={(val) => setSeverity(val as any)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild" className="text-xs text-green-700 font-semibold">Mild</SelectItem>
                  <SelectItem value="moderate" className="text-xs text-blue-700 font-semibold">Moderate</SelectItem>
                  <SelectItem value="severe" className="text-xs text-amber-700 font-semibold">Severe</SelectItem>
                  <SelectItem value="critical" className="text-xs text-red-700 font-bold">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Blood Pressure (mmHg)</Label>
              <Input value={bpInput} onChange={(e) => setBpInput(e.target.value)} className="h-9 text-xs font-mono" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Oxygen SpO₂ (%)</Label>
              <Input value={spo2Input} onChange={(e) => setSpo2Input(e.target.value)} className="h-9 text-xs font-mono" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Temperature (°C)</Label>
              <Input value={tempInput} onChange={(e) => setTempInput(e.target.value)} className="h-9 text-xs font-mono" />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)} className="text-xs h-10">
              Back
            </Button>
            <Button
              onClick={() => {
                if (!symptomDescription.trim()) {
                  toast('Please describe your symptoms.', 'warning');
                  return;
                }
                setStep(3);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 h-10 shadow-sm"
            >
              Run Initial Digital Triage &rarr;
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: INITIAL DIGITAL TRIAGE */}
      {step === 3 && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" /> 3. Initial Digital Triage &amp; Risk Assessment
              </h2>
              <p className="text-xs text-gray-500">Automated triage calculation based on reported symptoms &amp; vitals.</p>
            </div>
            <StatusBadge
              status={calculatedRiskLevel === 'critical' ? 'critical' : calculatedRiskLevel === 'high' ? 'danger' : calculatedRiskLevel === 'medium' ? 'warning' : 'success'}
              label={`RISK: ${calculatedRiskLevel.toUpperCase()}`}
            />
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-950">
              <span>Clinical Evaluation Result:</span>
              <span className="capitalize">{calculatedRiskLevel} Risk Condition</span>
            </div>

            <p className="text-gray-700">
              Based on your reported symptom (<strong>{diseaseCategory}</strong>) and duration (<strong>{duration}</strong>), the triage algorithm recommends:
            </p>

            <div className="p-3 bg-white rounded-lg border border-emerald-300 font-semibold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                {calculatedRiskLevel === 'critical' || calculatedRiskLevel === 'high'
                  ? 'Urgent Specialist Consultation & Referral Recommended'
                  : 'Teleconsultation / Local PHC Doctor Consultation Recommended'}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(2)} className="text-xs h-10">
              Back
            </Button>
            <Button
              onClick={handleProceedToFacility}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 h-10 shadow-sm"
            >
              Find Suitable Healthcare Facility &rarr;
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: FIND SUITABLE HEALTHCARE SERVICE */}
      {step === 4 && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" /> 4. Healthcare Service &amp; Facility Finder
              </h2>
              <p className="text-xs text-gray-500">Facilities ranked by specialty availability and distance.</p>
            </div>
          </div>

          <div className="space-y-3">
            {facilities.map((fac, idx) => {
              const isSelected = selectedFacility.id === fac.id;
              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm">{fac.name}</h3>
                        <Badge variant="outline" className="text-[10px]">{fac.type}</Badge>
                        {idx === 0 && <Badge className="bg-emerald-600 text-[10px]">Recommended</Badge>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{fac.distance} km away &bull; Rampur Health Zone</p>
                    </div>
                    <Button size="sm" variant={isSelected ? 'default' : 'outline'} className="h-8 text-xs">
                      {isSelected ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(3)} className="text-xs h-10">
              Back
            </Button>
            <Button
              onClick={() => setStep(5)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 h-10 shadow-sm"
            >
              Book Appointment / Teleconsultation &rarr;
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: APPOINTMENT OR TELECONSULTATION BOOKING */}
      {step === 5 && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Video className="h-5 w-5 text-emerald-600" /> 5. Appointment or Teleconsultation Booking
              </h2>
              <p className="text-xs text-gray-500">Choose preferred mode of doctor consultation.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setBookingMode('teleconsultation')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                bookingMode === 'teleconsultation'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-white hover:bg-slate-50'
              }`}
            >
              <Video className="h-6 w-6 text-emerald-600 mb-2" />
              <div className="font-bold text-sm text-gray-900">Instant Teleconsultation</div>
              <p className="text-xs text-gray-500 mt-1">Connect with available PHC Doctor via Audio/Video call queue</p>
            </button>

            <button
              type="button"
              onClick={() => setBookingMode('in-person')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                bookingMode === 'in-person'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-white hover:bg-slate-50'
              }`}
            >
              <Calendar className="h-6 w-6 text-emerald-600 mb-2" />
              <div className="font-bold text-sm text-gray-900">In-Person PHC Visit</div>
              <p className="text-xs text-gray-500 mt-1">Schedule an in-person OPD consultation slot at {selectedFacility.name}</p>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Preferred Date</Label>
              <Input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Preferred Time Slot</Label>
              <Select value={bookingTimeSlot} onValueChange={setBookingTimeSlot}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:30 AM" className="text-xs">09:30 AM - Morning Slot</SelectItem>
                  <SelectItem value="10:30 AM" className="text-xs">10:30 AM - Morning Slot</SelectItem>
                  <SelectItem value="02:30 PM" className="text-xs">02:30 PM - Afternoon Slot</SelectItem>
                  <SelectItem value="04:00 PM" className="text-xs">04:00 PM - Evening Slot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(4)} className="text-xs h-10">
              Back
            </Button>
            <Button
              onClick={handleConfirmBooking}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 h-10 shadow-sm"
            >
              Confirm Booking &amp; Check Referral &rarr;
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 6: REFERRAL IF REQUIRED */}
      {step === 6 && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Send className="h-5 w-5 text-emerald-600" /> 6. Referral Dispatch (If Required)
              </h2>
              <p className="text-xs text-gray-500">Specialist hospital referral tracking &amp; coordination.</p>
            </div>
            {needsSpecialistReferral ? (
              <Badge className="bg-amber-100 text-amber-800 border-amber-300">Specialist Referral Recommended</Badge>
            ) : (
              <Badge variant="outline" className="text-green-700 border-green-300">PHC Level Care Sufficient</Badge>
            )}
          </div>

          {needsSpecialistReferral ? (
            <div className="space-y-4 bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs">
              <div className="font-bold text-amber-900">Specialist Referral Recommendation</div>
              <p className="text-amber-800">
                Your condition ({diseaseCategory}) requires specialized hospital evaluation. A formal digital referral will be logged to <strong>District Hospital - Rampur</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-gray-700">Specialty</Label>
                  <Select value={referralSpecialty} onValueChange={setReferralSpecialty}>
                    <SelectTrigger className="h-9 text-xs bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology" className="text-xs">Cardiology</SelectItem>
                      <SelectItem value="Orthopedics" className="text-xs">Orthopedics</SelectItem>
                      <SelectItem value="General Surgery" className="text-xs">General Surgery</SelectItem>
                      <SelectItem value="Pulmonology" className="text-xs">Pulmonology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900">
              ✓ No specialist referral required at this stage. Your consultation at {selectedFacility.name} is confirmed.
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(5)} className="text-xs h-10">
              Back
            </Button>
            <Button
              onClick={handleCompleteCareJourney}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 h-10 shadow-md"
            >
              Update Digital Record &amp; Complete &rarr;
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 7: FOLLOW-UP & DIGITAL RECORD UPDATE */}
      {step === 7 && (
        <Card className="p-6 space-y-6 bg-white border-2 border-emerald-500 shadow-xl">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" /> Digital Health Record Updated
              </h2>
              <p className="text-xs text-gray-500 mt-1">Closed-loop care continuum record saved successfully.</p>
            </div>
            <Badge className="bg-emerald-600 text-white font-bold">COMPLETED</Badge>
          </div>

          <div className="space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs">
            <div className="font-bold text-gray-900 text-sm border-b pb-2 flex items-center justify-between">
              <span>Digital Health Pass Summary</span>
              <span className="font-mono text-emerald-800 text-xs">Ref: {bookingRefId || 'BK-789012'}</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500 block">Patient Name</span>
                <span className="font-bold text-gray-900 text-sm">{activePatient.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Registered Disease</span>
                <span className="font-semibold text-emerald-900">{diseaseCategory}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Assigned Facility</span>
                <span className="font-semibold text-gray-900">{selectedFacility.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Triage Risk Level</span>
                <StatusBadge status={calculatedRiskLevel === 'critical' ? 'critical' : calculatedRiskLevel === 'high' ? 'danger' : calculatedRiskLevel === 'medium' ? 'warning' : 'success'} label={calculatedRiskLevel.toUpperCase()} />
              </div>
              <div>
                <span className="text-gray-500 block">Booking Mode</span>
                <span className="font-semibold text-gray-900 capitalize">{bookingMode} ({bookingTimeSlot})</span>
              </div>
              <div>
                <span className="text-gray-500 block">Follow-Up Schedule</span>
                <span className="font-semibold text-emerald-800">Scheduled in 7 Days</span>
              </div>
            </div>

            {needsSpecialistReferral && generatedReferralId && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-900">
                <div>
                  <span className="font-bold block">Dispatched Hospital Referral</span>
                  <span>ID: {generatedReferralId} &bull; Destination: District Hospital - Rampur ({referralSpecialty})</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => router.push(`/referrals/${generatedReferralId}`)} className="h-7 text-[11px] border-amber-300">
                  View Referral
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(1)} className="text-xs gap-1.5">
              Start New Health Assessment
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => toast('Digital Health Pass downloaded as PDF!', 'success')}
                className="text-xs gap-1.5 border-emerald-300 text-emerald-800"
              >
                <Download className="h-4 w-4" /> Download Health Pass
              </Button>
              <Button
                onClick={() => router.push('/patients')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 shadow-md"
              >
                View My Health Records &rarr;
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
