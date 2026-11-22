'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Phone, Video, Mic, MicOff, Clock, Stethoscope, FileText } from 'lucide-react';
import { useAppState } from '@/lib/store';
import { referrals } from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConsultationQueue {
  patientId: string;
  patientName: string;
  waitTime: number;
  priority: 'routine' | 'priority' | 'emergency';
  reason: string;
  status: 'waiting' | 'in-progress' | 'completed';
}

const mockConsultationQueue: ConsultationQueue[] = [
  {
    patientId: 'P-1042',
    patientName: 'Ravi Kumar',
    waitTime: 12,
    priority: 'emergency',
    reason: 'High BP, chest discomfort',
    status: 'in-progress',
  },
  {
    patientId: 'P-1043',
    patientName: 'Fatima Begum',
    waitTime: 28,
    priority: 'priority',
    reason: 'Persistent cough, fever',
    status: 'waiting',
  },
  {
    patientId: 'P-1044',
    patientName: 'Venkat Rao',
    waitTime: 45,
    priority: 'routine',
    reason: 'Routine follow-up',
    status: 'waiting',
  },
  {
    patientId: 'P-1045',
    patientName: 'Meena Devi',
    waitTime: 52,
    priority: 'priority',
    reason: 'Joint pain, swelling',
    status: 'waiting',
  },
  {
    patientId: 'P-1046',
    patientName: 'Salim Khan',
    waitTime: 67,
    priority: 'routine',
    reason: 'Skin rash evaluation',
    status: 'waiting',
  },
];

export default function TeleconsultationPage() {
  const router = useRouter();
  const { state } = useAppState();
  const [activeConsultation, setActiveConsultation] = useState<ConsultationQueue | null>(mockConsultationQueue[0]);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [consultationMode, setConsultationMode] = useState<'audio' | 'video'>('audio');

  // Build combined queue from mock + triaged state.patients
  const combinedQueue = React.useMemo(() => {
    const queueMap = new Map<string, ConsultationQueue>();
    mockConsultationQueue.forEach(q => queueMap.set(q.patientId, q));

    // Append any newly triaged patients from store
    state.patients.forEach(p => {
      if (!queueMap.has(p.id)) {
        queueMap.set(p.id, {
          patientId: p.id,
          patientName: p.name,
          waitTime: 5,
          priority: p.riskLevel === 'critical' ? 'emergency' : p.riskLevel === 'high' ? 'priority' : 'routine',
          reason: p.primaryCondition || 'Primary triage consultation',
          status: 'waiting',
        });
      }
    });

    return Array.from(queueMap.values());
  }, [state.patients]);

  const getPatientDetails = (patientId: string) => {
    return state.patients.find(p => p.id === patientId);
  };

  const patient = activeConsultation ? getPatientDetails(activeConsultation.patientId) : null;

  const getPriorityColor = (priority: string): 'status-critical' | 'status-warning' | 'status-info' => {
    switch (priority) {
      case 'emergency': return 'status-critical';
      case 'priority': return 'status-warning';
      default: return 'status-info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teleconsultation Queue</h1>
        <p className="text-gray-600 mt-1">Manage patient consultations and referrals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Waiting Patients ({combinedQueue.filter(p => p.status !== 'completed').length})</CardTitle>
              <CardDescription>Total wait time shown in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {combinedQueue.map((patient) => (
                <button
                  key={patient.patientId}
                  onClick={() => setActiveConsultation(patient)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border-2 transition-all',
                    activeConsultation?.patientId === patient.patientId
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{patient.patientName}</p>
                      <p className="text-xs text-gray-600 mt-1 truncate">{patient.reason}</p>
                    </div>
                    <StatusBadge
                      status={getPriorityColor(patient.priority)}
                      label={patient.priority === 'emergency' ? 'URGENT' : patient.priority === 'priority' ? 'HIGH' : 'ROUTINE'}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{patient.waitTime} min wait</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Consultation Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeConsultation && patient ? (
            <>
              {/* Consultation Header */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        {patient.id} • Age {patient.age} • {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        className={cn(
                          'px-3 py-2',
                          activeConsultation.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                          activeConsultation.priority === 'priority' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        )}
                      >
                        {activeConsultation.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-2">
                        <Phone className="w-3 h-3 mr-1" />
                        In Progress
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consultation Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consultation Mode</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button
                    variant={consultationMode === 'audio' ? 'default' : 'outline'}
                    onClick={() => setConsultationMode('audio')}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Audio Only
                  </Button>
                  <Button
                    variant={consultationMode === 'video' ? 'default' : 'outline'}
                    onClick={() => setConsultationMode('video')}
                    className="flex-1"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                  <Button
                    variant={isMuted ? 'destructive' : 'outline'}
                    onClick={() => setIsMuted(!isMuted)}
                    size="icon"
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </CardContent>
              </Card>

              {/* Patient Information Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="vitals">Vitals</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                      <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">Primary Condition</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{patient.primaryCondition}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">Risk Level</p>
                          <StatusBadge status={
                            patient.riskLevel === 'critical' ? 'critical' :
                            patient.riskLevel === 'high' ? 'danger' :
                            patient.riskLevel === 'medium' ? 'warning' : 'info'
                          } label={patient.riskLevel.toUpperCase()} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">Last Visit</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{patient.lastVisit}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">Next Follow-up</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{patient.nextFollowUp}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="vitals" className="mt-4">
                      {patient.vitals ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-xs text-gray-600 font-semibold">Blood Pressure</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">{patient.vitals.bp}</p>
                            {patient.vitals.bp.split('/')[0] >= '160' && (
                              <p className="text-xs text-red-600 mt-1">⚠️ Elevated</p>
                            )}
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <p className="text-xs text-gray-600 font-semibold">SpO₂</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">{patient.vitals.spo2}%</p>
                            {patient.vitals.spo2 < 95 && (
                              <p className="text-xs text-yellow-600 mt-1">⚠️ Borderline</p>
                            )}
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-xs text-gray-600 font-semibold">Pulse</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">{patient.vitals.pulse} bpm</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <p className="text-xs text-gray-600 font-semibold">Temperature</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">{patient.vitals.temperature}°C</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">No recent vitals recorded</p>
                      )}
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                      <div className="space-y-3">
                        {patient.medicalHistory.map((condition, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{condition}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="reports" className="mt-4">
                      <div className="space-y-3">
                        {referrals
                          .filter(r => r.patientId === patient.id)
                          .slice(0, 3)
                          .map((referral) => (
                            <div key={referral.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{referral.reason}</p>
                                  <p className="text-xs text-gray-600 mt-1">{referral.id} • {referral.specialty}</p>
                                </div>
                                <StatusBadge
                                  status={referral.status === 'closed' ? 'success' : 'warning'}
                                  label={referral.status.replace(/-/g, ' ').toUpperCase()}
                                  size="sm"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* AI Patient Summary */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    AI-Assisted Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {patient.age}-year-old {patient.gender} patient with a history of {patient.medicalHistory.slice(0, 2).join(' and ')}.
                    Current primary concern is {patient.primaryCondition.toLowerCase()}. Patient is classified as {patient.riskLevel}-risk.
                    Previous consultation was on {patient.lastVisit}. Next scheduled follow-up is {patient.nextFollowUp}.
                  </p>
                  <p className="text-xs text-blue-800 font-semibold mt-3">
                    ℹ️ AI-generated summary — verify against original records before clinical decision-making.
                  </p>
                </CardContent>
              </Card>

              {/* Doctor Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consultation Notes</CardTitle>
                  <CardDescription>Record clinical observations and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="doctor-notes">Clinical Notes</Label>
                    <Textarea
                      id="doctor-notes"
                      placeholder="Examination findings, clinical assessment, treatment plan..."
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      className="mt-2 h-24"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      onClick={() => {
                        if (activeConsultation) {
                          router.push(`/referrals/create?patientId=${activeConsultation.patientId}&reason=${encodeURIComponent(doctorNotes || activeConsultation.reason)}`);
                        } else {
                          router.push('/referrals/create');
                        }
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Create Referral
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Create Prescription
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      End Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Disclaimer */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 ml-2">
                  <strong>Clinical Reminder:</strong> This platform provides decision support. All clinical decisions, diagnoses, and prescriptions must be made by qualified healthcare professionals.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-center py-8">Select a patient from the queue to begin consultation</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
