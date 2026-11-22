'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { StatusBadge } from '@/components/status-badge';
import { PatientTimeline } from '@/components/patient-timeline';
import { EmptyState } from '@/components/empty-state';
import { referrals, patients } from '@/lib/demo-data';
import { useAppState } from '@/lib/store';
import { ArrowRightLeft, Clock, MapPin, User, Stethoscope, Activity, CalendarClock, CheckCircle2, AlertTriangle, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/toast-provider';

export default function ReferralDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = React.use(props.params);
  const router = useRouter();
  const { state, updateReferralStatus, addFollowUp, addAuditEntry } = useAppState();
  const currentUser = state.currentUser;
  const { toast } = useToast();
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<import('@/lib/demo-data').ReferralStatus>('accepted');

  const referral = state.referrals.find(r => r.id === params.id) || referrals.find(r => r.id === params.id);
  const patient = referral
    ? state.patients.find(p => p.id === referral.patientId) || patients.find(p => p.id === referral.patientId) || {
        id: referral.patientId,
        name: referral.patientName,
        age: 35,
        gender: 'Female',
        mobile: '9876543210',
        village: 'Rampur',
        assignedWorker: 'Asha Lakshmi',
        riskLevel: 'medium' as const,
        careStage: 'referred' as const,
        primaryCondition: referral.reason,
        lastVisit: referral.createdAt.split('T')[0],
      }
    : null;

  if (!referral || !patient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={<ArrowRightLeft className="w-16 h-16 text-gray-300" />}
          title="Referral Not Found"
          description="The referral you're looking for doesn't exist"
          action={{ label: 'Back to Referrals', onClick: () => router.push('/referrals') }}
        />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'created': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'appointment-booked': 'bg-purple-100 text-purple-800',
      'patient-arrived': 'bg-indigo-100 text-indigo-800',
      'consultation-completed': 'bg-teal-100 text-teal-800',
      'diagnostics-completed': 'bg-cyan-100 text-cyan-800',
      'treatment-completed': 'bg-emerald-100 text-emerald-800',
      'follow-up': 'bg-amber-100 text-amber-800',
      'closed': 'bg-green-200 text-green-900',
      'missed': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (urgency: string) => {
    if (urgency === 'emergency') return 'bg-red-100 text-red-800 border-red-300';
    if (urgency === 'priority') return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const timelineItems = referral.timeline.map(entry => ({
    date: format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm'),
    title: entry.status.replace('-', ' ').toUpperCase(),
    description: `${entry.facility} • ${entry.user}${entry.notes ? ` • ${entry.notes}` : ''}`,
    status: 'completed' as const,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{referral.id}</h1>
            <Badge className={getStatusColor(referral.status)}>
              {referral.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <p className="text-lg text-gray-600">{patient.name} • {patient.age}Y • {patient.gender}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setUpdateStatusOpen(true)}>
            Update Status
          </Button>
          <Button variant="outline" onClick={() => setFollowUpOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Follow-up
          </Button>
          {referral.urgency === 'emergency' && (
            <Button
              variant="destructive"
              onClick={() => {
                toast('Emergency escalation alert sent to District Medical Officer & Ambulance Hub!', 'error');
              }}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Escalate Emergency
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-healthcare-green" />
              Referral Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Patient</label>
                <p className="text-gray-900 font-medium mt-1">{patient.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Patient ID</label>
                <p className="text-gray-900 font-medium mt-1">{patient.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Reason for Referral</label>
                <p className="text-gray-900 mt-1">{referral.reason}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Required Specialty</label>
                <p className="text-gray-900 mt-1">{referral.specialty}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Diagnostic Tests</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {referral.diagnosticTests.map((test, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {test}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Urgency</label>
                <Badge className={`${getPriorityColor(referral.urgency)} mt-1`}>
                  {referral.urgency.toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Source Facility</label>
                <p className="text-gray-900 mt-1">{referral.sourceFacility}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Destination</label>
                <p className="text-gray-900 font-medium mt-1">{referral.destinationFacility}</p>
              </div>
              {referral.appointmentDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Appointment Date</label>
                  <p className="text-gray-900 mt-1">{format(new Date(referral.appointmentDate), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-900 mt-1">{format(new Date(referral.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-healthcare-green" />
              Referral Timeline
            </h2>
            <PatientTimeline items={timelineItems} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patient Summary */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-healthcare-green" />
              Patient Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-500">Age</label>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div>
                <label className="text-gray-500">Village</label>
                <p className="font-medium">{patient.village}</p>
              </div>
              <div>
                <label className="text-gray-500">Primary Condition</label>
                <p className="font-medium">{patient.primaryCondition}</p>
              </div>
              <div>
                <label className="text-gray-500">Risk Level</label>
                <StatusBadge
                  status={patient.riskLevel === 'critical' ? 'critical' : patient.riskLevel === 'high' ? 'danger' : patient.riskLevel === 'medium' ? 'warning' : 'success'}
                  label={patient.riskLevel.toUpperCase()}
                />
              </div>
              <div>
                <label className="text-gray-500">Assigned Worker</label>
                <p className="font-medium">{patient.assignedWorker}</p>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => router.push(`/patients/${patient.id}`)}>
                View Full Profile
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setUpdateStatusOpen(true)}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Update Status
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setFollowUpOpen(true)}>
                <CalendarClock className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast('Appointment bump request sent to destination facility receptionist.', 'info');
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Request Early Appointment
              </Button>
            </div>
          </Card>

          {/* Disclaimer */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-xs text-blue-900">
              <strong>Clinical Coordination Note:</strong> RuralCare 360 provides care coordination support. All clinical decisions require professional medical judgment.
            </p>
          </Card>
        </div>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusOpen} onOpenChange={setUpdateStatusOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Referral Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>New Status</Label>
              <RadioGroup value={nextStatus} onValueChange={(value) => setNextStatus((value ?? 'accepted') as import('@/lib/demo-data').ReferralStatus)} className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accepted" id="accepted" />
                  <Label htmlFor="accepted" className="font-normal">Accepted</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="appointment-booked" id="appointment-booked" />
                  <Label htmlFor="appointment-booked" className="font-normal">Appointment Booked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="patient-arrived" id="patient-arrived" />
                  <Label htmlFor="patient-arrived" className="font-normal">Patient Arrived</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="consultation-completed" id="consultation-completed" />
                  <Label htmlFor="consultation-completed" className="font-normal">Consultation Completed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="closed" id="closed" />
                  <Label htmlFor="closed" className="font-normal">Closed</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Add any relevant notes..." className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusOpen(false)}>Cancel</Button>
            <Button className="bg-healthcare-green hover:bg-healthcare-green/90" onClick={() => { const now = new Date().toISOString(); updateReferralStatus(referral.id, nextStatus, { status: nextStatus, timestamp: now, facility: currentUser.facility, user: currentUser.name, notes: 'Status updated in prototype.' }); addAuditEntry({ id: `AUD-${Date.now()}`, timestamp: now, user: currentUser.name, action: 'Updated referral status', entityId: referral.id, entityType: 'Referral', status: nextStatus }); toast('Referral status updated.', 'success'); setUpdateStatusOpen(false) }}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={followUpOpen} onOpenChange={setFollowUpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="followup-date">Follow-up Date</Label>
              <Input id="followup-date" type="date" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea id="instructions" placeholder="Follow-up instructions..." className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpOpen(false)}>Cancel</Button>
            <Button className="bg-healthcare-green hover:bg-healthcare-green/90" onClick={() => { addFollowUp({ id: `FU-${Date.now()}`, patientId: referral.patientId, patientName: referral.patientName, condition: referral.reason, followUpDate: new Date().toISOString().slice(0, 10), assignedWorker: currentUser.name, priority: referral.urgency === 'emergency' ? 'urgent' : 'priority', status: 'scheduled' }); toast('Follow-up task created.', 'success'); setFollowUpOpen(false) }}>
              Create Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
