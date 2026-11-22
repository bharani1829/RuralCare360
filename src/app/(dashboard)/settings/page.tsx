'use client';

import { useAppState } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LanguageSelector } from '@/components/language-selector';
import { User, Bell, Building2, Presentation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const { currentUser, isDemoMode, isPresentationMode, toggleDemoMode, togglePresentationMode, resetDemoJourney } = useAppState();

  const isAdminOrFacility = currentUser?.role === 'admin' || currentUser?.role === 'facility-staff';

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          {isAdminOrFacility && (
            <TabsTrigger value="facility">
              <Building2 className="w-4 h-4 mr-2" />
              Facility Admin
            </TabsTrigger>
          )}
          <TabsTrigger value="demo">
            <Presentation className="w-4 h-4 mr-2" />
            Demo Mode
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">User Name</Label>
                <Input id="name" defaultValue={currentUser?.name || 'Health Worker'} />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {currentUser?.role?.replace('-', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">(Read-only)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facility">Assigned Facility</Label>
                <Input id="facility" defaultValue={currentUser?.facility || 'PHC Rampur'} />
              </div>

              <div className="space-y-2">
                <Label>Language Preference</Label>
                <LanguageSelector />
              </div>

              <Button className="bg-healthcare-green hover:bg-healthcare-green/90">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="referral-notif">Referral Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when referrals are created or updated</p>
                </div>
                <Switch id="referral-notif" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emergency-notif">Emergency Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical emergency notifications</p>
                </div>
                <Switch id="emergency-notif" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="followup-notif">Follow-up Reminders</Label>
                  <p className="text-sm text-muted-foreground">Patient follow-up due reminders</p>
                </div>
                <Switch id="followup-notif" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-notif">System Notifications</Label>
                  <p className="text-sm text-muted-foreground">System updates and announcements</p>
                </div>
                <Switch id="system-notif" />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>Notification Method</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="notif-sms" defaultChecked />
                    <Label htmlFor="notif-sms" className="cursor-pointer">SMS</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="notif-inbox" defaultChecked />
                    <Label htmlFor="notif-inbox" className="cursor-pointer">In-App</Label>
                  </div>
                </div>
              </div>

              <Button className="bg-healthcare-green hover:bg-healthcare-green/90">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facility Admin Tab */}
        {isAdminOrFacility && (
          <TabsContent value="facility">
            <Card>
              <CardHeader>
                <CardTitle>Facility Administration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Facility Status</Label>
                  <Select defaultValue="operational">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="limited">Limited Services</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Operating Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="time" defaultValue="08:00" placeholder="Opening time" />
                    <Input type="time" defaultValue="17:00" placeholder="Closing time" />
                  </div>
                </div>

                <Button className="bg-healthcare-green hover:bg-healthcare-green/90">
                  Update Facility Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Demo Mode Tab */}
        <TabsContent value="demo">
          <Card>
            <CardHeader>
              <CardTitle>Demo & Presentation Mode</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure demo features for presentations and judging
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="demo-mode">Demo Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable demo features and sample patient journey
                  </p>
                </div>
                <Switch
                  id="demo-mode"
                  checked={isDemoMode}
                  onCheckedChange={() => toggleDemoMode()}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="presentation-mode">Presentation Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Simplified UI for judging and presentations
                  </p>
                </div>
                <Switch
                  id="presentation-mode"
                  checked={isPresentationMode}
                  onCheckedChange={() => togglePresentationMode()}
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>Demo Journey Control</Label>
                <Button
                  variant="outline"
                  onClick={() => resetDemoJourney()}
                  className="w-full"
                >
                  Reset Demo Journey
                </Button>
                <p className="text-xs text-muted-foreground">
                  Resets the 16-step Ravi Kumar patient journey to the beginning
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>Active Persona</Label>
                <Select defaultValue={currentUser?.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health-worker">Health Worker</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="facility-staff">Facility Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Change role to view different interface features
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <p className="font-medium mb-1">Demo Mode Features:</p>
                <ul className="space-y-1 ml-4 text-xs">
                  <li>• 16-step Ravi Kumar patient journey walkthrough</li>
                  <li>• Interactive demo navigation controls</li>
                  <li>• Simulated offline/online toggle</li>
                  <li>• Sample data and analytics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
