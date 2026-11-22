'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, Search, SlidersHorizontal, Stethoscope } from 'lucide-react'
import { facilities } from '@/lib/demo-data'
import { FacilityCard } from '@/components/facility-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/toast-provider'

export default function FacilitiesPage() {
  const [query, setQuery] = useState('')
  const [service, setService] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const filtered = useMemo(() => facilities.filter((facility) => {
    const text = `${facility.name} ${facility.type} ${facility.doctors.map((d) => d.specialty).join(' ')} ${facility.diagnostics.map((d) => d.name).join(' ')}`.toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    const matchesService = service === 'all' || facility.doctors.some((d) => d.specialty.toLowerCase().includes(service)) || facility.diagnostics.some((d) => d.name.toLowerCase() === service)
    return matchesQuery && matchesService
  }).map((facility) => ({ ...facility, matchScore: Math.max(62, 100 - facility.distance - facility.queueLength) })), [query, service])

  const chooseFacility = (id: string) => {
    setSelectedId(id)
    toast('Facility selected. Continue to create a referral.', 'success')
  }

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><p className="text-sm font-medium text-emerald-700">Integration-ready facility directory</p><h1 className="text-3xl font-bold">Facility Finder</h1><p className="mt-1 text-muted-foreground">Match services, capacity and distance using fictional demo data.</p></div>
      <Button onClick={() => router.push('/referrals/create')}><Stethoscope className="mr-2 h-4 w-4" />Create referral</Button>
    </div>
    <div className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-[1fr_220px]">
      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search facilities" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search facility, specialty or diagnostic" /></div>
      <Select value={service} onValueChange={(value) => setService(value ?? 'all')}><SelectTrigger><SlidersHorizontal className="mr-2 h-4 w-4" /><SelectValue placeholder="Required service" /></SelectTrigger><SelectContent><SelectItem value="all">All services</SelectItem><SelectItem value="cardiology">Cardiology</SelectItem><SelectItem value="ecg">ECG</SelectItem><SelectItem value="ultrasound">Ultrasound</SelectItem><SelectItem value="cbc">CBC</SelectItem></SelectContent></Select>
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
      <div className="grid gap-4 lg:grid-cols-2">{filtered.map((facility, index) => <FacilityCard key={facility.id} name={facility.name} type={facility.type} distance={facility.distance} doctorAvailable={facility.doctors.some((d) => d.available)} diagnosticsAvailable={facility.diagnostics.filter((d) => d.available).map((d) => d.name)} diagnosticsUnavailable={facility.diagnostics.filter((d) => !d.available).map((d) => d.name)} medicineAvailable={facility.medicines.some((m) => m.status === 'available')} queueLength={facility.queueLength} status={facility.status} matchScore={facility.matchScore} recommended={index === 0} onSelect={() => chooseFacility(facility.id)} />)}</div>
      <aside className="rounded-xl border bg-white p-5"><div className="flex items-center gap-2 font-semibold"><MapPin className="h-5 w-5 text-emerald-600" />Service coverage</div><p className="mt-2 text-sm text-muted-foreground">Simulated map view for this prototype. Live availability requires facility-system integrations.</p><div className="relative mt-5 h-72 overflow-hidden rounded-lg bg-emerald-50"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }} />{facilities.map((f, i) => <button key={f.id} title={f.name} onClick={() => chooseFacility(f.id)} className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg" style={{ left: `${20 + i * 28}%`, top: `${25 + i * 23}%` }}><Building2 className="h-4 w-4" /></button>)}</div>{selectedId && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Selected: {facilities.find((f) => f.id === selectedId)?.name}</p>}</aside>
    </div>
  </div>
}
