/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { referrals } from '@/lib/demo-data'
import { format, differenceInDays } from 'date-fns'
import { AlertTriangle, Users } from 'lucide-react'

export default function MissedReferralsPage() {
  const router = useRouter()
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [daysOverdueFilter, setDaysOverdueFilter] = useState<string>('all')
  const [facilityFilter, setFacilityFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const missedReferrals = referrals.filter((r) => r.status === 'missed')

  const filtered = missedReferrals.filter((r) => {
    if (priorityFilter !== 'all' && r.urgency !== priorityFilter) return false
    if (facilityFilter !== 'all' && r.sourceFacility !== facilityFilter) return false

    if (daysOverdueFilter !== 'all' && r.appointmentDate) {
      const overdue = differenceInDays(new Date(), new Date(r.appointmentDate))
      if (daysOverdueFilter === '1-3' && (overdue < 1 || overdue > 3)) return false
      if (daysOverdueFilter === '4-7' && (overdue < 4 || overdue > 7)) return false
      if (daysOverdueFilter === '7+' && overdue < 7) return false
    }

    return true
  })

  const handleBulkOutreach = () => {
    console.log('Generating outreach tasks for:', selectedIds)
    alert(`Generating ${selectedIds.length} outreach tasks...`)
  }

  const handleBulkEscalate = () => {
    console.log('Escalating to supervisors:', selectedIds)
    alert(`Escalating ${selectedIds.length} cases to supervisors...`)
  }

  const columns = [
    {
      key: 'select',
      header: '',
      render: (_: unknown, row: typeof missedReferrals[0]) => (
        <Checkbox
          checked={selectedIds.includes(row.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedIds([...selectedIds, row.id])
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== row.id))
            }
          }}
        />
      ),
    },
    {
      key: 'id',
      header: 'Referral ID',
      sortable: true,
    },
    {
      key: 'patientName',
      header: 'Patient',
      render: (val: string, row: typeof missedReferrals[0]) => (
        <button
          onClick={() => router.push(`/patients/${row.patientId}`)}
          className="text-blue-600 hover:underline font-medium"
        >
          {val}
        </button>
      ),
      sortable: true,
    },
    {
      key: 'reason',
      header: 'Condition',
      render: (val: string) => (
        <div className="max-w-xs truncate" title={val}>
          {val}
        </div>
      ),
    },
    {
      key: 'urgency',
      header: 'Priority',
      render: (val: string) => (
        <StatusBadge
          status={val === 'emergency' ? 'danger' : val === 'priority' ? 'warning' : 'info'}
          label={val.charAt(0).toUpperCase() + val.slice(1)}
          size="sm"
        />
      ),
      sortable: true,
    },
    {
      key: 'appointmentDate',
      header: 'Expected Date',
      render: (val: string | undefined) => (val ? format(new Date(val), 'PP') : '—'),
      sortable: true,
    },
    {
      key: 'daysOverdue',
      header: 'Days Overdue',
      render: (_: unknown, row: typeof missedReferrals[0]) => {
        if (!row.appointmentDate) return '—'
        const overdue = differenceInDays(new Date(), new Date(row.appointmentDate))
        return (
          <span className={overdue > 5 ? 'font-bold text-red-600' : 'text-gray-600'}>
            {overdue} days
          </span>
        )
      },
      sortable: true,
    },
    {
      key: 'timeline',
      header: 'Last Contact',
      render: (_: unknown, row: typeof missedReferrals[0]) => {
        const lastEntry = row.timeline[row.timeline.length - 1]
        return lastEntry ? format(new Date(lastEntry.timestamp), 'PP p') : '—'
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: typeof missedReferrals[0]) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => console.log('Outreach', row.id)}>
            <Users className="h-3 w-3 mr-1" />
            Outreach
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push(`/referrals/${row.id}`)}>
            View
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Missed Referrals & Outreach</h1>
          <p className="text-muted-foreground">Track and escalate missed appointments</p>
        </div>
      </div>

      {/* Alert Banner */}
      {missedReferrals.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">
                {missedReferrals.length} patient{missedReferrals.length > 1 ? 's have' : ' has'} missed scheduled
                referrals or follow-ups
              </p>
              <p className="text-sm text-red-700">Immediate outreach and escalation recommended</p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Days Overdue</label>
            <Select value={daysOverdueFilter} onValueChange={setDaysOverdueFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="1-3">1-3 days</SelectItem>
                <SelectItem value="4-7">4-7 days</SelectItem>
                <SelectItem value="7+">7+ days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Facility</label>
            <Select value={facilityFilter} onValueChange={setFacilityFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                <SelectItem value="PHC A - Rampur">PHC A - Rampur</SelectItem>
                <SelectItem value="Rural Hospital B - Devapur">Rural Hospital B</SelectItem>
                <SelectItem value="District Hospital - Central City">District Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setPriorityFilter('all')
                setDaysOverdueFilter('all')
                setFacilityFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-900">
              {selectedIds.length} referral{selectedIds.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleBulkOutreach}>
                <Users className="h-4 w-4 mr-2" />
                Generate Outreach Tasks
              </Button>
              <Button size="sm" variant="outline" onClick={handleBulkEscalate}>
                Escalate to Supervisors
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const highRisk = filtered.filter((r) => r.urgency === 'emergency' || r.urgency === 'priority')
                  setSelectedIds(highRisk.map((r) => r.id))
                }}
              >
                Select High-Risk
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card className="p-6">
        <DataTable
          columns={columns as any}
          data={filtered as any}
          searchable={true}
          searchPlaceholder="Search by patient name or referral ID..."
          emptyMessage="No missed referrals found."
        />
      </Card>

      {/* Escalation Workflow Example */}
      {filtered.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Escalation Workflow Example</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Standard escalation process for missed referrals
          </p>

          <div className="space-y-3">
            {[
              { step: 1, label: 'Reminder sent (SMS)', status: 'completed', time: '5 days ago' },
              { step: 2, label: 'Phone call attempted', status: 'completed', time: '3 days ago (no answer)' },
              { step: 3, label: 'ASHA outreach task created', status: 'completed', time: '2 days ago' },
              { step: 4, label: 'Second reminder', status: 'pending', time: '—' },
              { step: 5, label: 'Supervisor escalation', status: 'pending', time: '—' },
              { step: 6, label: 'Case review', status: 'pending', time: '—' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    item.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.status === 'completed' ? '✓' : item.step}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  {item.time !== '—' && <p className="text-sm text-muted-foreground">{item.time}</p>}
                </div>
                <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                  {item.status === 'completed' ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
