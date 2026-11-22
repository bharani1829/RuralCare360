'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const AuditLog = () => {
  const { t } = useTranslation();

  const auditEntries = [
    {
      id: '1',
      timestamp: format(new Date(Date.now() - 30 * 60 * 1000), 'MMM dd, yyyy HH:mm'),
      user: 'ASHA-17 (Priya Singh)',
      action: 'create',
      entity: 'Patient: P-1042',
      details: 'Ravi Kumar registered',
      status: 'success',
    },
    {
      id: '2',
      timestamp: format(new Date(Date.now() - 25 * 60 * 1000), 'MMM dd, yyyy HH:mm'),
      user: 'ASHA-17 (Priya Singh)',
      action: 'create',
      entity: 'Vitals: P-1042',
      details: 'BP 178/104, SpO2 91 recorded',
      status: 'success',
    },
    {
      id: '3',
      timestamp: format(new Date(Date.now() - 20 * 60 * 1000), 'MMM dd, yyyy HH:mm'),
      user: 'ASHA-17 (Priya Singh)',
      action: 'create',
      entity: 'Triage: P-1042',
      details: 'Priority: RED (High-risk)',
      status: 'success',
    },
    {
      id: '4',
      timestamp: format(new Date(Date.now() - 15 * 60 * 1000), 'MMM dd, yyyy HH:mm'),
      user: 'Dr. Rajesh Kumar',
      action: 'view',
      entity: 'Patient: P-1042',
      details: 'Teleconsultation accessed',
      status: 'success',
    },
    {
      id: '5',
      timestamp: format(new Date(Date.now() - 10 * 60 * 1000), 'MMM dd, yyyy HH:mm'),
      user: 'Dr. Rajesh Kumar',
      action: 'create',
      entity: 'Referral: REF-10234',
      details: 'Cardiology + ECG to District Hospital',
      status: 'success',
    },
    {
      id: '6',
      timestamp: format(new Date(Date.now() - 5 * 60 * 1000), 'MMM dd, yyyy HH:mm'),
      user: 'Facility Admin',
      action: 'update',
      entity: 'Referral: REF-10234',
      details: 'Status updated: Appointment booked for Sep 1',
      status: 'success',
    },
    {
      id: '7',
      timestamp: format(new Date(Date.now() - 2 * 60 * 1000), 'MMM dd, yyyy HH:mm'),
      user: 'Facility Staff',
      action: 'view',
      entity: 'Patient: P-1042',
      details: 'Patient arrived for appointment',
      status: 'success',
    },
  ];

  const getActionBadge = (action: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      view: 'secondary',
      create: 'default',
      update: 'outline',
      delete: 'destructive',
    };
    const labels: Record<string, string> = {
      view: 'View',
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
    };
    return (
      <Badge variant={variants[action] || 'secondary'}>
        {labels[action] || action}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (value: string) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'user',
      header: 'User',
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (value: string) => getActionBadge(value),
    },
    {
      key: 'entity',
      header: 'Entity',
      render: (value: string) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'details',
      header: 'Details',
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'success' ? 'default' : 'destructive'} className="capitalize">
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-healthcare-green" />
          Security Audit Log
        </h1>
        <p className="text-muted-foreground mt-2">
          HIPAA & ABDM compliance tracking protocol
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input type="date" defaultValue={format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')} />
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Input type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
            </div>

            {/* User Filter */}
            <div className="space-y-2">
              <Label>User</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="asha-17">ASHA-17 (Priya Singh)</SelectItem>
                  <SelectItem value="dr-rajesh">Dr. Rajesh Kumar</SelectItem>
                  <SelectItem value="facility-admin">Facility Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Type Filter */}
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entity Type Filter */}
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <p className="text-sm text-muted-foreground">
            All user actions and system events are logged for compliance
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={auditEntries} />
        </CardContent>
      </Card>

      {/* Compliance Note */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-base text-green-900">Compliance Information</CardTitle>
        </CardHeader>
        <CardContent className="text-green-800 space-y-2 text-sm">
          <p>
            This audit log maintains a complete record of all access to patient data and system modifications for
            regulatory compliance. All entries are immutable and timestamped.
          </p>
          <div className="mt-3 space-y-1 ml-4">
            <p>✓ HIPAA-compliant access logging</p>
            <p>✓ ABDM interoperability standards compatible</p>
            <p>✓ All PII access tracked</p>
            <p>✓ System modifications documented</p>
            <p>✓ Audit logs retained for 7 years</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
