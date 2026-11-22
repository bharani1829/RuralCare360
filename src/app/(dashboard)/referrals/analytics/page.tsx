'use client'

import { Card } from '@/components/ui/card'
import { StatCard } from '@/components/stat-card'
import { referrals, facilities } from '@/lib/demo-data'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react'

export default function ReferralAnalyticsPage() {
  // Calculate metrics
  const totalReferrals = 128
  const completed = referrals.filter(r => r.status === 'closed').length
  const completionRate = Math.round((completed / referrals.length) * 100)
  const missed = referrals.filter(r => r.status === 'missed').length
  const missedRate = Math.round((missed / referrals.length) * 100)

  // Funnel data
  const funnelData = [
    { stage: 'Created', count: 128 },
    { stage: 'Accepted', count: 115 },
    { stage: 'Booked', count: 108 },
    { stage: 'Arrived', count: 102 },
    { stage: 'Completed', count: 98 },
    { stage: 'Closed', count: 87 },
  ]

  // Status distribution
  const statusData = [
    { name: 'Created', value: 12, color: '#94a3b8' },
    { name: 'Accepted', value: 15, color: '#60a5fa' },
    { name: 'In Progress', value: 45, color: '#3b82f6' },
    { name: 'Completed', value: 38, color: '#10b981' },
    { name: 'Closed', value: 15, color: '#0d7c5f' },
    { name: 'Missed', value: 3, color: '#ef4444' },
  ]

  // Urgency distribution
  const urgencyData = [
    { name: 'Routine', value: 60, color: '#3b82f6' },
    { name: 'Priority', value: 30, color: '#f59e0b' },
    { name: 'Emergency', value: 10, color: '#ef4444' },
  ]

  // Completion time trend (6 months)
  const trendData = [
    { month: 'Mar', avgDays: 5.2 },
    { month: 'Apr', avgDays: 4.8 },
    { month: 'May', avgDays: 4.5 },
    { month: 'Jun', avgDays: 4.2 },
    { month: 'Jul', avgDays: 4.0 },
    { month: 'Aug', avgDays: 4.2 },
  ]

  // Facility performance
  const facilityPerformance = [
    {
      facility: 'District Hospital',
      completion: 94,
      avgTime: 3.2,
      emergencyResponse: 96,
      satisfaction: 4.5,
    },
    {
      facility: 'Rural Hospital B',
      completion: 87,
      avgTime: 4.5,
      emergencyResponse: 88,
      satisfaction: 4.2,
    },
    {
      facility: 'PHC A',
      completion: 76,
      avgTime: 5.8,
      emergencyResponse: 72,
      satisfaction: 3.9,
    },
  ]

  const insights = [
    {
      title: 'Emergency referrals complete 2x faster than routine',
      description: 'Average completion time: 2.1 days vs 4.8 days',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'District Hospital has highest completion rate',
      description: '94% completion rate vs 82% system average',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'PHC A needs support',
      description: '40% miss rate, longest average wait time',
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      title: 'Average referral time increased 0.5 days this month',
      description: 'From 4.0 days (July) to 4.2 days (August)',
      icon: TrendingDown,
      color: 'text-amber-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referral Performance Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into referral effectiveness and care continuity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total Referrals"
          value={totalReferrals}
          subtitle="Last 30 days"
          trend="up"
          status="positive"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Completion Rate"
          value={`${completionRate}%`}
          subtitle="Target: 85%"
          trend="up"
          status="positive"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg. Time to Complete"
          value="4.2 days"
          subtitle="+0.2 days"
          trend="up"
          status="neutral"
        />
        <StatCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="Missed Rate"
          value={`${missedRate}%`}
          subtitle="vs 12% last month"
          trend="down"
          status="positive"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Emergency Response"
          value="<1 hour"
          subtitle="94% within target"
          trend="neutral"
          status="positive"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Funnel */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Referral Completion Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0d7c5f" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-3">
            68% of created referrals reach closed status (87/128)
          </p>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgency Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Urgency Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={urgencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {urgencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Completion Time Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Average Completion Time Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Area type="monotone" dataKey="avgDays" stroke="#0d7c5f" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-2 mt-3">
            <TrendingDown className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-muted-foreground">
              Slight increase from 4.0 to 4.2 days (requires attention)
            </p>
          </div>
        </Card>
      </div>

      {/* Facility Performance Heat Map */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Facility Performance Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Facility</th>
                <th className="text-center py-3 px-4 font-semibold">Completion %</th>
                <th className="text-center py-3 px-4 font-semibold">Avg Time (days)</th>
                <th className="text-center py-3 px-4 font-semibold">Emergency Response</th>
                <th className="text-center py-3 px-4 font-semibold">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {facilityPerformance.map((f, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{f.facility}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        f.completion >= 90
                          ? 'bg-green-100 text-green-700'
                          : f.completion >= 80
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {f.completion}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        f.avgTime <= 4
                          ? 'bg-green-100 text-green-700'
                          : f.avgTime <= 5
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {f.avgTime}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        f.emergencyResponse >= 90
                          ? 'bg-green-100 text-green-700'
                          : f.emergencyResponse >= 80
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {f.emergencyResponse}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-gray-700 font-medium">{f.satisfaction}/5.0</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <Card key={idx} className="p-5">
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-2 bg-gray-100 ${insight.color}`}>
                <insight.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Facility Recommendations */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Facility Recommendations</h2>
        <div className="space-y-4">
          {[
            {
              facility: 'PHC A',
              performance: 'Below Target',
              recommendation: 'Increase staff capacity, improve appointment scheduling system',
              priority: 'High',
            },
            {
              facility: 'Rural Hospital B',
              performance: 'Meeting Target',
              recommendation: 'Maintain current operations, monitor emergency response times',
              priority: 'Medium',
            },
            {
              facility: 'District Hospital',
              performance: 'Exceeding Target',
              recommendation: 'Share best practices with other facilities, maintain quality standards',
              priority: 'Low',
            },
          ].map((rec, idx) => (
            <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div className="flex-1">
                <h4 className="font-semibold">{rec.facility}</h4>
                <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rec.performance === 'Exceeding Target'
                      ? 'bg-green-100 text-green-700'
                      : rec.performance === 'Meeting Target'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {rec.performance}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rec.priority === 'High'
                      ? 'bg-red-100 text-red-700'
                      : rec.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          📊 <strong>Prototype metrics:</strong> These analytics use demo data for demonstration purposes. In production, metrics would be calculated from actual referral completion data and facility performance indicators.
        </p>
      </Card>
    </div>
  )
}
