/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { referrals } from '@/lib/demo-data';
import { ArrowRightLeft, Plus, Eye, Pencil } from 'lucide-react';

import { useAppState } from '@/lib/store';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

type ReferralStatus = 'created' | 'accepted' | 'appointment-booked' | 'patient-arrived' | 'consultation-completed' | 'diagnostics-completed' | 'treatment-completed' | 'follow-up' | 'closed' | 'missed';

export default function ReferralsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const canCreate = ROLE_PERMISSIONS[state.currentUser.role]?.features.canCreateReferral;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'all'>('all');

  const filteredReferrals = useMemo(() => {
    return state.referrals.filter(ref => {
      const matchesSearch =
        ref.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.patientName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || ref.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [state.referrals, searchTerm, statusFilter]);

  const getStatusBadgeStatus = (status: ReferralStatus) => {
    const statusMap: Record<ReferralStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'critical'> = {
      'created': 'info',
      'accepted': 'success',
      'appointment-booked': 'info',
      'patient-arrived': 'info',
      'consultation-completed': 'success',
      'diagnostics-completed': 'success',
      'treatment-completed': 'success',
      'follow-up': 'warning',
      'closed': 'success',
      'missed': 'danger',
    };
    return statusMap[status] || 'neutral';
  };

  const getPriorityBadgeStatus = (urgency: string) => {
    if (urgency === 'emergency') return 'critical';
    if (urgency === 'priority') return 'warning';
    return 'success';
  };

  const columns = [
    {
      key: 'id',
      header: 'Referral ID',
      render: (value: string) => <span className="font-mono font-semibold">{value}</span>,
    },
    {
      key: 'patientName',
      header: 'Patient',
      render: (value: unknown, row: typeof referrals[0]) => (
        <button
          onClick={() => router.push(`/patients/${row.patientId}`)}
          className="text-healthcare-green hover:underline font-medium"
        >
          {String(value)}
        </button>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
    },
    {
      key: 'urgency',
      header: 'Priority',
      render: (value: unknown) => (
        <StatusBadge status={getPriorityBadgeStatus(String(value))} label={String(value).charAt(0).toUpperCase() + String(value).slice(1)} />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => (
        <StatusBadge status={getStatusBadgeStatus(value as ReferralStatus)} label={String(value).replace('-', ' ').toUpperCase()} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: typeof referrals[0]) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/referrals/${row.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/referrals/${row.id}?action=update-status`)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referrals Management</h1>
        <p className="text-gray-600 mt-1">Track and manage all patient referrals through the care continuum</p>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search by referral ID or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReferralStatus | 'all')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="appointment-booked">Appointment Booked</SelectItem>
                <SelectItem value="patient-arrived">Patient Arrived</SelectItem>
                <SelectItem value="consultation-completed">Consultation Completed</SelectItem>
                <SelectItem value="diagnostics-completed">Diagnostics Completed</SelectItem>
                <SelectItem value="treatment-completed">Treatment Completed</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {canCreate && (
            <Button onClick={() => router.push('/referrals/create')} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Referral
            </Button>
          )}
        </div>
      </Card>

      {/* Referral Table */}
      {filteredReferrals.length > 0 ? (
        <Card className="p-6">
          <DataTable
            columns={columns as any}
            data={filteredReferrals.map(ref => ({
              ...ref,
              actions: null,
            }))}
            emptyMessage="No referrals found"
          />
        </Card>
      ) : (
        <Card className="p-8">
          <EmptyState
            icon={<ArrowRightLeft className="w-12 h-12 text-gray-300" />}
            title="No Referrals Found"
            description="No referrals match your search criteria"
          />
        </Card>
      )}
    </div>
  );
}
