'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
import { AlertCircle, TrendingUp, Users, Target, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const { t } = useTranslation();

  // Demo data
  const kpis = [
    { icon: <Users className="w-6 h-6 text-healthcare-green" />, label: 'Total Patients', value: '12,450', trend: 'up', status: 'positive', subtitle: '+450 this month' },
    { icon: <Target className="w-6 h-6 text-healthcare-blue" />, label: 'Referral Completion', value: '82%', trend: 'up', status: 'positive', subtitle: 'Target: 85%' },
    { icon: <Zap className="w-6 h-6 text-healthcare-yellow" />, label: 'Avg Wait Time', value: '34 min', trend: 'down', status: 'positive', subtitle: '↓ 5 min vs last week' },
    { icon: <AlertTriangle className="w-6 h-6 text-healthcare-red" />, label: 'High-Risk Cases', value: '450', trend: 'neutral', status: 'warning', subtitle: 'Requiring attention' },
    { icon: <TrendingUp className="w-6 h-6 text-healthcare-mint" />, label: 'Care Continuity Score', value: '78/100', trend: 'up', status: 'positive', subtitle: 'All facilities included' },
  ];

  const patientVolume = [
    { month: 'Mar', patients: 2400 },
    { month: 'Apr', patients: 2600 },
    { month: 'May', patients: 3200 },
    { month: 'Jun', patients: 3800 },
    { month: 'Jul', patients: 4200 },
    { month: 'Aug', patients: 4800 },
  ];

  const referralCompletion = [
    { month: 'Jan', created: 45, completed: 37 },
    { month: 'Feb', created: 52, completed: 42 },
    { month: 'Mar', created: 48, completed: 39 },
    { month: 'Apr', created: 61, completed: 50 },
    { month: 'May', created: 55, completed: 45 },
    { month: 'Jun', created: 58, completed: 47 },
  ];

  const facilityMetrics = [
    { metric: 'Access', District: 88, Rural: 75, PHC: 62 },
    { metric: 'Completion', District: 92, Rural: 82, PHC: 68 },
    { metric: 'Diagnostics', District: 95, Rural: 72, PHC: 45 },
    { metric: 'Medicine', District: 89, Rural: 78, PHC: 58 },
  ];

  const followUpOutcomes = [
    { name: 'Completed', value: 450, fill: '#10b981' },
    { name: 'Missed', value: 85, fill: '#dc2626' },
    { name: 'Escalated', value: 65, fill: '#d97706' },
  ];

  const facilities = [
    {
      id: '1',
      name: 'District Hospital',
      type: 'District Hospital',
      patients: 4200,
      referralCompletion: 92,
      diagnosticAvailability: 95,
      medicineAvailability: 89,
      qualityScore: 92,
    },
    {
      id: '2',
      name: 'Rural Hospital B',
      type: 'Rural Hospital',
      patients: 2800,
      referralCompletion: 82,
      diagnosticAvailability: 72,
      medicineAvailability: 78,
      qualityScore: 78,
    },
    {
      id: '3',
      name: 'PHC Rampur',
      type: 'PHC',
      patients: 1450,
      referralCompletion: 68,
      diagnosticAvailability: 45,
      medicineAvailability: 58,
      qualityScore: 57,
    },
  ];

  const getQualityBadge = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const columns = [
    {
      key: 'name',
      header: 'Facility Name',
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'patients',
      header: 'Total Patients',
      render: (value: number) => <span>{value.toLocaleString()}</span>,
    },
    {
      key: 'referralCompletion',
      header: 'Referral Completion',
      render: (value: number) => <span className="font-medium">{value}%</span>,
    },
    {
      key: 'diagnosticAvailability',
      header: 'Diagnostics',
      render: (value: number) => <span>{value}%</span>,
    },
    {
      key: 'medicineAvailability',
      header: 'Medicine Availability',
      render: (value: number) => <span>{value}%</span>,
    },
    {
      key: 'qualityScore',
      header: 'Quality Score',
      render: (value: number) => (
        <StatusBadge
          status={getQualityBadge(value) as any}
          label={`${value}/100`}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">State/District Administration</h1>
        <p className="text-muted-foreground mt-2">Healthcare quality and performance monitoring</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend as 'up' | 'down' | 'neutral'}
            status={kpi.status as 'positive' | 'negative' | 'neutral' | 'warning'}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={patientVolume}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d7c5f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d7c5f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#0d7c5f"
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Referral Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={referralCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" fill="#3b82f6" />
                <Bar dataKey="completed" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Facility Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={facilityMetrics}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="District Hospital" dataKey="District" stroke="#0d7c5f" fill="#0d7c5f" fillOpacity={0.5} />
                <Radar name="Rural Hospital" dataKey="Rural" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="PHC" dataKey="PHC" stroke="#d97706" fill="#d97706" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Follow-up Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={followUpOutcomes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {followUpOutcomes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Facility Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Performance Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={facilities} />
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <CardTitle className="text-base">Critical Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-red-600">• Medicine shortage: Insulin at PHC A (12 units, threshold 50)</li>
              <li className="text-red-600">• Wait time: PHC Rampur exceeds 60 minutes</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-base">Warnings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-yellow-700">• Ultrasound limited at 2/3 facilities</li>
              <li className="text-yellow-700">• Referral completion target not met this month (82% vs 85% target)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
