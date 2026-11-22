'use client'

import { useMemo, useState } from 'react'
import { Search, TestTube2 } from 'lucide-react'
import { facilities } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/toast-provider'

export default function DiagnosticsPage() {
  const [query, setQuery] = useState('')
  const { toast } = useToast()
  const tests = useMemo(() => facilities.flatMap((facility) => facility.diagnostics.map((test) => ({ ...test, facility }))).filter((row) => `${row.name} ${row.facility.name}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <div className="space-y-6"><div><p className="text-sm font-medium text-emerald-700">Demo availability data</p><h1 className="text-3xl font-bold">Diagnostics</h1><p className="mt-1 text-muted-foreground">Find the closest facility with an available test and clear wait estimates.</p></div><div className="relative max-w-xl"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search CBC, ECG, ultrasound or facility" /></div><div className="overflow-hidden rounded-xl border bg-white"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-left text-muted-foreground"><tr><th className="p-4">Test</th><th className="p-4">Facility</th><th className="p-4">Availability</th><th className="p-4">Next slot</th><th className="p-4">Distance</th><th className="p-4" /></tr></thead><tbody>{tests.map((row) => <tr key={`${row.facility.id}-${row.name}`} className="border-t"><td className="p-4 font-medium"><TestTube2 className="mr-2 inline h-4 w-4 text-emerald-600"/>{row.name}</td><td className="p-4">{row.facility.name}</td><td className="p-4"><Badge className={row.available ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>{row.available ? 'Available' : 'Unavailable'}</Badge></td><td className="p-4">{row.nextSlot ?? 'Contact facility'}</td><td className="p-4">{row.facility.distance} km</td><td className="p-4"><Button size="sm" variant="outline" onClick={() => toast(row.available ? `${row.name} selected at ${row.facility.name}.` : `Nearest available alternative is shown in the list.`, row.available ? 'success' : 'warning')}>{row.available ? 'Select' : 'Find alternative'}</Button></td></tr>)}</tbody></table></div></div><p className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">Availability is prototype data and is not connected to live diagnostic systems.</p></div>
}
