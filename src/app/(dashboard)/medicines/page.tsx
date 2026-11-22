'use client'

import { useMemo, useState } from 'react'
import { PackageSearch, Search } from 'lucide-react'
import { facilities } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/store'
import { useToast } from '@/components/toast-provider'

const labels = { available: 'Available', low: 'Low stock', critical: 'Critical', 'out-of-stock': 'Out of stock' }
export default function MedicinesPage() {
  const [query, setQuery] = useState(''); const { state, addReplenishmentRequest, addAuditEntry } = useAppState(); const { toast } = useToast()
  const rows = useMemo(() => facilities.flatMap((facility) => facility.medicines.map((medicine) => ({ facility, medicine }))).filter(({ facility, medicine }) => `${facility.name} ${medicine.name}`.toLowerCase().includes(query.toLowerCase())), [query])
  const request = (facilityId: string, medicineName: string) => { const timestamp = new Date().toISOString(); addReplenishmentRequest({ facilityId, medicineName, requestedAt: timestamp, requestedBy: state.currentUser.name }); addAuditEntry({ id: `AUD-${facilityId}-${medicineName}-${timestamp}`, timestamp, user: state.currentUser.name, action: 'Requested medicine replenishment', entityId: medicineName, entityType: 'Medicine', status: 'Requested' }); toast(`Replenishment request sent for ${medicineName}.`, 'success') }
  return <div className="space-y-6"><div><p className="text-sm font-medium text-emerald-700">Demo inventory visibility</p><h1 className="text-3xl font-bold">Medicine availability</h1><p className="mt-1 text-muted-foreground">Monitor stock thresholds across facilities. Live stock integration is not enabled.</p></div><div className="relative max-w-xl"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search medicine or facility" /></div><div className="overflow-hidden rounded-xl border bg-white"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-left text-muted-foreground"><tr><th className="p-4">Medicine</th><th className="p-4">Facility</th><th className="p-4">Stock / threshold</th><th className="p-4">Status</th><th className="p-4">Last updated</th><th className="p-4" /></tr></thead><tbody>{rows.map(({ facility, medicine }) => <tr key={`${facility.id}-${medicine.name}`} className="border-t"><td className="p-4 font-medium"><PackageSearch className="mr-2 inline h-4 w-4 text-emerald-600"/>{medicine.name}</td><td className="p-4">{facility.name}</td><td className="p-4">{medicine.stock} / {medicine.threshold} units</td><td className="p-4"><Badge variant="outline">{labels[medicine.status]}</Badge></td><td className="p-4">Demo data · Today</td><td className="p-4">{state.currentUser.role === 'admin' && medicine.status !== 'available' ? <Button size="sm" onClick={() => request(facility.id, medicine.name)}>Request stock</Button> : <span className="text-xs text-muted-foreground">{state.currentUser.role === 'admin' ? 'No action needed' : 'Admin action'}</span>}</td></tr>)}</tbody></table></div></div>{state.replenishmentRequests.length > 0 && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{state.replenishmentRequests.length} replenishment request(s) created in this session.</p>}</div>
}
