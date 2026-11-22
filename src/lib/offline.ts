export interface OfflineRecord {
  id: string;
  type: string;
  data: unknown;
  timestamp: string;
  synced: boolean;
}

const OFFLINE_STORAGE_KEY = 'ruralcare_offline_records';

export function saveOfflineRecord(type: string, data: unknown): void {
  if (typeof window === 'undefined') return;

  const records = getOfflineRecords();
  const newRecord: OfflineRecord = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    timestamp: new Date().toISOString(),
    synced: false,
  };

  records.push(newRecord);
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(records));
}

export function getOfflineRecords(): OfflineRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function syncOfflineRecords(): Promise<{ synced: number }> {
  const records = getOfflineRecords();
  const unsyncedRecords = records.filter((r) => !r.synced);

  // Simulate sync delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mark all as synced
  const updatedRecords = records.map((r) => ({
    ...r,
    synced: true,
  }));

  if (typeof window !== 'undefined') {
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updatedRecords));
  }

  return { synced: unsyncedRecords.length };
}

export function getPendingCount(): number {
  const records = getOfflineRecords();
  return records.filter((r) => !r.synced).length;
}

export function clearSyncedRecords(): void {
  if (typeof window === 'undefined') return;

  const records = getOfflineRecords();
  const unsyncedRecords = records.filter((r) => !r.synced);
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(unsyncedRecords));
}
