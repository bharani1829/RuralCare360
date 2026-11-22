/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Phone, Calendar, ArrowUp, CheckCircle } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { DataTable } from '@/components/data-table';
import { followUps } from '@/lib/demo-data';
import { format, parseISO, differenceInDays } from 'date-fns';

export default function MissedFollowUpsPage() {
  const router = useRouter();
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [daysOverdueFilter, setDaysOverdueFilter] = useState('all');

  const today = new Date();

  // Filter for missed follow-ups
  const missedFollowUps = followUps.filter(f => f.status === 'missed');

  const filteredMissed = missedFollowUps.filter(f => {
    if (priorityFilter !== 'all' && f.priority !== priorityFilter) return false;

    const fDate = parseISO(f.followUpDate);
    const daysOverdue = differenceInDays(today, fDate);

    if (daysOverdueFilter === '1-3' && (daysOverdue < 1 || daysOverdue > 3)) return false;
    if (daysOverdueFilter === '4-7' && (daysOverdue < 4 || daysOverdue > 7)) return false;
    if (daysOverdueFilter === '7+' && daysOverdue < 7) return false;

    return true;
  });

  const highRiskCount = missedFollowUps.filter(f => f.priority === 'urgent').length;

  const columns = [
    {
      key: 'patientName',
      header: 'Patient',
      render: (value: string, row: any) => (
        <button
          onClick={() => router.push(`/patients/${row.patientId}`)}
          className="text-[#0d7c5f] hover:underline font-medium"
        >
          {value}
        </button>
      ),
      sortable: true
    },
    {
      key: 'condition',
      header: 'Condition',
      sortable: true
    },
    {
      key: 'followUpDate',
      header: 'Expected Date',
      render: (value: string) => format(parseISO(value), 'MMM dd, yyyy'),
      sortable: true
    },
    {
      key: 'daysOverdue',
      header: 'Days Overdue',
      render: (_: unknown, row: typeof missedFollowUps[0]) => {
        const fDate = parseISO(row.followUpDate);
        const days = differenceInDays(today, fDate);
        return <span className={`font-bold ${days > 5 ? 'text-red-600' : 'text-orange-600'}`}>+{days} days</span>;
      },
      sortable: true
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (value: string) => (
        <StatusBadge
          status={value === 'urgent' ? 'danger' : value === 'priority' ? 'warning' : 'info'}
          label={value.charAt(0).toUpperCase() + value.slice(1)}
        />
      ),
      sortable: true
    },
    {
      key: 'assignedWorker',
      header: 'Assigned Worker',
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: typeof missedFollowUps[0]) => (
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="text-xs">
            <Phone className="h-3 w-3 mr-1" />
            Outreach
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <ArrowUp className="h-3 w-3 mr-1" />
            Escalate
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Reschedule
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Missed Follow-ups & Outreach</h1>
          <p className="text-gray-600 mt-1">Manage overdue follow-ups and patient outreach</p>
        </div>
        <Button onClick={() => router.push('/followups')}>
          Back to Follow-ups
        </Button>
      </div>

      {/* Alert Banner */}
      {highRiskCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Priority Alert</AlertTitle>
          <AlertDescription>
            {highRiskCount} high-risk patients have missed scheduled follow-ups and require immediate outreach.
          </AlertDescription>
        </Alert>
      )}

      {/* Escalation Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Escalation Workflow</CardTitle>
          <CardDescription>Standard escalation process for missed follow-ups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">1</div>
              <div className="flex-1">
                <h4 className="font-medium">Reminder Sent (SMS/Email)</h4>
                <p className="text-sm text-gray-600">Automated reminder 1 day before scheduled follow-up</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">2</div>
              <div className="flex-1">
                <h4 className="font-medium">Phone Call Attempt</h4>
                <p className="text-sm text-gray-600">Health worker calls patient on scheduled date</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-semibold">3</div>
              <div className="flex-1">
                <h4 className="font-medium">ASHA Outreach Task</h4>
                <p className="text-sm text-gray-600">If missed, create home visit task for ASHA worker</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-semibold">4</div>
              <div className="flex-1">
                <h4 className="font-medium">Second Reminder</h4>
                <p className="text-sm text-gray-600">Follow-up reminder after 3 days</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold">5</div>
              <div className="flex-1">
                <h4 className="font-medium">Supervisor Escalation</h4>
                <p className="text-sm text-gray-600">If still unresolved after 5 days, escalate to supervisor</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold">6</div>
              <div className="flex-1">
                <h4 className="font-medium">Case Review</h4>
                <p className="text-sm text-gray-600">District health team reviews case and determines next steps</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Missed Follow-ups ({filteredMissed.length})</CardTitle>
              <CardDescription>Patients requiring outreach and follow-up</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Select High-Risk
              </Button>
              <Button size="sm" className="bg-[#0d7c5f] hover:bg-[#0a5f47]">
                Generate Outreach Tasks
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="urgent">Urgent / High-Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={daysOverdueFilter} onValueChange={setDaysOverdueFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All durations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Overdue</SelectItem>
                <SelectItem value="1-3">1-3 days</SelectItem>
                <SelectItem value="4-7">4-7 days</SelectItem>
                <SelectItem value="7+">7+ days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredMissed}
            searchable={false}
            emptyMessage="No missed follow-ups"
          />
        </CardContent>
      </Card>
    </div>
  );
}
