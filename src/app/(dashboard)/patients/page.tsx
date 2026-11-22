'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Plus, UserPlus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useAppState } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { StatusBadge } from '@/components/status-badge'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/toast-provider'
import { Patient } from '@/lib/demo-data'
import { PatientCareJourney } from '@/components/patient-care-journey'

export default function PatientsPage() {
  const { state, addPatient, addAuditEntry } = useAppState()
  const { t } = useTranslation()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')

  // Register Patient Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female')
  const [phone, setPhone] = useState('')
  const [village, setVillage] = useState('PHC A - Rampur')
  const [primaryCondition, setPrimaryCondition] = useState('')
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low')
  const [assignedWorker, setAssignedWorker] = useState('')

  const filteredPatients = useMemo(() => {
    if (state.currentUser.role === 'patient') {
      const myMatch = state.patients.filter(
        (p) =>
          p.name.toLowerCase() === state.currentUser.name.toLowerCase() ||
          p.id === state.currentUser.workerId ||
          p.phone === state.currentUser.mobile
      );
      if (myMatch.length > 0) return myMatch;
    }

    return state.patients.filter((patient) => {
      const matchesSearch =
        searchTerm === '' ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.village.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStage = filterStage === 'all' || patient.careStage === filterStage
      const matchesRisk = filterRisk === 'all' || patient.riskLevel === filterRisk

      return matchesSearch && matchesStage && matchesRisk
    })
  }, [state.patients, searchTerm, filterStage, filterRisk])

  const handleRegisterPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast('Patient full name is required.', 'warning')
      return
    }

    if (!age || Number(age) <= 0) {
      toast('Please enter a valid patient age.', 'warning')
      return
    }

    const newId = `P-${Math.floor(1000 + Math.random() * 9000)}`
    const now = new Date().toISOString()
    const today = now.split('T')[0]

    const newPatient: Patient = {
      id: newId,
      name: name.trim(),
      age: Number(age),
      gender: gender,
      phone: phone.trim() || '9876543210',
      village: village.trim() || 'PHC A - Rampur',
      assignedWorker: assignedWorker.trim() || state.currentUser.name || 'Asha Lakshmi',
      riskLevel: riskLevel,
      careStage: 'registered',
      primaryCondition: primaryCondition.trim() || 'Routine Health Screening',
      lastVisit: today,
      nextFollowUp: 'In 7 days',
      medicalHistory: primaryCondition.trim() ? [primaryCondition.trim()] : ['Routine Health Screening'],
      vitals: {
        bp: '120/80',
        spo2: 98,
        pulse: 72,
        temperature: 36.8,
        recordedAt: now,
      },
    }

    addPatient(newPatient)

    addAuditEntry({
      id: `AUD-${Date.now()}`,
      timestamp: now,
      user: state.currentUser.name,
      action: 'Registered patient',
      entityId: newId,
      entityType: 'Patient',
      status: 'Registered',
    })

    toast(`Patient ${name.trim()} (${newId}) registered successfully!`, 'success')

    // Reset form
    setName('')
    setAge('')
    setPhone('')
    setPrimaryCondition('')
    setIsRegisterOpen(false)
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients Directory</h1>
          <p className="mt-1 text-gray-600">Manage rural health beneficiaries, vitals, and care stages</p>
        </div>
        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          Register New Patient
        </Button>
      </div>

      {/* Patient End-to-End Care Journey & Disease Registration Workflow */}
      {state.currentUser.role === 'patient' && (
        <div className="mb-6">
          <PatientCareJourney />
        </div>
      )}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by ID, name, or village..."
              className="pl-10 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Care Stage Filter */}
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-40 text-xs">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Stages</SelectItem>
              <SelectItem value="registered" className="text-xs">Registered</SelectItem>
              <SelectItem value="triaged" className="text-xs">Triaged</SelectItem>
              <SelectItem value="consulted" className="text-xs">Consulted</SelectItem>
              <SelectItem value="referred" className="text-xs">Referred</SelectItem>
              <SelectItem value="appointment" className="text-xs">Appointment</SelectItem>
              <SelectItem value="arrived" className="text-xs">Arrived</SelectItem>
              <SelectItem value="treated" className="text-xs">Treated</SelectItem>
              <SelectItem value="follow-up" className="text-xs">Follow-up</SelectItem>
              <SelectItem value="closed" className="text-xs">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Risk Level Filter */}
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-40 text-xs">
              <SelectValue placeholder="All Risk Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Levels</SelectItem>
              <SelectItem value="low" className="text-xs">Low</SelectItem>
              <SelectItem value="medium" className="text-xs">Medium</SelectItem>
              <SelectItem value="high" className="text-xs">High</SelectItem>
              <SelectItem value="critical" className="text-xs">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Patients Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-gray-900">Patient ID</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-900">Name</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-900">Age / Gender</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-900">Village / Center</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-900">Condition</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-900">Risk Level</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-900">Stage</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No matching patients found. Click &quot;Register New Patient&quot; above to add one.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, idx) => (
                  <tr key={patient.id} className={cn(idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70', 'border-b hover:bg-emerald-50/50 transition-colors')}>
                    <td className="px-5 py-3.5 font-mono text-gray-900 font-semibold">{patient.id}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{patient.name}</td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {patient.age} yrs / {patient.gender}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{patient.village}</td>
                    <td className="px-5 py-3.5 text-gray-600">{patient.primaryCondition}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={getRiskColor(patient.riskLevel)} label={patient.riskLevel.toUpperCase()} size="sm" />
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="secondary" className="capitalize text-[10px]">
                        {patient.careStage.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/patients/${patient.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50">
                          View Profile
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Footer */}
      <div className="text-xs text-gray-500 flex items-center justify-between">
        <span>Showing {filteredPatients.length} of {state.patients.length} registered beneficiaries</span>
        <span>Continuum Sync: Active</span>
      </div>

      {/* REGISTER PATIENT DIALOG MODAL */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <UserPlus className="h-5 w-5 text-emerald-600" /> Register New Patient
            </DialogTitle>
            <DialogDescription className="text-xs">
              Enter patient details to register a new beneficiary in RuralCare 360.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegisterPatientSubmit} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="regName" className="text-xs font-semibold text-gray-700">Full Name *</Label>
                <Input
                  id="regName"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="regAge" className="text-xs font-semibold text-gray-700">Age *</Label>
                <Input
                  id="regAge"
                  type="number"
                  placeholder="e.g. 35"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="regGender" className="text-xs font-semibold text-gray-700">Gender *</Label>
                <Select value={gender} onValueChange={(val) => setGender(val as any)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female" className="text-xs">Female</SelectItem>
                    <SelectItem value="male" className="text-xs">Male</SelectItem>
                    <SelectItem value="other" className="text-xs">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="regPhone" className="text-xs font-semibold text-gray-700">Mobile Phone</Label>
                <Input
                  id="regPhone"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="regVillage" className="text-xs font-semibold text-gray-700">Village / PHC Subcenter</Label>
                <Input
                  id="regVillage"
                  placeholder="e.g. Rampur"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="regRisk" className="text-xs font-semibold text-gray-700">Initial Risk Level</Label>
                <Select value={riskLevel} onValueChange={(val) => setRiskLevel(val as any)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-xs text-green-700 font-semibold">Low</SelectItem>
                    <SelectItem value="medium" className="text-xs text-blue-700 font-semibold">Medium</SelectItem>
                    <SelectItem value="high" className="text-xs text-amber-700 font-semibold">High</SelectItem>
                    <SelectItem value="critical" className="text-xs text-red-700 font-bold">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="regCondition" className="text-xs font-semibold text-gray-700">Primary Health Complaint / Condition</Label>
              <Input
                id="regCondition"
                placeholder="e.g. Chronic hypertension, persistent fever, antenatal checkup"
                value={primaryCondition}
                onChange={(e) => setPrimaryCondition(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)} className="text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 shadow-sm">
                <Check className="h-4 w-4 mr-1.5" /> Save Patient Registration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
