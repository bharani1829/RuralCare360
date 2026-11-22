/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, CalendarCheck, AlertCircle, CheckCircle2, Clock, FileDown, Plus, Filter } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { DataTable } from '@/components/data-table';
import { useAppState } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export default function FollowUpsPage() {
  const router = useRouter();
  const { state, completeFollowUp, addFollowUp } = useAppState();
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [workerFilter, setWorkerFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const followUps = state.followUps;
  const patients = state.patients;

  // Calculate summary stats
  const today = new Date();
  const dueToday = followUps.filter(f => {
    const fDate = parseISO(f.followUpDate);
    return format(fDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && f.status !== 'completed';
  }).length;

  const overdue = followUps.filter(f => {
    const fDate = parseISO(f.followUpDate);
    return fDate < today && f.status === 'missed';
  }).length;

  const completedThisWeek = followUps.filter(f => {
    const fDate = parseISO(f.followUpDate);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return f.status === 'completed' && fDate >= weekAgo && fDate <= today;
  }).length;

  const upcoming = followUps.filter(f => {
    const fDate = parseISO(f.followUpDate);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return fDate > today && fDate <= nextWeek && f.status !== 'completed';
  }).length;

  // Filter follow-ups
  const filteredFollowUps = followUps.filter(f => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && f.priority !== priorityFilter) return false;
    if (workerFilter !== 'all' && f.assignedWorker !== workerFilter) return false;
    if (searchQuery && !f.patientName.toLowerCase().includes(searchQuery.toLowerCase()) && !f.patientId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Get unique workers
  const workers = Array.from(new Set(followUps.map(f => f.assignedWorker)));

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
      key: 'patientId',
      header: 'Patient ID',
      sortable: true
    },
    {
      key: 'condition',
      header: 'Condition',
      sortable: true
    },
    {
      key: 'followUpDate',
      header: 'Follow-up Date',
      render: (value: string) => format(parseISO(value), 'MMM dd, yyyy'),
      sortable: true
    },
    {
      key: 'daysUntil',
      header: 'Days Since/Until',
      render: (_: any, row: any) => {
        const fDate = parseISO(row.followUpDate);
        const diff = differenceInDays(fDate, today);
        if (diff < 0) {
          return <span className="font-bold text-red-600">+{Math.abs(diff)} overdue</span>;
        } else if (diff === 0) {
          return <span className="font-medium text-yellow-600">Due today</span>;
        } else {
          return <span className="text-gray-600">-{diff} days</span>;
        }
      }
    },
    {
      key: 'assignedWorker',
      header: 'Assigned Worker',
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
      key: 'status',
      header: 'Status',
      render: (value: string) => {
        const statusMap: any = {
          scheduled: { status: 'info', label: 'Scheduled' },
          due: { status: 'warning', label: 'Due' },
          missed: { status: 'danger', label: 'Missed' },
          completed: { status: 'success', label: 'Completed' }
        };
        const config = statusMap[value] || { status: 'neutral', label: value };
        return <StatusBadge status={config.status} label={config.label} />;
      },
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/followups/${row.id}`)}
          >
            View
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
          <h1 className="text-3xl font-bold text-gray-900">Follow-up Coordination</h1>
          <p className="text-gray-600 mt-1">Track and manage patient follow-up appointments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/followups/missed')}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Missed Follow-ups
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0d7c5f] hover:bg-[#0a5f47]">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Follow-up</DialogTitle>
                <DialogDescription>Create a follow-up appointment for a patient</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Patient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Search patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Follow-up Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="checkup">Check-up</SelectItem>
                      <SelectItem value="medication">Medication Review</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic Review</SelectItem>
                      <SelectItem value="post-treatment">Post-treatment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Follow-up Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Select date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Assigned Worker</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select worker..." />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map(w => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Instructions</Label>
                  <Textarea placeholder="Follow-up instructions and notes..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Reminder Preferences</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms" />
                    <label htmlFor="sms" className="text-sm">SMS</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" />
                    <label htmlFor="email" className="text-sm">Email</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="phone" />
                    <label htmlFor="phone" className="text-sm">Phone</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button className="bg-[#0d7c5f] hover:bg-[#0a5f47]">Schedule Follow-up</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Follow-ups Due Today"
          value={dueToday}
          subtitle="Require attention"
          status="warning"
          trend="neutral"
        />
        <StatCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="Overdue"
          value={overdue}
          subtitle="Missed follow-ups"
          status="negative"
          trend="down"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Completed This Week"
          value={completedThisWeek}
          subtitle="Successfully completed"
          status="positive"
          trend="up"
        />
        <StatCard
          icon={<CalendarCheck className="h-5 w-5" />}
          label="Upcoming (Next 7 Days)"
          value={upcoming}
          subtitle="Scheduled soon"
          status="neutral"
          trend="neutral"
        />
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Follow-up Schedule</CardTitle>
              <CardDescription>Manage all patient follow-ups</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Input
              placeholder="Search patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="due">Due</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={workerFilter} onValueChange={setWorkerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All workers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workers</SelectItem>
                {workers.map(w => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredFollowUps}
            searchable={false}
            emptyMessage="No follow-ups found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
