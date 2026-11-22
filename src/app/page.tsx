'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  HeartPulse,
  Activity,
  MapPin,
  ClipboardList,
  AlertTriangle,
  FileMinus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CarePipeline } from '@/components/care-pipeline';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white shadow-sm">
              RC
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              RuralCare 360
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link href="#problem" className="hover:text-emerald-600">The Problem</Link>
            <Link href="#solution" className="hover:text-emerald-600">Solution</Link>
            <Link href="#journey" className="hover:text-emerald-600">Patient Journey</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Explore Platform</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-emerald-900 px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
          <div className="relative mx-auto max-w-4xl space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              From first contact <br className="hidden sm:block" />
              <span className="text-emerald-300">to completed care.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-emerald-100">
              Connecting patients, frontline workers, doctors and health facilities into one continuous rural healthcare journey.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="w-full bg-white text-emerald-900 hover:bg-emerald-50 sm:w-auto font-semibold">
                  Explore Platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#journey">
                <Button size="lg" variant="outline" className="w-full border-emerald-400 text-white hover:bg-emerald-800 bg-transparent sm:w-auto">
                  View Patient Journey
                </Button>
              </Link>
            </div>

            <div className="mx-auto mt-16 max-w-5xl rounded-xl bg-white p-6 shadow-2xl">
              <CarePipeline
                stages={[
                  { label: 'Registered', count: 1, status: 'active' },
                  { label: 'Triage', count: 2, status: 'active' },
                  { label: 'Consult', count: 3, status: 'active' },
                  { label: 'Referral', count: 4, status: 'active' },
                  { label: 'Diagnostic', count: 5, status: 'active' },
                  { label: 'Treatment', count: 6, status: 'active' },
                  { label: 'Follow-up', count: 7, status: 'inactive' },
                  { label: 'Closed', count: 8, status: 'inactive' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section id="problem" className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Healthcare services exist, but patients experience fragmented care
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                The core challenge in rural healthcare isn&apos;t just access&mdash;it&apos;s continuity and tracking.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 text-center">
              {[
                { icon: MapPin, title: 'Long Travel', desc: 'Patients travel 30-50km for specialist care' },
                { icon: ClipboardList, title: 'Fragmented', desc: 'History scattered across facilities' },
                { icon: FileMinus, title: 'Missed Referrals', desc: '40% of referrals never complete' },
                { icon: Activity, title: 'Missing Tests', desc: 'Diagnostics not available when needed' },
                { icon: AlertTriangle, title: 'Lost Patients', desc: 'Patients lost after initial treatment' },
              ].map((problem, i) => (
                <div key={i} className="flex flex-col items-center rounded-xl bg-white p-6 shadow-sm border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
                    <problem.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{problem.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Existing Ecosystem */}
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 text-center border-t">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-6">
              <HeartPulse className="h-4 w-4" />
              Orchestration, not replacement
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Strengthening existing infrastructure
            </h2>
            <p className="mt-4 text-xl text-gray-600 font-medium">
              RuralCare 360 is designed to strengthen existing public-health infrastructure—not replace it. We act as the closed-loop orchestration layer.
            </p>
          </div>
        </section>

        {/* Core Innovation */}
        <section id="solution" className="bg-gray-900 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  The Core Innovation:<br/>
                  <span className="text-emerald-400">Closed-Loop Referrals</span>
                </h2>
                <p className="mt-6 text-lg text-gray-300">
                  Existing systems generate a referral, and the patient leaves the system. RuralCare 360 tracks the patient until care is actually delivered and follow-up is complete.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    'Dynamic facility matching based on service availability',
                    'Visibility into medicine and diagnostic stock before referral',
                    'Automated follow-up tasks for frontline health workers',
                    'Offline-first architecture for low-connectivity areas',
                  ].map((feature, i) => (
                    <li key={i} className="flex gap-3 text-gray-300">
                      <CheckCircle className="h-6 w-6 text-emerald-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white/5 p-8 border border-white/10 shadow-2xl backdrop-blur-sm relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl pointer-events-none"></div>
                <h3 className="text-xl font-semibold text-white mb-6">Referral REF-10234 Pipeline</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Referral created by Dr. Kumar', done: true },
                    { label: 'Accepted by District Hospital', done: true },
                    { label: 'Patient arrived & registered', done: true },
                    { label: 'ECG diagnostic completed', done: true },
                    { label: 'Specialist consultation complete', done: true },
                    { label: 'Treatment provided', done: true },
                    { label: 'ASHA Follow-up completed', done: true, highlight: 'text-emerald-400' },
                    { label: 'CASE CLOSED', done: true, highlight: 'text-white font-bold' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1 border-b border-white/10 pb-4">
                        <p className={cn("text-gray-300", step.highlight)}>{step.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 className="text-3xl font-bold text-white">Make every referral count.</h2>
            <Link href="/login" className="inline-block">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold px-8 h-14 text-lg">
                Enter Prototype Demo
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12 text-center text-sm text-gray-500">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-600 font-bold text-white text-[10px]">
            RC
          </div>
          <span className="font-bold text-gray-900">RuralCare 360</span>
        </div>
        <p>Built for Smart India Hackathon 2026</p>
        <p className="mt-2 text-xs">Demo prototype — not a live healthcare system. Uses fictional data.</p>
      </footer>
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
