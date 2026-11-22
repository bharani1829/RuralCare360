'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, MapPin, Calendar, Heart, Activity, AlertTriangle, Stethoscope, Send } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { referrals, demoJourneySteps } from '@/lib/demo-data'
import { formatDate, formatDateTime } from '@/lib/date-utils'
import { useAppState } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { StatusBadge } from '@/components/status-badge'
import { PatientTimeline } from '@/components/patient-timeline'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientProfilePage(props: Props) {
  const router = useRouter()
  const params = use(props.params)
  const { id } = params
  const { state } = useAppState()
  const { t } = useTranslation()

  const patient = state.patients.find((p) => p.id === id)

  if (!patient) {
    return (
      <div className="space-y-6">
        <Link href="/patients">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Patients
          </Button>
        </Link>
        <Card className="p-12 text-center">
          <p className="text-lg text-gray-600">Patient not found</p>
        </Card>
      </div>
    )
  }

  const patientReferrals = state.referrals.filter((r) => r.patientId === patient.id)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'danger'
      case 'high':
        return 'warning'
      case 'medium':
        return 'info'
      default:
        return 'success'
    }
  }

  const timelineItems = [
    {
      date: formatDate(patient.lastVisit),
      title: 'Last Visit',
      description: `Care stage: ${patient.careStage}`,
      status: 'completed' as const,
      icon: <Calendar className="h-2 w-2" />,
    },
    ...patientReferrals.map((ref) => ({
      date: formatDate(ref.createdAt),
      title: `Referral ${ref.id}`,
      description: `To ${ref.destinationFacility} for ${ref.specialty}`,
      status: (ref.status === 'closed' ? 'completed' : 'current') as 'completed' | 'current',
      icon: <ArrowLeft className="h-2 w-2" />,
    })),
  ].slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
          <p className="mt-1 text-gray-600">{patient.id} • {patient.village}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="space-y-4">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-600">Demographics</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{patient.phone}</span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm text-gray-600">Current Status</p>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Risk Level</p>
                    <StatusBadge
                      status={getRiskColor(patient.riskLevel)}
                      label={patient.riskLevel}
                      size="md"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Care Stage</p>
                    <Badge variant="secondary" className="capitalize">
                      {patient.careStage.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Primary Condition</p>
                <p className="mt-2 font-medium">{patient.primaryCondition}</p>
              </div>
            </div>
          </Card>

          {/* Vitals Card */}
          {patient.vitals && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Latest Vitals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Blood Pressure
                  </span>
                  <span className="font-mono font-semibold">{patient.vitals.bp}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    SpO₂
                  </span>
                  <span className="font-mono font-semibold">{patient.vitals.spo2}%</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-gray-600">Pulse</span>
                  <span className="font-mono font-semibold">{patient.vitals.pulse} bpm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-mono font-semibold">{patient.vitals.temperature}°C</span>
                </div>
                <p className="text-xs text-gray-500 pt-2">
                  Recorded: {formatDateTime(patient.vitals.recordedAt)}
                </p>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                onClick={() => router.push('/triage')}
              >
                <Stethoscope className="w-4 h-4 mr-2 text-emerald-600" />
                Start Triage
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs border-blue-300 text-blue-800 hover:bg-blue-50"
                onClick={() => router.push('/teleconsultation')}
              >
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                Teleconsultation
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs border-teal-300 text-teal-800 hover:bg-teal-50"
                onClick={() => router.push(`/referrals/create?patientId=${patient.id}`)}
              >
                <Send className="w-4 h-4 mr-2 text-teal-600" />
                Create Referral
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Detailed Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
            </TabsList>

            {/* Tab 1: Overview */}
            <TabsContent value="overview" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Medical History</h3>
                <div className="space-y-2">
                  {patient.medicalHistory.length === 0 ? (
                    <p className="text-gray-500">No medical history recorded</p>
                  ) : (
                    patient.medicalHistory.map((condition, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{condition}</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Care Timeline</h3>
                <PatientTimeline items={timelineItems} />
              </Card>
            </TabsContent>

            {/* Tab 2: Referrals */}
            <TabsContent value="referrals" className="space-y-4">
              {patientReferrals.length === 0 ? (
                <Card className="p-6 text-center text-gray-500">No referrals for this patient</Card>
              ) : (
                patientReferrals.map((ref) => (
                  <Card key={ref.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-900">{ref.id}</p>
                        <p className="mt-1 text-gray-600">{ref.reason}</p>
                        <p className="mt-2 text-sm text-gray-500">
                          {ref.sourceFacility} → {ref.destinationFacility}
                        </p>
                      </div>
                      <StatusBadge status={ref.status === 'closed' ? 'success' : 'info'} label={ref.status} />
                    </div>
                    <Link href={`/referrals/${ref.id}`}>
                      <Button variant="outline" size="sm" className="mt-4">
                        View Details
                      </Button>
                    </Link>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Tab 3: Consultations */}
            <TabsContent value="consultations" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Consultations</h3>
                <p className="text-gray-500">No consultations recorded yet</p>
              </Card>
            </TabsContent>

            {/* Tab 4: Vitals */}
            <TabsContent value="vitals" className="space-y-4">
              {patient.vitals ? (
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{patient.vitals.bp}</p>
                        <p className="text-xs text-gray-500">mmHg</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <p className="text-sm text-gray-600">SpO₂</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{patient.vitals.spo2}%</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <p className="text-sm text-gray-600">Pulse</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{patient.vitals.pulse}</p>
                        <p className="text-xs text-gray-500">bpm</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{patient.vitals.temperature}</p>
                        <p className="text-xs text-gray-500">°C</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Last updated: {formatDateTime(patient.vitals.recordedAt)}</p>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center text-gray-500">No vitals recorded</Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
