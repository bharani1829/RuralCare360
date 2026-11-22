/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Activity,
  Clock,
  UserPlus,
  Users,
  ArrowRight,
  UserCheck,
  Stethoscope,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '@/lib/store';
import { Patient, Vitals, CareStage } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

// Existing Patient Schema
const existingTriageSchema = z.object({
  patientId: z.string().min(1, 'Please select an existing patient'),
  temperature: z.coerce.number().min(35, 'Min 35°C').max(42, 'Max 42°C'),
  bpSystolic: z.coerce.number().min(60, 'Min 60 mmHg').max(300, 'Max 300 mmHg'),
  bpDiastolic: z.coerce.number().min(40, 'Min 40 mmHg').max(200, 'Max 200 mmHg'),
  spo2: z.coerce.number().min(70, 'Min 70%').max(100, 'Max 100%'),
  pulse: z.coerce.number().min(40, 'Min 40 bpm').max(150, 'Max 150 bpm'),
  symptoms: z.string().optional(),
  severeBleeding: z.boolean().default(false),
  chestPain: z.boolean().default(false),
  difficultyBreathing: z.boolean().default(false),
  lossOfConsciousness: z.boolean().default(false),
  severeBurns: z.boolean().default(false),
  poisoning: z.boolean().default(false),
  pregnancyStatus: z.enum(['unknown', 'yes', 'no']).default('unknown'),
});

// New Patient Registration + Triage Schema
const newPatientTriageSchema = z.object({
  name: z.string().min(2, 'Full Name is required'),
  age: z.coerce.number().min(0, 'Age must be positive').max(120, 'Valid age required'),
  gender: z.enum(['female', 'male', 'other']),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  village: z.string().min(2, 'Village/Location is required'),
  primaryCondition: z.string().min(2, 'Chief complaint/primary condition required'),
  temperature: z.coerce.number().min(35, 'Min 35°C').max(42, 'Max 42°C'),
  bpSystolic: z.coerce.number().min(60, 'Min 60 mmHg').max(300, 'Max 300 mmHg'),
  bpDiastolic: z.coerce.number().min(40, 'Min 40 mmHg').max(200, 'Max 200 mmHg'),
  spo2: z.coerce.number().min(70, 'Min 70%').max(100, 'Max 100%'),
  pulse: z.coerce.number().min(40, 'Min 40 bpm').max(150, 'Max 150 bpm'),
  symptoms: z.string().optional(),
  severeBleeding: z.boolean().default(false),
  chestPain: z.boolean().default(false),
  difficultyBreathing: z.boolean().default(false),
  lossOfConsciousness: z.boolean().default(false),
  severeBurns: z.boolean().default(false),
  poisoning: z.boolean().default(false),
  pregnancyStatus: z.enum(['unknown', 'yes', 'no']).default('unknown'),
});

type ExistingTriageFormData = z.infer<typeof existingTriageSchema>;
type NewPatientTriageFormData = z.infer<typeof newPatientTriageSchema>;

interface TriageResult {
  priority: 'green' | 'yellow' | 'red';
  priorityLabel: string;
  reasons: string[];
  recommendedAction: string;
  patient: Patient;
}

function calculateTriagePriority(vitalsData: {
  spo2: number;
  bpSystolic: number;
  severeBleeding: boolean;
  chestPain: boolean;
  difficultyBreathing: boolean;
  lossOfConsciousness: boolean;
  severeBurns: boolean;
  poisoning: boolean;
}): { priority: 'green' | 'yellow' | 'red'; priorityLabel: string; reasons: string[]; recommendedAction: string } {
  const reasons: string[] = [];
  let priority: 'green' | 'yellow' | 'red' = 'green';

  // RED priority checks
  if (vitalsData.spo2 < 90) {
    reasons.push(`SpO2: ${vitalsData.spo2}% (Critical hypoxia threshold: <90%)`);
    priority = 'red';
  }
  if (vitalsData.bpSystolic >= 180) {
    reasons.push(`Systolic BP: ${vitalsData.bpSystolic} mmHg (Hypertensive crisis: ≥180)`);
    priority = 'red';
  }
  if (vitalsData.severeBleeding) {
    reasons.push('Active severe hemorrhage / bleeding');
    priority = 'red';
  }
  if (vitalsData.chestPain && vitalsData.difficultyBreathing) {
    reasons.push('Acute chest pain with respiratory distress');
    priority = 'red';
  }

  // YELLOW priority checks (if not RED)
  if (priority !== 'red') {
    if (vitalsData.spo2 >= 90 && vitalsData.spo2 <= 93) {
      reasons.push(`SpO2: ${vitalsData.spo2}% (Borderline hypoxia: 90-93%)`);
      priority = 'yellow';
    }
    if (vitalsData.bpSystolic >= 160 && vitalsData.bpSystolic < 180) {
      reasons.push(`Systolic BP: ${vitalsData.bpSystolic} mmHg (Stage 2 Hypertension)`);
      priority = 'yellow';
    }
    if (vitalsData.chestPain) {
      reasons.push('Chest pain indication reported');
      priority = 'yellow';
    }
    if (vitalsData.difficultyBreathing) {
      reasons.push('Shortness of breath / dyspnea reported');
      priority = 'yellow';
    }
    if (vitalsData.lossOfConsciousness) {
      reasons.push('Transient loss of consciousness / syncope');
      priority = 'yellow';
    }
    if (vitalsData.severeBurns) {
      reasons.push('Burns requiring specialized wound management');
      priority = 'yellow';
    }
    if (vitalsData.poisoning) {
      reasons.push('Suspected toxic exposure / poisoning');
      priority = 'yellow';
    }
  }

  const priorityLabels = {
    green: 'Routine (Green)',
    yellow: 'Urgent Priority (Yellow)',
    red: 'Emergency Critical (Red)',
  };

  const actions = {
    green: 'Patient cleared for routine outpatient clinic queue. Assign standard follow-up within 14 days.',
    yellow: 'Urgent medical evaluation required within 15 minutes. Notify PHC Medical Officer and queue for teleconsultation.',
    red: 'IMMEDIATE EMERGENCY ESCALATION. Administer oxygen if SpO2 < 90%, stabilize patient, and initiate instant emergency referral to District Hospital.',
  };

  return {
    priority,
    priorityLabel: priorityLabels[priority],
    reasons: reasons.length > 0 ? reasons : ['All vitals and risk indicators within normal baseline range'],
    recommendedAction: actions[priority],
  };
}

export default function TriagePage() {
  const router = useRouter();
  const { state, addPatient, updatePatientVitalsAndStage } = useAppState();

  const [triageMode, setTriageMode] = useState<'existing' | 'new'>('existing');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form hooks for existing patient
  const {
    control: existingControl,
    handleSubmit: handleExistingSubmit,
    watch: watchExisting,
    reset: resetExisting,
    formState: { errors: existingErrors },
  } = useForm<ExistingTriageFormData>({
    resolver: zodResolver(existingTriageSchema) as any,
    defaultValues: {
      temperature: 37.0,
      bpSystolic: 120,
      bpDiastolic: 80,
      spo2: 98,
      pulse: 75,
      severeBleeding: false,
      chestPain: false,
      difficultyBreathing: false,
      lossOfConsciousness: false,
      severeBurns: false,
      poisoning: false,
      pregnancyStatus: 'unknown',
    },
  });

  // Form hooks for new patient
  const {
    control: newControl,
    handleSubmit: handleNewSubmit,
    reset: resetNew,
    formState: { errors: newErrors },
  } = useForm<NewPatientTriageFormData>({
    resolver: zodResolver(newPatientTriageSchema) as any,
    defaultValues: {
      name: '',
      age: 32,
      gender: 'female',
      phone: '',
      village: 'Rampur',
      primaryCondition: '',
      temperature: 37.0,
      bpSystolic: 120,
      bpDiastolic: 80,
      spo2: 98,
      pulse: 75,
      severeBleeding: false,
      chestPain: false,
      difficultyBreathing: false,
      lossOfConsciousness: false,
      severeBurns: false,
      poisoning: false,
      pregnancyStatus: 'unknown',
    },
  });

  const selectedPatientId = watchExisting('patientId');
  const selectedPatient = useMemo(
    () => state.patients.find((p) => p.id === selectedPatientId) || null,
    [selectedPatientId, state.patients]
  );

  // Submit Existing Patient Triage
  const onExistingSubmit = (data: ExistingTriageFormData) => {
    if (!selectedPatient) return;

    const calc = calculateTriagePriority(data);
    const vitalsRecord: Vitals = {
      bp: `${data.bpSystolic}/${data.bpDiastolic}`,
      spo2: data.spo2,
      pulse: data.pulse,
      temperature: data.temperature,
      recordedAt: new Date().toISOString(),
    };

    const riskMapping: Record<'green' | 'yellow' | 'red', Patient['riskLevel']> = {
      green: 'low',
      yellow: 'high',
      red: 'critical',
    };

    updatePatientVitalsAndStage(selectedPatient.id, vitalsRecord, riskMapping[calc.priority], 'triaged');

    const updatedPatient: Patient = {
      ...selectedPatient,
      vitals: vitalsRecord,
      riskLevel: riskMapping[calc.priority],
      careStage: 'triaged',
    };

    setTriageResult({
      ...calc,
      patient: updatedPatient,
    });
    setIsSubmitted(true);
  };

  // Submit New Patient Registration & Triage
  const onNewSubmit = (data: NewPatientTriageFormData) => {
    const calc = calculateTriagePriority(data);
    const newId = `P-00${state.patients.length + 1}`;

    const vitalsRecord: Vitals = {
      bp: `${data.bpSystolic}/${data.bpDiastolic}`,
      spo2: data.spo2,
      pulse: data.pulse,
      temperature: data.temperature,
      recordedAt: new Date().toISOString(),
    };

    const riskMapping: Record<'green' | 'yellow' | 'red', Patient['riskLevel']> = {
      green: 'low',
      yellow: 'high',
      red: 'critical',
    };

    const newPatient: Patient = {
      id: newId,
      name: data.name,
      age: data.age,
      gender: data.gender,
      village: data.village,
      phone: data.phone,
      primaryCondition: data.primaryCondition,
      riskLevel: riskMapping[calc.priority],
      lastVisit: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      careStage: 'triaged',
      vitals: vitalsRecord,
      medicalHistory: [data.primaryCondition, ...(data.symptoms ? [data.symptoms] : [])],
      assignedWorker: state.currentUser.name || 'Asha Lakshmi',
    };

    addPatient(newPatient);

    setTriageResult({
      ...calc,
      patient: newPatient,
    });
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setTriageResult(null);
    resetExisting();
    resetNew();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Clinical Assessment
            </span>
            <span className="text-xs text-emerald-200/80">Digital Protocol v2.4</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Digital Clinical Triage</h1>
          <p className="text-sm text-emerald-100/80 mt-1">
            Standardized vital sign assessment, automated risk stratification &amp; emergency identification.
          </p>
        </div>

        {/* Mode Switcher */}
        {!isSubmitted && (
          <div className="flex items-center bg-emerald-950/80 p-1.5 rounded-xl border border-emerald-700/50 shrink-0">
            <button
              type="button"
              onClick={() => setTriageMode('existing')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all',
                triageMode === 'existing'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              )}
            >
              <Users className="h-4 w-4" />
              Existing Patient
            </button>
            <button
              type="button"
              onClick={() => setTriageMode('new')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all',
                triageMode === 'new'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              )}
            >
              <UserPlus className="h-4 w-4" />
              Register &amp; Triage New Patient
            </button>
          </div>
        )}
      </div>

      {/* TRIAGE RESULT SCREEN */}
      {isSubmitted && triageResult && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <Card className="border-2 overflow-hidden shadow-xl">
            <div
              className={cn(
                'p-6 text-white flex items-center justify-between',
                triageResult.priority === 'red' && 'bg-red-600',
                triageResult.priority === 'yellow' && 'bg-amber-600',
                triageResult.priority === 'green' && 'bg-emerald-600'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
                  {triageResult.priority === 'red' && <AlertTriangle className="h-8 w-8" />}
                  {triageResult.priority === 'yellow' && <Clock className="h-8 w-8" />}
                  {triageResult.priority === 'green' && <CheckCircle className="h-8 w-8" />}
                </div>
                <div>
                  <div className="text-xs uppercase font-bold tracking-widest text-white/80">Triage Priority Assessment</div>
                  <h2 className="text-2xl font-black">{triageResult.priorityLabel}</h2>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs bg-black/20 px-3 py-1 rounded-full font-mono font-semibold">
                  Patient ID: {triageResult.patient.id}
                </span>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Patient Details Summary */}
              <div className="grid md:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Patient Name</span>
                  <span className="text-sm font-bold text-gray-900">{triageResult.patient.name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Age / Gender / Village</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {triageResult.patient.age}y • {triageResult.patient.gender} • {triageResult.patient.village}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Recorded Vitals</span>
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    BP {triageResult.patient.vitals?.bp} | SpO2 {triageResult.patient.vitals?.spo2}% | {triageResult.patient.vitals?.temperature}°C
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Care Stage</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 capitalize mt-0.5">
                    {triageResult.patient.careStage}
                  </Badge>
                </div>
              </div>

              {/* Clinical Reasons */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Stratification Findings &amp; Triggers:</h3>
                <ul className="space-y-2">
                  {triageResult.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Clinical Action */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Recommended Action Protocol</h3>
                <p className="text-sm font-semibold text-emerald-950">{triageResult.recommendedAction}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t">
                <Button variant="outline" onClick={resetForm} className="gap-2 text-xs">
                  Perform Another Triage
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/patients/${triageResult.patient.id}`)}
                    className="gap-2 text-xs"
                  >
                    <UserCheck className="h-4 w-4" /> View Patient Details
                  </Button>
                  <Button
                    onClick={() => router.push(`/referrals/create?patientId=${triageResult.patient.id}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
                  >
                    Create Specialist Referral <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FORM MODE: EXISTING VS NEW */}
      {!isSubmitted && (
        <div className="space-y-6">
          {/* TAB 1: EXISTING PATIENT TRIAGE */}
          {triageMode === 'existing' && (
            <form onSubmit={handleExistingSubmit(onExistingSubmit as any)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    Select Existing Patient for Triage Assessment
                  </CardTitle>
                  <CardDescription>
                    Select an active patient registered at your primary healthcare facility.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId" className="text-sm font-semibold">Select Patient *</Label>
                    <Controller
                      name="patientId"
                      control={existingControl}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Choose a registered patient..." />
                          </SelectTrigger>
                          <SelectContent>
                            {state.patients.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-gray-900">{p.name}</span>
                                  <span className="text-xs text-gray-500 font-mono">({p.id})</span>
                                  <span className="text-xs text-gray-500 font-medium">• {p.age}y {p.gender} • {p.village}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {existingErrors.patientId && (
                      <p className="text-xs font-medium text-red-600">{existingErrors.patientId.message}</p>
                    )}
                  </div>

                  {/* Selected Patient Preview Box */}
                  {selectedPatient && (
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in">
                      <div>
                        <div className="font-bold text-emerald-950 text-sm mb-0.5">{selectedPatient.name}</div>
                        <div className="text-emerald-800">
                          ID: <span className="font-mono">{selectedPatient.id}</span> &bull; {selectedPatient.age} yrs ({selectedPatient.gender}) &bull; {selectedPatient.village}
                        </div>
                        <div className="text-gray-600 mt-1">Chief Complaint: <strong>{selectedPatient.primaryCondition}</strong></div>
                      </div>
                      <Badge className="bg-emerald-600 text-white font-semibold">
                        Stage: {selectedPatient.careStage}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vitals Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    Record Patient Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature" className="text-xs font-semibold">Temperature (°C) *</Label>
                      <Controller
                        name="temperature"
                        control={existingControl}
                        render={({ field }) => (
                          <Input id="temperature" type="number" step="0.1" {...field} className="font-mono h-10" />
                        )}
                      />
                      {existingErrors.temperature && <p className="text-[11px] text-red-600">{existingErrors.temperature.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bpSystolic" className="text-xs font-semibold">Systolic BP (mmHg) *</Label>
                      <Controller
                        name="bpSystolic"
                        control={existingControl}
                        render={({ field }) => (
                          <Input id="bpSystolic" type="number" {...field} className="font-mono h-10" />
                        )}
                      />
                      {existingErrors.bpSystolic && <p className="text-[11px] text-red-600">{existingErrors.bpSystolic.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bpDiastolic" className="text-xs font-semibold">Diastolic BP (mmHg) *</Label>
                      <Controller
                        name="bpDiastolic"
                        control={existingControl}
                        render={({ field }) => (
                          <Input id="bpDiastolic" type="number" {...field} className="font-mono h-10" />
                        )}
                      />
                      {existingErrors.bpDiastolic && <p className="text-[11px] text-red-600">{existingErrors.bpDiastolic.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spo2" className="text-xs font-semibold">SpO2 Oxygen (%) *</Label>
                      <Controller
                        name="spo2"
                        control={existingControl}
                        render={({ field }) => (
                          <Input id="spo2" type="number" {...field} className="font-mono h-10" />
                        )}
                      />
                      {existingErrors.spo2 && <p className="text-[11px] text-red-600">{existingErrors.spo2.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pulse" className="text-xs font-semibold">Pulse Rate (bpm) *</Label>
                      <Controller
                        name="pulse"
                        control={existingControl}
                        render={({ field }) => (
                          <Input id="pulse" type="number" {...field} className="font-mono h-10" />
                        )}
                      />
                      {existingErrors.pulse && <p className="text-[11px] text-red-600">{existingErrors.pulse.message}</p>}
                    </div>
                  </div>

                  {/* Red Flag Checklist */}
                  <div className="pt-4 border-t space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-red-700 block">
                      Emergency Red-Flag Screening Checklist
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { name: 'severeBleeding', label: 'Severe Active Bleeding' },
                        { name: 'chestPain', label: 'Acute Chest Pain' },
                        { name: 'difficultyBreathing', label: 'Severe Difficulty Breathing' },
                        { name: 'lossOfConsciousness', label: 'Loss of Consciousness / Syncope' },
                        { name: 'severeBurns', label: 'Severe Burns' },
                        { name: 'poisoning', label: 'Suspected Poisoning / Toxic Exposure' },
                      ].map((item) => (
                        <Controller
                          key={item.name}
                          name={item.name as any}
                          control={existingControl}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50">
                              <Checkbox id={item.name} checked={field.value} onCheckedChange={field.onChange} />
                              <Label htmlFor={item.name} className="text-xs font-medium cursor-pointer">{item.label}</Label>
                            </div>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md">
                    Calculate &amp; Save Triage Assessment &rarr;
                  </Button>
                </CardContent>
              </Card>
            </form>
          )}

          {/* TAB 2: REGISTER & TRIAGE NEW PATIENT */}
          {triageMode === 'new' && (
            <form onSubmit={handleNewSubmit(onNewSubmit as any)} className="space-y-6">
              {/* Patient Demographic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-emerald-600" />
                    New Patient Registration Details
                  </CardTitle>
                  <CardDescription>
                    Enter patient demographic details to register them into the RuralCare 360 database.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-semibold">Full Patient Name *</Label>
                      <Controller
                        name="name"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="name" placeholder="e.g. Ramesh Chandra" {...field} className="h-10 text-xs" />
                        )}
                      />
                      {newErrors.name && <p className="text-[11px] text-red-600">{newErrors.name.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="age" className="text-xs font-semibold">Age (Years) *</Label>
                      <Controller
                        name="age"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="age" type="number" {...field} className="h-10 text-xs font-mono" />
                        )}
                      />
                      {newErrors.age && <p className="text-[11px] text-red-600">{newErrors.age.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="gender" className="text-xs font-semibold">Gender *</Label>
                      <Controller
                        name="gender"
                        control={newControl}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-10 text-xs">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-semibold">Mobile Contact Number *</Label>
                      <Controller
                        name="phone"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="phone" placeholder="10-digit mobile" {...field} className="h-10 text-xs font-mono" />
                        )}
                      />
                      {newErrors.phone && <p className="text-[11px] text-red-600">{newErrors.phone.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="village" className="text-xs font-semibold">Village / Location *</Label>
                      <Controller
                        name="village"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="village" placeholder="e.g. Rampur" {...field} className="h-10 text-xs" />
                        )}
                      />
                      {newErrors.village && <p className="text-[11px] text-red-600">{newErrors.village.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="primaryCondition" className="text-xs font-semibold">Chief Complaint / Condition *</Label>
                      <Controller
                        name="primaryCondition"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="primaryCondition" placeholder="e.g. High fever, chest tightness" {...field} className="h-10 text-xs" />
                        )}
                      />
                      {newErrors.primaryCondition && <p className="text-[11px] text-red-600">{newErrors.primaryCondition.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vitals Form for New Patient */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    Record Vital Signs for Triage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new_temp" className="text-xs font-semibold">Temperature (°C) *</Label>
                      <Controller
                        name="temperature"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="new_temp" type="number" step="0.1" {...field} className="font-mono h-10" />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_sys" className="text-xs font-semibold">Systolic BP (mmHg) *</Label>
                      <Controller
                        name="bpSystolic"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="new_sys" type="number" {...field} className="font-mono h-10" />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_dia" className="text-xs font-semibold">Diastolic BP (mmHg) *</Label>
                      <Controller
                        name="bpDiastolic"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="new_dia" type="number" {...field} className="font-mono h-10" />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_spo2" className="text-xs font-semibold">SpO2 Oxygen (%) *</Label>
                      <Controller
                        name="spo2"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="new_spo2" type="number" {...field} className="font-mono h-10" />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_pulse" className="text-xs font-semibold">Pulse Rate (bpm) *</Label>
                      <Controller
                        name="pulse"
                        control={newControl}
                        render={({ field }) => (
                          <Input id="new_pulse" type="number" {...field} className="font-mono h-10" />
                        )}
                      />
                    </div>
                  </div>

                  {/* Red Flag Checklist */}
                  <div className="pt-4 border-t space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-red-700 block">
                      Emergency Red-Flag Screening Checklist
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { name: 'severeBleeding', label: 'Severe Active Bleeding' },
                        { name: 'chestPain', label: 'Acute Chest Pain' },
                        { name: 'difficultyBreathing', label: 'Severe Difficulty Breathing' },
                        { name: 'lossOfConsciousness', label: 'Loss of Consciousness / Syncope' },
                        { name: 'severeBurns', label: 'Severe Burns' },
                        { name: 'poisoning', label: 'Suspected Poisoning / Toxic Exposure' },
                      ].map((item) => (
                        <Controller
                          key={item.name}
                          name={item.name as any}
                          control={newControl}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50">
                              <Checkbox id={`new_${item.name}`} checked={field.value} onCheckedChange={field.onChange} />
                              <Label htmlFor={`new_${item.name}`} className="text-xs font-medium cursor-pointer">{item.label}</Label>
                            </div>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md">
                    Register New Patient &amp; Complete Triage Assessment &rarr;
                  </Button>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
