import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

import { usePermissions } from "@/hooks/usePermissions";

interface TrashedAsset {
  id: number;
  name: string;
  type: string;
  deletedAt: string;
  deletedBy: string;
}

export default function RecycleBin() {
  const [items, setItems] = useState<TrashedAsset[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { hasPermission } = usePermissions();

  const loadTrashedAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assets/recycle');
      const data = await response.json();
      setItems(data);
      setSelected([]);
    } catch (error) {
      toast({
        title: "Error loading trashed assets",
        description: "Could not fetch recycle bin contents",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTrashedAssets();
  }, []);

  const toggleSelection = (id: number) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRestoreSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Restore ${selected.length} selected assets?`)) return;
    try {
      await fetch('/api/assets/recycle/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selected)
      });
      await loadTrashedAssets();
      toast({
        title: "Assets restored",
        description: `${selected.length} items moved back to inventory`
      });
    } catch (error) {
      toast({
        title: "Restore failed",
        description: "Could not restore selected assets",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Permanently delete ${selected.length} selected assets? This cannot be undone.`)) return;
    if (!hasPermission('admin')) {
      toast({
        title: "Permission denied",
        description: "Only administrators can permanently delete assets",
        variant: "destructive"
      });
      return;
    }
    try {
      await fetch('/api/assets/recycle/permanent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selected)
      });
      await loadTrashedAssets();
      toast({
        title: "Assets deleted",
        description: `${selected.length} items permanently removed`
      });
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "Could not permanently delete assets",
        variant: "destructive"
      });
    }
  };

  const handleRestoreAll = async () => {
    if (!confirm('Restore ALL trashed assets?')) return;
    try {
      await fetch('/api/assets/recycle/restore-all', { method: 'POST' });
      await loadTrashedAssets();
      toast({
        title: "All assets restored",
        description: "All items moved back to inventory"
      });
    } catch (error) {
      toast({
        title: "Restore failed",
        description: "Could not restore all assets",
        variant: "destructive"
      });
    }
  };

  const handleEmptyBin = async () => {
    if (!confirm('Permanently delete ALL trashed assets? This cannot be undone.')) return;
    if (!hasPermission('admin')) {
      toast({
        title: "Permission denied",
        description: "Only administrators can empty the recycle bin",
        variant: "destructive"
      });
      return;
    }
    try {
      await fetch('/api/assets/recycle/empty', { method: 'DELETE' });
      await loadTrashedAssets();
      toast({
        title: "Recycle bin emptied",
        description: "All trashed items permanently removed"
      });
    } catch (error) {
      toast({
        title: "Empty failed",
        description: "Could not empty recycle bin",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recycle Bin</h1>
            <p className="text-muted-foreground mt-2">
              Manage soft-deleted assets (last 30 days)
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            onClick={handleRestoreSelected}
            disabled={selected.length === 0 || loading}
          >
            Restore Selected
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selected.length === 0 || loading}
          >
            Delete Selected
          </Button>
          <Button variant="secondary" onClick={handleRestoreAll} disabled={loading}>
            Restore All
          </Button>
          <Button variant="destructive" onClick={handleEmptyBin} disabled={loading}>
            Empty Recycle Bin
          </Button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Deleted At</TableHead>
                <TableHead>Deleted By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onCheckedChange={() => toggleSelection(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {new Date(item.deletedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{item.deletedBy}</TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No trashed assets
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
}