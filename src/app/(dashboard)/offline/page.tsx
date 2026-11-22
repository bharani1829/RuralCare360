'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wifi, WifiOff, Zap, Trash2 } from 'lucide-react';

const Offline = () => {
  const { isOnline, toggleOnline, pendingSyncRecords } = useAppState();
  const { t } = useTranslation();
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  const mockPendingRecords = [
    { id: '1', type: 'Triage', patientName: 'Ravi Kumar', timestamp: '2:45 PM', status: 'Pending' },
    { id: '2', type: 'Vitals', patientName: 'Fatima Begum', timestamp: '2:30 PM', status: 'Pending' },
    { id: '3', type: 'Referral', patientName: 'Venkat Rao', timestamp: '2:15 PM', status: 'Pending' },
  ];

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 300);

    // Simulate sync completion
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSyncing(false);
    setSyncedCount(pendingSyncRecords);
    setSyncProgress(100);

    setTimeout(() => {
      setSyncProgress(0);
      setSyncedCount(0);
    }, 3000);
  };

  const columns = [
    {
      key: 'type',
      header: 'Record Type',
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'patientName',
      header: 'Patient Name',
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (value: string) => <span className="text-sm text-muted-foreground">{value}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Pending' ? 'destructive' : 'default'}>{value}</Badge>
      ),
    },
    {
      key: 'id',
      header: 'Action',
      render: () => (
        <Button variant="ghost" size="sm">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Offline Sync Center</h1>
        <p className="text-muted-foreground mt-2">Manage offline data and synchronization</p>
      </div>

      {/* Network Status Card */}
      <Card className={isOnline ? 'border-green-200' : 'border-red-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="w-6 h-6 text-green-500" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-500" />
              )}
              <div>
                <CardTitle className="text-lg">
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isOnline
                    ? 'Connected to network - real-time sync enabled'
                    : 'Offline mode - data cached locally'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="offline-toggle" className="cursor-pointer">
                  Simulate Offline
                </Label>
                <Switch
                  id="offline-toggle"
                  checked={!isOnline}
                  onCheckedChange={() => toggleOnline()}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pending Records Section */}
      {pendingSyncRecords > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Pending Synchronization</CardTitle>
                <p className="text-2xl font-bold text-yellow-600 mt-2">
                  {pendingSyncRecords} records waiting to sync
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            {isSyncing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Syncing records...</span>
                  <span>{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="h-2" />
              </div>
            )}

            {syncedCount > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✓ {syncedCount} records synchronized successfully
              </div>
            )}

            {/* Sync Button */}
            <Button
              onClick={handleSync}
              disabled={!isOnline || isSyncing}
              className="w-full bg-healthcare-green hover:bg-healthcare-green/90"
            >
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sync Queue Table */}
      {pendingSyncRecords > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sync Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={mockPendingRecords.slice(0, pendingSyncRecords)}
            />
          </CardContent>
        </Card>
      )}

      {/* Offline Mode Explanation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base text-blue-900">Offline-First Architecture</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2 text-sm">
          <p>
            RuralCare 360 caches patient data and allows core clinical workflows to continue
            offline. Records are automatically synchronized when network connectivity is restored.
          </p>
          <div className="mt-3 space-y-1 ml-4">
            <p>✓ Patient registration available offline</p>
            <p>✓ Vital signs recording saved locally</p>
            <p>✓ Triage assessment drafts preserved</p>
            <p>✓ Referral drafts queued for sync</p>
            <p>✓ Follow-up notes stored locally</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Offline;
