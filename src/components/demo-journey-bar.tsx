'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress'
import { useAppState } from '@/lib/store'
import { demoJourneySteps } from '@/lib/demo-data'

export function DemoJourneyBar() {
  const { isDemoMode, demoJourneyStep, nextDemoStep, prevDemoStep, resetDemoJourney } = useAppState()
  const [dismissed, setDismissed] = useState(false)

  if (!isDemoMode || dismissed) return null

  const currentStep = demoJourneySteps[demoJourneyStep]
  const progress = ((demoJourneyStep + 1) / demoJourneySteps.length) * 100

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-slate-900 text-white shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">
              Ravi Kumar&apos;s Care Journey &mdash; Step {demoJourneyStep + 1} of {demoJourneySteps.length}
            </div>
            <div className="mt-1 text-sm text-gray-300">{currentStep?.title}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setDismissed(true)}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <Progress value={progress}>
            <ProgressTrack className="h-1 bg-slate-700">
              <ProgressIndicator className="bg-[#10b981]" />
            </ProgressTrack>
          </Progress>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 text-xs text-gray-400">
            {currentStep?.description}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevDemoStep}
              disabled={demoJourneyStep === 0}
              className="gap-1 border-gray-600 text-white hover:bg-slate-800"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetDemoJourney}
              className="gap-1 border-gray-600 text-white hover:bg-slate-800"
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextDemoStep}
              disabled={demoJourneyStep === demoJourneySteps.length - 1}
              className="gap-1 border-gray-600 text-white hover:bg-slate-800"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
