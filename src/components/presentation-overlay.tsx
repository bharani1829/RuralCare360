'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const presentationSlides = [
  {
    title: 'The Problem',
    subtitle: 'Healthcare services exist, but care is fragmented.',
    points: [
      '🚗 Long travel distances to specialists',
      '📋 Fragmented medical records across facilities',
      '❌ Missed referrals and follow-ups',
      '🔬 Unavailable diagnostics in rural areas',
      '⏰ Extended waiting times and delays',
    ],
  },
  {
    title: 'Our Solution',
    subtitle: 'Closed-loop care coordination for rural healthcare.',
    points: [
      '🔗 Connect patients through their entire healthcare journey',
      '📍 Coordinate across facilities and specialists',
      '✅ Complete care with measurable follow-ups',
      '📱 Offline-first for low-connectivity areas',
      '🌍 Multilingual support for diverse communities',
    ],
  },
  {
    title: 'The Patient Journey',
    subtitle: "Ravi Kumar's care from start to finish.",
    points: [
      '📝 Patient registered and vitals recorded',
      '🚨 Digital triage identifies high-risk case',
      '👨‍⚕️ Teleconsultation with specialist',
      '🏥 Referral to District Hospital for cardiology',
      '✅ Appointment booked, diagnostics completed',
      '🎯 Treatment and follow-up closure',
    ],
  },
  {
    title: 'Why RuralCare 360',
    subtitle: 'Built for accountability and continuity.',
    points: [
      '✅ Referral closure tracking — no lost patients',
      '📊 Quality metrics and care completion scores',
      '🏛️ Strengthens existing public health infrastructure',
      '📡 Integration-ready architecture',
      '👥 Role-based for health workers, doctors, admins',
    ],
  },
  {
    title: 'Impact',
    subtitle: 'Measurable improvements in rural healthcare access.',
    points: [
      '↓ Reduced travel burden and waiting times',
      '↑ Increased referral and follow-up completion',
      '↑ Improved service visibility and coordination',
      '📈 Better accountability and quality metrics',
      '🎯 Patient-centered closed-loop care model',
    ],
  },
]

export function PresentationOverlay() {
  const { isPresentationMode, togglePresentationMode } = useAppState()
  const { t } = useTranslation()
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    if (isPresentationMode) {
      setSlideIndex(0)
    }
  }, [isPresentationMode])

  useEffect(() => {
    if (!isPresentationMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        togglePresentationMode()
      } else if (e.key === 'ArrowLeft') {
        setSlideIndex((i) => Math.max(0, i - 1))
      } else if (e.key === 'ArrowRight') {
        setSlideIndex((i) => Math.min(presentationSlides.length - 1, i + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPresentationMode, togglePresentationMode])

  if (!isPresentationMode) return null

  const slide = presentationSlides[slideIndex]
  const isFirst = slideIndex === 0
  const isLast = slideIndex === presentationSlides.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => togglePresentationMode()}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white p-8 md:p-12 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={() => togglePresentationMode()}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Close presentation mode"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between pr-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{slide.title}</h1>
            <p className="mt-2 text-base md:text-lg text-gray-600">{slide.subtitle}</p>
          </div>
          <div className="text-sm font-medium text-gray-500 shrink-0">
            {slideIndex + 1} / {presentationSlides.length}
          </div>
        </div>

        {/* Content */}
        <div className="mb-10 space-y-3">
          {slide.points.map((point, i) => (
            <div key={i} className="flex items-start gap-3 text-base text-gray-700">
              <span className="mt-0.5 flex-shrink-0">{point.split(' ')[0]}</span>
              <span>{point.substring(point.indexOf(' ') + 1)}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('common.previous')}
          </Button>

          <div className="flex items-center gap-2">
            {presentationSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={cn(
                  'h-2.5 rounded-full transition-all',
                  i === slideIndex ? 'w-6 bg-emerald-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setSlideIndex((i) => Math.min(presentationSlides.length - 1, i + 1))}
            disabled={isLast}
            className="gap-2"
          >
            {t('common.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Close hint */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Press <kbd className="rounded bg-gray-100 px-2 py-1 font-mono">Esc</kbd> or click outside to close presentation mode &bull; Use <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">&larr;</kbd> <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">&rarr;</kbd> to navigate
        </div>
      </div>
    </div>
  )
}

