/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Users,
  Pill,
  Heart,
  Activity,
  Video,
  Stethoscope,
  CalendarCheck,
  ArrowRightLeft,
  Microscope,
  Building2,
  BarChart3,
  Settings,
  User,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { AlertCard } from '@/components/alert-card';
import { CarePipeline } from '@/components/care-pipeline';
import { DataTable } from '@/components/data-table';
import { useAppState, UserRole } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { dashboardKPIs, patients, facilities } from '@/lib/demo-data';
import { PatientCareJourney } from '@/components/patient-care-journey';

const roleLabels: Record<UserRole, { label: string }> = {
  'patient': { label: 'Patient / Citizen' },
  'health-worker': { label: 'Health Worker (ASHA/ANM)' },
  'doctor': { label: 'Doctor / Specialist' },
  'facility-staff': { label: 'Facility Staff' },
  'admin': { label: 'Administrator' },
};

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, state } = useAppState();
  const { t } = useTranslation();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const prefix =
      hour < 12
        ? t('dashboard.greeting.morning')
        : hour < 17
        ? t('dashboard.greeting.afternoon')
        : t('dashboard.greeting.evening');
    return `${prefix} ${currentUser?.name || 'User'}`;
  }, [currentUser?.name, t]);

  // Find active logged in patient profile
  const myPatientRecord = useMemo(() => {
    return (
      state.patients.find(
        (p) =>
          p.name.toLowerCase() === currentUser.name.toLowerCase() ||
          p.id === currentUser.workerId ||
          p.phone === currentUser.mobile
      ) || {
        id: currentUser.workerId || 'P-1042',
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
        medicalHistory: ['Hypertension screening', 'Routine Vitals Check'],
        vitals: {
          bp: '120/80',
          spo2: 98,
          pulse: 72,
          temperature: 36.8,
          recordedAt: new Date().toISOString(),
        },
      }
    );
  }, [currentUser, state.patients]);

  const myReferrals = useMemo(() => {
    return state.referrals.filter((r) => r.patientId === myPatientRecord.id || r.patientName.toLowerCase() === myPatientRecord.name.toLowerCase());
  }, [state.referrals, myPatientRecord]);

  // Calculate dynamic care pipeline stage counts from state & demo data (for Staff/Doctor/Admin)
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {
      registered: 12,
      triaged: 8,
      consulted: 6,
      referred: 4,
      appointment: 3,
      arrived: 2,
      treated: 5,
      'follow-up': 17,
      closed: 42,
    };
    patients.forEach((p) => {
      if (p.careStage && p.careStage in counts) {
        counts[p.careStage]++;
      }
    });
    return counts;
  }, []);

  const pipelineStages = [
    { label: t('common.stage.registered'), count: stageCounts.registered, status: 'active' as const },
    { label: t('common.stage.triaged'), count: stageCounts.triaged, status: 'active' as const },
    { label: t('common.stage.consulted'), count: stageCounts.consulted, status: 'active' as const },
    { label: t('common.stage.referred'), count: stageCounts.referred, status: 'active' as const },
    { label: t('common.stage.appointment'), count: stageCounts.appointment, status: 'active' as const },
    { label: t('common.stage.arrived'), count: stageCounts.arrived, status: 'active' as const },
    { label: t('common.stage.treated'), count: stageCounts.treated, status: 'active' as const },
    { label: t('common.stage.followup'), count: stageCounts['follow-up'], status: 'active' as const },
    { label: t('common.stage.closed'), count: stageCounts.closed, status: 'active' as const },
  ];

  const referralFunnelData = [
    { name: t('referral.status.created'), value: 45 },
    { name: t('referral.status.accepted'), value: 40 },
    { name: t('referral.status.appointment-booked'), value: 35 },
    { name: t('referral.status.patient-arrived'), value: 30 },
    { name: t('referral.status.consultation-completed'), value: 28 },
    { name: t('referral.status.follow-up'), value: 22 },
    { name: t('referral.status.closed'), value: 18 },
  ];

  const greenShades = ['#0d7c5f', '#128570', '#178d7f', '#1a9f88', '#1bb091', '#1cc29a', '#1dd4a3'];

  const continuityData = [
    { metric: t('dashboard.continuity.referral'), value: 82 },
    { metric: t('dashboard.continuity.followup'), value: 76 },
    { metric: t('dashboard.continuity.record'), value: 85 },
    { metric: t('dashboard.continuity.diagnostic'), value: 74 },
    { metric: t('dashboard.continuity.treatment'), value: 88 },
  ];

  const facilityTableData = facilities.map((f) => ({
    name: f.name,
    distance: `${f.distance} km`,
    doctor: f.doctors.some((d) => d.available) ? '✓' : '✗',
    diagnostics: f.diagnostics.filter((d) => d.available).length,
    medicine: f.medicines.some((m) => m.status === 'available') ? '✓' : '✗',
    queue: f.queueLength,
    status: f.status,
  }));

  const todayPatientsData = patients.slice(0, 8).map((p) => ({
    id: p.id,
    name: p.name,
    age: p.age,
    concern: p.primaryCondition,
    riskLevel: p.riskLevel,
    careStage: p.careStage,
    worker: p.assignedWorker,
  }));

  // ==========================================
  // DEDICATED CLEAN PATIENT DASHBOARD VIEW
  // ==========================================
  if (state.currentUser.role === 'patient') {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Patient Header Banner */}
        <Card className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-xl border-emerald-800 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Patient Health Portal
                </span>
                <span className="text-xs text-emerald-200/80 font-medium">
                  {myPatientRecord.village}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {greeting}
              </h1>
              <p className="text-sm text-emerald-100/80 mt-1">
                Access your personal medical records, register symptoms, consult doctors, and track hospital referrals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => router.push('/teleconsultation')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs gap-1.5 shadow-md">
                <Video className="w-4 h-4" /> Book Consultation
              </Button>
              <Button size="sm" onClick={() => router.push('/patients')} className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs gap-1.5 shadow-md">
                <FileText className="w-4 h-4" /> My Records
              </Button>
            </div>
          </div>
        </Card>

        {/* Personal Health KPI Cards (Clean, No Staff Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Heart className="w-5 h-5 text-emerald-600" />}
            label="Active Health Condition"
            value={myPatientRecord.primaryCondition.slice(0, 20)}
            trend="neutral"
            status="positive"
            subtitle="Registered Profile"
          />
          <StatCard
            icon={<Activity className="w-5 h-5 text-blue-600" />}
            label="Latest Vitals (BP / SpO₂)"
            value={`${myPatientRecord.vitals?.bp || '120/80'} | ${myPatientRecord.vitals?.spo2 || 98}%`}
            trend="up"
            status="positive"
            subtitle="Normal Range"
          />
          <StatCard
            icon={<ArrowRightLeft className="w-5 h-5 text-purple-600" />}
            label="Active Referrals"
            value={`${myReferrals.length} Dispatched`}
            trend="neutral"
            status="positive"
            subtitle="Hospital Tracking Active"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-teal-600" />}
            label="Next Scheduled Follow-up"
            value={myPatientRecord.nextFollowUp || 'In 7 days'}
            trend="neutral"
            status="positive"
            subtitle="PHC A - Rampur"
          />
        </div>

        {/* 7-Step Interactive Patient Care Journey & Disease Registration */}
        <div>
          <PatientCareJourney />
        </div>

        {/* Personal Medical History & Active Referrals Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Medical History */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> My Medical History &amp; Diagnostics
            </h3>
            <div className="space-y-2.5 text-xs text-gray-700">
              {myPatientRecord.medicalHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-gray-900">{h}</span>
                  <Badge variant="outline" className="text-[10px]">Verified</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Referrals */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-emerald-600" /> My Active Hospital Referrals
            </h3>
            {myReferrals.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No active hospital referrals. You can register symptoms above to consult a doctor.</p>
            ) : (
              <div className="space-y-2.5">
                {myReferrals.map((r) => (
                  <div key={r.id} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-emerald-950 block">{r.id}</span>
                      <span className="text-gray-600">{r.destinationFacility} &bull; {r.specialty}</span>
                    </div>
                    <StatusBadge status={r.status === 'closed' ? 'success' : 'info'} label={r.status.toUpperCase()} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // ==========================================
  // STAFF / DOCTOR / ADMIN DASHBOARD VIEW
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-xl border-emerald-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {roleLabels[state.currentUser.role]?.label || state.currentUser.role}
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">
                {state.currentUser.facility}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{greeting}</h1>
            <p className="text-sm text-emerald-100/80 mt-1">
              Active session configured for <strong className="text-white">{roleLabels[state.currentUser.role]?.label}</strong>. Streamlined workflows enabled.
            </p>
          </div>

          {/* Quick Actions per Role */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            {state.currentUser.role === 'health-worker' && (
              <>
                <Button size="sm" onClick={() => router.push('/triage')} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <Stethoscope className="w-4 h-4" /> Start Triage
                </Button>
                <Button size="sm" onClick={() => router.push('/followups')} className="bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <CalendarCheck className="w-4 h-4" /> Follow-ups
                </Button>
                <Button size="sm" onClick={() => router.push('/emergency')} className="bg-red-600 hover:bg-red-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <AlertTriangle className="w-4 h-4" /> Emergency
                </Button>
              </>
            )}
            {state.currentUser.role === 'doctor' && (
              <>
                <Button size="sm" onClick={() => router.push('/teleconsultation')} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <Video className="w-4 h-4" /> Consult Queue
                </Button>
                <Button size="sm" onClick={() => router.push('/referrals/create')} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <ArrowRightLeft className="w-4 h-4" /> New Referral
                </Button>
                <Button size="sm" onClick={() => router.push('/diagnostics')} className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <Microscope className="w-4 h-4" /> Diagnostics
                </Button>
              </>
            )}
            {state.currentUser.role === 'facility-staff' && (
              <>
                <Button size="sm" onClick={() => router.push('/referrals')} className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <ArrowRightLeft className="w-4 h-4" /> Referrals Inbox
                </Button>
                <Button size="sm" onClick={() => router.push('/medicines')} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <Pill className="w-4 h-4" /> Medicine Stock
                </Button>
                <Button size="sm" onClick={() => router.push('/facilities')} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <Building2 className="w-4 h-4" /> Facilities
                </Button>
              </>
            )}
            {state.currentUser.role === 'admin' && (
              <>
                <Button size="sm" onClick={() => router.push('/admin')} className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <Settings className="w-4 h-4" /> Admin Panel
                </Button>
                <Button size="sm" onClick={() => router.push('/reports')} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold shadow-md">
                  <BarChart3 className="w-4 h-4" /> System Reports
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* KPI Cards (Staff/Doctor/Admin) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label={t('dashboard.kpi.patientsToday')}
          value="84"
          trend="up"
          status="positive"
          subtitle="+12% vs yesterday"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label={t('dashboard.kpi.pendingReferrals')}
          value="8"
          trend="up"
          status="warning"
          subtitle="+2 today"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label={t('dashboard.kpi.followupsDue')}
          value="17"
          trend="down"
          status="positive"
          subtitle="-3 completed"
        />
        <StatCard
          icon={<Heart className="w-6 h-6" />}
          label={t('dashboard.kpi.highRisk')}
          value="5"
          trend="neutral"
          status="warning"
          subtitle="Stable"
        />
        <StatCard
          icon={<Pill className="w-6 h-6" />}
          label={t('dashboard.kpi.medicineAlerts')}
          value="4"
          trend="up"
          status="negative"
          subtitle="+1 critical"
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          label={t('dashboard.kpi.diagnosticsUnavailable')}
          value="3"
          trend="neutral"
          status="neutral"
          subtitle="Stable"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label={t('dashboard.kpi.avgWaitingTime')}
          value="34 min"
          trend="down"
          status="positive"
          subtitle="-5 min"
        />
        <StatCard
          icon={<ArrowRightLeft className="w-6 h-6" />}
          label={t('dashboard.kpi.referralCompletion')}
          value="82%"
          trend="up"
          status="positive"
          subtitle="+4%"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <CarePipeline stages={pipelineStages} />

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.referralPerformance')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referralFunnelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0d7c5f">
                    {referralFunnelData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={greenShades[index % greenShades.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.todaysPatients')}</h3>
            <DataTable
              columns={[
                { key: 'id', header: 'ID', render: (val) => <span className="font-mono text-xs">{String(val)}</span> },
                { key: 'name', header: 'Name', render: (val, row) => <Link href={`/patients/${row.id}`} className="font-medium text-emerald-700 hover:underline">{String(val)}</Link> },
                { key: 'age', header: 'Age' },
                { key: 'concern', header: 'Concern' },
                { key: 'riskLevel', header: 'Risk', render: (val) => <StatusBadge status={val === 'critical' ? 'critical' : val === 'high' ? 'danger' : val === 'medium' ? 'warning' : 'success'} label={String(val)} size="sm" /> },
                { key: 'careStage', header: 'Stage', render: (val) => <Badge variant="secondary" className="capitalize text-[10px]">{String(val)}</Badge> },
              ]}
              data={todayPatientsData as any}
              emptyMessage={t('dashboard.noPatients')}
            />
          </Card>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.priorityAlerts')}</h3>
            <div className="space-y-3">
              <AlertCard title={t('dashboard.alert.emergency.title')} message="Patient P-1042 requires tertiary cardiac referral." type="emergency" timestamp="10m ago" />
              <AlertCard title={t('dashboard.alert.missedFollowup.title')} message="3 patients missed follow-up appointments today." type="warning" timestamp="1h ago" />
              <AlertCard title={t('dashboard.alert.medicineShortage.title')} message="Paracetamol & Amoxicillin stock low at Subcenter B." type="warning" timestamp="3h ago" />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.careContinuityScore')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-emerald-700">81.4%</span>
                <Badge className="bg-emerald-100 text-emerald-800">Target: 80%</Badge>
              </div>

              <div className="space-y-2">
                {continuityData.map((item) => (
                  <div key={item.metric} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">{item.metric}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.facilityAvailability')}</h3>
            <div className="space-y-3 text-xs">
              {facilityTableData.map((fac) => (
                <div key={fac.name} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-slate-50">
                  <div>
                    <span className="font-bold text-gray-900 block">{fac.name}</span>
                    <span className="text-gray-500">{fac.distance} &bull; Queue: {fac.queue}m</span>
                  </div>
                  <Badge variant={fac.status === 'operational' ? 'default' : 'secondary'} className="text-[10px]">
                    {fac.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
