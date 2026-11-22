'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

import { PatientTimeline } from '@/components/patient-timeline';
import { useTranslation } from '@/lib/i18n';
import { demoJourneySteps } from '@/lib/demo-data';

export default function ClosedLoopPage() {
  const { t } = useTranslation();

  const careQualityData = [
    { metric: t('dashboard.continuity.access'), value: 84 },
    { metric: t('dashboard.continuity.referral'), value: 82 },
    { metric: 'Diagnostics', value: 88 },
    { metric: 'Medicine availability', value: 79 },
    { metric: t('dashboard.continuity.followup'), value: 76 },
    { metric: t('dashboard.continuity.continuity'), value: 83 },
  ];

  const radarData = [
    { subject: t('dashboard.continuity.access'), A: 84, fullMark: 100 },
    { subject: t('dashboard.continuity.referral'), A: 82, fullMark: 100 },
    { subject: 'Diagnostics', A: 88, fullMark: 100 },
    { subject: 'Medicine', A: 79, fullMark: 100 },
    { subject: t('dashboard.continuity.followup'), A: 76, fullMark: 100 },
    { subject: t('dashboard.continuity.continuity'), A: 83, fullMark: 100 },
  ];

  const timelineItems = demoJourneySteps.map((step) => ({
    date: step.timestamp,
    title: step.title,
    description: step.description,
    status: step.status as 'completed' | 'current' | 'upcoming' | 'missed',
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('closedloop.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t('closedloop.subtitle')}
        </p>
      </div>

      {/* Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traditional Healthcare */}
        <Card className="p-6 border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100">
              {t('closedloop.traditional.title')}
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="text-gray-800 dark:text-gray-200">
                {t('closedloop.traditional.step1')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-gray-800 dark:text-gray-200">
                {t('closedloop.traditional.step2')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                ?
              </div>
              <span className="text-gray-600 dark:text-gray-400 italic">
                {t('closedloop.traditional.step3')}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-red-300 dark:border-red-800">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-700 dark:text-red-200">
                {t('closedloop.traditional.outcome')}
              </span>
            </div>
          </div>
        </Card>

        {/* RuralCare 360 */}
        <Card className="p-6 border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
              RuralCare 360
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            {[
              'Referral Created',
              'Accepted',
              'Appointment Booked',
              'Patient Arrived',
              'Diagnostics Completed',
              'Treatment Completed',
              'Follow-up Scheduled',
              'Outcome Recorded',
            ].map((step, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-sm font-semibold">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-800 dark:text-gray-200">{step}</span>
                </div>
                {idx < 7 && (
                  <div className="flex items-center gap-2 pl-4 py-1">
                    <div className="w-0.5 h-4 bg-green-300 dark:bg-green-700" />
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-green-300 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700 dark:text-green-200">
                {t('closedloop.ruralcare.outcome')}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Patient Journey Demo - Ravi Kumar */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{t('closedloop.journeyDemo')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('closedloop.journeyDescription')} Ravi Kumar, 54-year-old patient from Rampur village.
        </p>
        <PatientTimeline items={timelineItems} />
      </Card>

      {/* Care Quality Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Rural Care Quality Score</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="#0d7c5f"
                  strokeWidth="8"
                  strokeDasharray={`${(82 / 100) * 2 * Math.PI * 55} ${2 * Math.PI * 55}`}
                  strokeLinecap="round"
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  82
                </span>
                <span className="text-lg text-gray-600 dark:text-gray-400">/100</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard.continuity.prototype')}
            </p>
          </div>
        </Card>

        {/* Breakdown Chart */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t('closedloop.scoreBreakdown')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={careQualityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0d7c5f" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Radar Chart */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{t('closedloop.qualityDimensions')}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Quality Score"
              dataKey="A"
              stroke="#0d7c5f"
              fill="#0d7c5f"
              fillOpacity={0.5}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Key Differentiators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-green-600">
          <h3 className="font-semibold text-lg mb-2">{t('closedloop.differentiator.continuity')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Every referral is tracked from creation to completion with documented outcomes.
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-600">
          <h3 className="font-semibold text-lg mb-2">{t('closedloop.differentiator.accountability')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time visibility into care quality metrics and facility performance data.
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-600">
          <h3 className="font-semibold text-lg mb-2">{t('closedloop.differentiator.coordination')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Seamless coordination between frontline workers, doctors, and facility staff.
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-600">
          <h3 className="font-semibold text-lg mb-2">{t('closedloop.differentiator.followup')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automated follow-up reminders ensure no patient is lost after treatment.
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-600">
          <h3 className="font-semibold text-lg mb-2">{t('closedloop.differentiator.integration')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Works with existing healthcare infrastructure without replacement.
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-600">
          <h3 className="font-semibold text-lg mb-2">{t('closedloop.differentiator.offline')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Functions in offline environments common in rural areas with sync when online.
          </p>
        </Card>
      </div>

      {/* Final message */}
      <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-3">
            {t('closedloop.closing.title')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
            {t('closedloop.closing.message')}
          </p>
          <p className="text-lg font-semibold text-green-700 dark:text-green-200">
            "Rural healthcare should not end at a referral. RuralCare 360 follows the patient until care is completed."
          </p>
        </div>
      </Card>
    </div>
  );
}
