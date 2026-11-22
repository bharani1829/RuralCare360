/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { facilities, Patient } from '@/lib/demo-data'
import { StatusBadge } from '@/components/status-badge'
import { format, addDays } from 'date-fns'
import { ChevronLeft, Check, ArrowRight, Building2, User } from 'lucide-react'
import { useAppState } from '@/lib/store'
import { useToast } from '@/components/toast-provider'
import React from 'react'

const specialties = ['General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Surgery', 'ENT', 'Ophthalmology']
const diagnosticTests = ['CBC', 'Blood glucose', 'ECG', 'X-ray', 'Ultrasound', 'CT', 'MRI', 'Pathology']

export default function CreateReferralPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramPatientId = searchParams.get('patientId')
  const paramReason = searchParams.get('reason')

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [openPatientSelect, setOpenPatientSelect] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<typeof facilities[0] | null>(facilities[0] || null)

  // Form Fields State
  const [reason, setReason] = useState(paramReason ? decodeURIComponent(paramReason) : '')
  const [specialty, setSpecialty] = useState('General')
  const [selectedDiagnostics, setSelectedDiagnostics] = useState<string[]>([])
  const [urgency, setUrgency] = useState<'routine' | 'priority' | 'emergency'>('routine')
  const [notes, setNotes] = useState('')

  const { state, addReferral, addAuditEntry } = useAppState()
  const { toast } = useToast()

  // Pre-select patient if query param present
  useEffect(() => {
    if (paramPatientId && state.patients.length > 0) {
      const match = state.patients.find((p) => p.id === paramPatientId)
      if (match) {
        setSelectedPatient(match)
      }
    }
    if (paramReason) {
      setReason(decodeURIComponent(paramReason))
    }
  }, [paramPatientId, paramReason, state.patients])

  const calculateMatchScore = (facility: typeof facilities[0]) => {
    let score = 50
    if (specialty && facility.doctors.some((d) => d.specialty.toLowerCase().includes(specialty.toLowerCase()))) {
      score += 25
    }
    if (selectedDiagnostics.length > 0) {
      const availableDiags = selectedDiagnostics.filter((test) =>
        facility.diagnostics.some((d) => d.name === test && d.available),
      )
      score += Math.round((availableDiags.length / selectedDiagnostics.length) * 15)
    }
    if (urgency === 'emergency') {
      score += 10
    }
    return Math.min(score, 100)
  }

  const recommendedFacilities = useMemo(() => {
    return [...facilities].sort((a, b) => calculateMatchScore(b) - calculateMatchScore(a))
  }, [specialty, selectedDiagnostics, urgency])

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient) {
      toast('Please select a patient before creating referral.', 'warning')
      setStep(1)
      return
    }

    if (!selectedFacility) {
      toast('Please select a destination facility.', 'warning')
      setStep(3)
      return
    }

    const id = `REF-${Date.now().toString().slice(-6)}`
    const now = new Date().toISOString()
    const apptDate = addDays(new Date(), urgency === 'emergency' ? 1 : urgency === 'priority' ? 3 : 7).toISOString()

    addReferral({
      id,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      reason: reason || 'Specialist Consultation Required',
      specialty: specialty,
      diagnosticTests: selectedDiagnostics,
      urgency: urgency,
      status: 'created',
      sourceFacility: state.currentUser.facility || 'PHC A - Rampur',
      destinationFacility: selectedFacility.name,
      createdAt: now,
      appointmentDate: apptDate,
      timeline: [
        {
          status: 'created',
          timestamp: now,
          facility: state.currentUser.facility || 'PHC A - Rampur',
          user: `${state.currentUser.name} (${state.currentUser.role})`,
          notes: notes || 'Referral created and logged in Care Continuum system.',
        },
      ],
    })

    addAuditEntry({
      id: `AUD-${Date.now()}`,
      timestamp: now,
      user: state.currentUser.name,
      action: 'Created referral',
      entityId: id,
      entityType: 'Referral',
      status: 'Created',
    })

    toast(`Referral ${id} created and dispatched successfully!`, 'success')
    router.push('/referrals')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        {step > 1 && (
          <Button type="button" variant="outline" size="icon" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Patient Referral</h1>
          <p className="text-sm text-gray-500">Step {step} of 4 &mdash; Continuum Referral Dispatch</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-6">
        {/* Step 1: Patient Selection */}
        {step === 1 && (
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" /> 1. Select Patient
              </h2>
              <p className="text-xs text-gray-500">Choose the patient who requires specialist care or facility referral.</p>
            </div>

            <Popover open={openPatientSelect} onOpenChange={setOpenPatientSelect}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-start text-left h-11 text-sm border-gray-300">
                  {selectedPatient ? `${selectedPatient.name} (ID: ${selectedPatient.id} • ${selectedPatient.village})` : '🔍 Search patient by name, ID, or village...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[480px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search registered patients..." />
                  <CommandEmpty>No registered patient found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {state.patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          onSelect={() => {
                            setSelectedPatient(patient)
                            setOpenPatientSelect(false)
                          }}
                          className="cursor-pointer p-2.5"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{patient.name}</div>
                            <div className="text-xs text-gray-500">{patient.id} • {patient.age} yrs • {patient.gender} • {patient.village}</div>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{patient.riskLevel}</Badge>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedPatient && (
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <div className="font-bold text-emerald-950 text-sm">{selectedPatient.name}</div>
                  <StatusBadge
                    status={selectedPatient.riskLevel === 'critical' ? 'critical' : selectedPatient.riskLevel === 'high' ? 'danger' : selectedPatient.riskLevel === 'medium' ? 'warning' : 'success'}
                    label={selectedPatient.riskLevel.toUpperCase()}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Patient ID</span>
                    <span className="font-mono font-semibold text-gray-800">{selectedPatient.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Age / Gender</span>
                    <span className="font-semibold text-gray-800">{selectedPatient.age} yrs / {selectedPatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Village</span>
                    <span className="font-semibold text-gray-800">{selectedPatient.village}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block">Primary Condition</span>
                    <span className="font-semibold text-gray-800">{selectedPatient.primaryCondition}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="button"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
              disabled={!selectedPatient}
              onClick={() => {
                if (selectedPatient) setStep(2)
                else toast('Please select a patient to continue.', 'warning')
              }}
            >
              Continue to Referral Details &rarr;
            </Button>
          </Card>
        )}

        {/* Step 2: Referral Details */}
        {step === 2 && (
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">2. Clinical Clinical Reason &amp; Specialty</h2>
              <p className="text-xs text-gray-500">Provide medical details for the referral destination.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-xs font-semibold text-gray-700">Reason for Referral *</Label>
              <Textarea
                id="reason"
                placeholder="Describe clinical symptoms, examination findings, diagnosis, and justification..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-24 text-xs"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="specialty" className="text-xs font-semibold text-gray-700">Required Specialty *</Label>
                <Select value={specialty} onValueChange={(val) => setSpecialty(val)}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Select specialty..." />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Urgency Level *</Label>
                <RadioGroup value={urgency} onValueChange={(val) => setUrgency(val as any)} className="flex items-center gap-4 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="routine" id="routine" />
                    <Label htmlFor="routine" className="text-xs cursor-pointer">Routine</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="priority" id="priority" />
                    <Label htmlFor="priority" className="text-xs text-amber-700 font-semibold cursor-pointer">Priority</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="emergency" id="emergency" />
                    <Label htmlFor="emergency" className="text-xs text-red-600 font-bold cursor-pointer">Emergency</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <Label className="text-xs font-semibold text-gray-700 block">Required Diagnostic Tests (Optional)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {diagnosticTests.map((test) => (
                  <label key={test} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-slate-50 text-xs cursor-pointer hover:bg-slate-100">
                    <Checkbox
                      checked={selectedDiagnostics.includes(test)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDiagnostics([...selectedDiagnostics, test])
                        } else {
                          setSelectedDiagnostics(selectedDiagnostics.filter((t) => t !== test))
                        }
                      }}
                    />
                    <span>{test}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="button"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
              onClick={() => {
                if (!reason || reason.trim().length < 5) {
                  toast('Please enter a referral reason (at least 5 characters).', 'warning')
                  return
                }
                setStep(3)
              }}
            >
              Select Destination Facility &rarr;
            </Button>
          </Card>
        )}

        {/* Step 3: Facility Selection */}
        {step === 3 && (
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" /> 3. Select Destination Facility
              </h2>
              <p className="text-xs text-gray-500">
                Facilities ordered by AI match score based on specialty availability, bed status &amp; distance.
              </p>
            </div>

            <div className="space-y-3">
              {recommendedFacilities.map((fac, idx) => {
                const score = calculateMatchScore(fac)
                const isSelected = selectedFacility?.id === fac.id
                return (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm">{fac.name}</h3>
                          <Badge variant="outline" className="text-[10px]">{fac.type}</Badge>
                          {idx === 0 && <Badge className="bg-emerald-600 text-[10px]">Best Match</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{fac.distance} km away • District Healthcare Hub</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-emerald-700">{score}%</div>
                        <div className="text-[10px] text-gray-400">Match Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Specialists</span>
                        <span className="font-semibold text-emerald-800">✓ {fac.doctors.length} Doctors</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Est. Wait</span>
                        <span className="font-semibold text-gray-800">{fac.queueLength} mins</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Status</span>
                        <span className="font-semibold text-emerald-700 capitalize">{fac.status}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button
              type="button"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
              disabled={!selectedFacility}
              onClick={() => {
                if (selectedFacility) setStep(4)
                else toast('Please select a facility.', 'warning')
              }}
            >
              Review Referral Summary &rarr;
            </Button>
          </Card>
        )}

        {/* Step 4: Summary & Confirmation */}
        {step === 4 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">4. Review &amp; Confirm Referral</h2>
              <p className="text-xs text-gray-500">Verify referral details before sending to destination facility.</p>
            </div>

            <div className="space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-xl text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 block">Patient Name</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedPatient?.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Patient ID</span>
                  <span className="font-mono font-semibold text-gray-900">{selectedPatient?.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Required Specialty</span>
                  <span className="font-semibold text-emerald-800">{specialty}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Urgency</span>
                  <StatusBadge
                    status={urgency === 'emergency' ? 'danger' : urgency === 'priority' ? 'warning' : 'info'}
                    label={urgency.toUpperCase()}
                  />
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Referral Reason</span>
                  <p className="font-medium text-gray-800 bg-white p-2.5 rounded border border-gray-200 mt-1">{reason}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Destination Facility</span>
                  <span className="font-bold text-emerald-950 text-sm">{selectedFacility?.name}</span>
                </div>
                {selectedDiagnostics.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-gray-500 block">Requested Tests</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDiagnostics.map((d) => (
                        <Badge key={d} variant="secondary" className="text-[10px]">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes" className="text-xs font-semibold text-gray-700">Additional Clinical Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any special instructions for destination facility staff..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(3)} className="h-11 px-5 text-xs">
                Back
              </Button>
              <Button type="submit" className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
                <Check className="h-4 w-4 mr-2" /> Dispatch Referral Now
              </Button>
            </div>
          </Card>
        )}
      </form>
    </div>
  )
}
