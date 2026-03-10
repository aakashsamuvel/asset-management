import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { API_BASE_URL } from "@/config";
import type { SettingsResponse } from "@/types";

interface Settings {
  id: number;
  siteName: string;
  logoUrl: string;
  contactEmail: string;
  recycleBinEnabled: boolean;
  recycleBinAutoPurgeDays: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({} as Settings);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5018/api/settings');
        const data: SettingsResponse = await response.json();
        setSettings({
          ...data,
          recycleBinEnabled: data.recycleBinEnabled,
          recycleBinAutoPurgeDays: data.recycleBinAutoPurgeDays,
        });
      } catch (error) {
        toast({
          title: "Error loading settings",
          description: "Could not fetch application settings",
          variant: "destructive",
        });
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('http://localhost:5018/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            ...settings,
            recycleBinEnabled: settings.recycleBinEnabled
          }
        }),
      });

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Application settings have been updated.",
        });
      } else {
        toast({
          title: "Error Saving Settings",
          description: "Failed to update application settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "Failed to connect to the server.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings and preferences
          </p>
        </div>
        {loading ? (
          <div>Loading settings...</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-xl font-semibold">General Settings</h2>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="siteName" className="text-right">
                    Site Name
                  </Label>
                  <Input
                    type="text"
                    id="siteName"
                    name="siteName"
                    defaultValue={settings.siteName}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logoUrl" className="text-right">
                    Logo URL
                  </Label>
                  <Input
                    type="text"
                    id="logoUrl"
                    name="logoUrl"
                    defaultValue={settings.logoUrl}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactEmail" className="text-right">
                    Contact Email
                  </Label>
                  <Input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    defaultValue={settings.contactEmail}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-xl font-semibold">Recycle Bin Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recycleBinEnabled"
                    name="recycleBinEnabled"
                    checked={settings.recycleBinEnabled}
                    onCheckedChange={(checked) => {
                      setSettings(prevSettings => ({ ...prevSettings, recycleBinEnabled: Boolean(checked) }));
                    }}
                  />
                  <Label htmlFor="recycleBinEnabled">Enable Recycle Bin</Label>
                </div>
                <div>
                  <Label htmlFor="recycleBinAutoPurgeDays">Auto-purge after (days)</Label>
                  <Input
                    type="number"
                    id="recycleBinAutoPurgeDays"
                    name="recycleBinAutoPurgeDays"
                    value={settings.recycleBinAutoPurgeDays}
                    onChange={handleChange}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Recycle Bin Management</h2>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/recycle-bin'}
              >
                Go to Recycle Bin
              </Button>
            </div>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}