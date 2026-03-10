import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Laptop, 
  Monitor, 
  Mouse, 
  Keyboard, 
  Smartphone, 
  Tablet,
  MoreHorizontal,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus
} from "lucide-react";
import AssetForm from "./AssetForm";
import TransferAsset from "./TransferAsset";

export interface Asset {
  id: number;
  name: string;
  type: string;
  location: string;
  purchaseDate: Date;
  purchasePrice: number;
  status: string;
  model: string;
  serialNumber: string;
  vendor: string;
  warrantyStartDate: Date | null;
  warrantyEndDate: Date | null;
  warrantyProvider: string;
  description: string;
  assigneeId: number | null;
  previousOwnerId: number | null;
  assetGivenDate: Date | null;
  processor: string;
  ram: string;
  storage: string;
  screenSize: string;
  resolution: string;
  panelType: string;
  refreshRate: string;
  connectionType: "" | "Wired" | "Wireless" | "Bluetooth";
  batteryLife: string;
  orderNumber: string | null;
  assigneeName?: string | null;
}

import ColumnMappingDialog from "./ColumnMappingDialog";

const AssetGrid: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [statusSearch, setStatusSearch] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [locationSearch, setLocationSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isRetireOpen, setIsRetireOpen] = useState(false);
  const [transferLocation, setTransferLocation] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [columnHeaders, setColumnHeaders] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"excel" | "csv">("excel");

  const openDetailModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailOpen(true);
  };

  const handleAddAsset = () => {
    setEditingAsset(null);
    setIsDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsDialogOpen(true);
  };

  const handleTransfer = async () => {
    if (selectedAsset) {
      try {
        const response = await fetch(`http://localhost:5018/api/assets/${selectedAsset.id}/transfer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transferLocation),
        });

        if (!response.ok) {
          throw new Error("Failed to transfer asset");
        }

        setIsTransferOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRetire = async () => {
    if (selectedAsset) {
      try {
        const response = await fetch(`http://localhost:5018/api/assets/${selectedAsset.id}/retire`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transferLocation),
        });

        if (!response.ok) {
          throw new Error("Failed to retire asset");
        }

        setIsRetireOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleImportConfirm = async (mappings: { [key: string]: string }) => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      const mappedAssets = jsonData.map((row: any) => {
        const newAsset: Record<string, any> = {};
        for (const key in mappings) {
          if (mappings.hasOwnProperty(key)) {
            const mappedKey = mappings[key];
            // Get the actual key from the row that matches case-insensitively
            const rowKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase()) || key;
            let value = row[rowKey];

            if (value !== undefined && value !== null) {
              // Handle different data types
              if (typeof value === 'string') {
                value = value.trim();
                if (value === '') value = null;
              }

              // Convert Excel serial dates to ISO strings
              if (mappedKey.toLowerCase().includes('date')) {
                if (typeof value === 'number') {
                  // Excel date serial number
                  value = new Date((value - 25569) * 86400 * 1000).toISOString();
                } else if (typeof value === 'string' && /^\d+$/.test(value)) {
                  // String that's actually a number
                  value = new Date((parseInt(value) - 25569) * 86400 * 1000).toISOString();
                } else if (typeof value === 'string') {
                  // Try parsing other date formats
                  const parsedDate = new Date(value);
                  if (!isNaN(parsedDate.getTime())) {
                    value = parsedDate.toISOString();
                  }
                }
              }

              // Convert numeric fields
              if (mappedKey === 'purchasePrice' && typeof value !== 'number') {
                value = parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
              }

              // Ensure required fields have defaults
              if (mappedKey === 'status' && !value) {
                value = 'Available'; // Default status
              }

              newAsset[mappedKey] = value;
              console.log(`Mapped ${rowKey} => ${mappedKey}:`, value);
            }
          }
        }
        console.log('Processed asset:', newAsset);
        return newAsset;
      });

      try {
        const response = await fetch("http://localhost:5018/api/assets/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mappedAssets, null, 2),
        });

        if (!response.ok) {
          console.error(await response.text());
          throw new Error("Failed to import assets");
        }

        // Refresh assets after successful import
        const updatedAssetsResponse = await fetch("http://localhost:5018/api/assets");
        const updatedAssets = await updatedAssetsResponse.json();
        setAssets(updatedAssets);

        setColumnHeaders([]); // Close mapping dialog
        setSelectedFile(null); // Clear selected file
        alert("Assets imported successfully!");
      } catch (error) {
        console.error("Error importing assets:", error);
        alert("Failed to import assets. Please check console for details.");
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`http://localhost:5018/api/assets/export?format=${exportFormat}`);
      if (!response.ok) {
        throw new Error("Failed to export assets");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const extension = exportFormat === "excel" ? "xls" : "csv";
      a.download = `assets.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert("Assets exported successfully!");
    } catch (error) {
      console.error("Error exporting assets:", error);
      alert("Failed to export assets. Please check console for details.");
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await fetch("http://localhost:5018/api/assets");
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error(error);
    }
  };
 277
  useEffect(() => {
    fetchAssets();
  }, []);

  const getAssetIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "computer":
        return <Laptop className="h-8 w-8 text-blue-600" />;
      case "monitor":
        return <Monitor className="h-8 w-8 text-green-600" />;
      case "accessories":
        return <Mouse className="h-8 w-8 text-purple-600" />;
      case "mobile":
        return <Smartphone className="h-8 w-8 text-orange-600" />;
      default:
        return <Laptop className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-200";
      case "Assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Repair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Lost":
      case "Damage":
        return "bg-red-100 text-red-800 border-red-200";
      case "Donated":
      case "Retired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredAssets = assets.filter((asset: Asset) => {
    const matchesSearch = asset?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                         asset?.type?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                         asset?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || asset?.type?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === "all" || asset?.status?.toLowerCase() === selectedStatus.toLowerCase();
    const matchesAssignee = selectedAssignee === "all" || asset?.assigneeName?.toLowerCase() === selectedAssignee?.toLowerCase();
    const matchesLocation = selectedLocation === "all" || asset?.location?.toLowerCase() === selectedLocation?.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus && matchesAssignee && matchesLocation;
  });

  const categories = ["all", ...Array.from(new Set(assets.map(asset => asset.type)))];

  return (
    <div className="space-y-6">
      {/* Asset Summary Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 mb-3">
        {/* Total Assets Card */}
        <Card className="hover:border-primary/20 transition-colors duration-150 shadow-none">
          <CardContent className="p-2">
            <div className="flex flex-col items-center space-y-0">
              <span className="text-[0.7rem] text-muted-foreground">Total</span>
              <span className="text-lg font-medium">{assets.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Category Cards */}
        {Array.from(new Set(assets.map(asset => asset.type))).map(type => {
          const count = assets.filter(asset => asset.type === type).length;
          return (
            <Card key={type} className="hover:border-primary/20 transition-colors duration-150 shadow-none">
              <CardContent className="p-2">
                <div className="flex flex-col items-center space-y-0">
                  <span className="text-[0.7rem] text-muted-foreground">{type}</span>
                  <span className="text-lg font-medium">{count}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Status Cards */}
        {Array.from(new Set(assets.map(asset => asset.status))).map(status => {
          const count = assets.filter(asset => asset.status === status).length;
          return (
            <Card key={status} className="hover:border-primary/20 transition-colors duration-150 shadow-none">
              <CardContent className="p-2">
                <div className="flex flex-col items-center space-y-0">
                  <span className="text-[0.7rem] text-muted-foreground">{status}</span>
                  <span className="text-lg font-medium">{count}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory === "all" ? "All Categories" : selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 overflow-y-auto">
              <div className="p-2">
                <Input
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="mb-2"
                />
                {selectedCategory !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => {
                      setSelectedCategory("all");
                      setCategorySearch("");
                    }}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              {categories
                .filter(category =>
                  category.toLowerCase().includes(categorySearch.toLowerCase()) ||
                  category === "all"
                )
                .map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All Categories" : category}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedStatus === "all" ? "All Statuses" : selectedStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 overflow-y-auto">
              <div className="p-2">
                <Input
                  placeholder="Search statuses..."
                  value={statusSearch}
                  onChange={(e) => setStatusSearch(e.target.value)}
                  className="mb-2"
                />
                {selectedStatus !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => {
                      setSelectedStatus("all");
                      setStatusSearch("");
                    }}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              {["all", ...Array.from(new Set(assets.map(asset => asset.status)))]
                .filter(status =>
                  (status?.toLowerCase() ?? '').includes(statusSearch.toLowerCase()) ||
                  status === "all"
                )
                .map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status === "all" ? "All Statuses" : status}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedAssignee === "all" ? "All Assignees" : selectedAssignee || 'Unassigned'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 overflow-y-auto">
              <div className="p-2">
                <Input
                  placeholder="Search assignees..."
                  value={assigneeSearch}
                  onChange={(e) => setAssigneeSearch(e.target.value)}
                  className="mb-2"
                />
                {selectedAssignee !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => {
                      setSelectedAssignee("all");
                      setAssigneeSearch("");
                    }}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              {["all", ...Array.from(new Set(assets.map(asset => asset.assigneeName || 'Unassigned')))]
                .filter(assignee =>
                  assignee.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
                  assignee === "all"
                )
                .map((assignee) => (
                  <DropdownMenuItem
                    key={assignee}
                    onClick={() => setSelectedAssignee(assignee)}
                  >
                    {assignee === "all" ? "All Assignees" : assignee}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedLocation === "all" ? "All Locations" : selectedLocation}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 overflow-y-auto">
              <div className="p-2">
                <Input
                  placeholder="Search locations..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="mb-2"
                />
                {selectedLocation !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => {
                      setSelectedLocation("all");
                      setLocationSearch("");
                    }}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              {["all", ...Array.from(new Set(assets.map(asset => asset.location)))]
                .filter(location =>
                  (location?.toLowerCase() ?? '').includes(locationSearch.toLowerCase()) ||
                  location === "all"
                )
                .map((location) => (
                  <DropdownMenuItem
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                  >
                    {location === "all" ? "All Locations" : location}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)}>
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Import Assets</DialogTitle>
                <DialogDescription>Select a CSV or Excel file to import assets.</DialogDescription>
              </DialogHeader>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    const allowedExtensions = [".csv", ".xlsx", ".xls"];
                    const fileExtension = file.name.slice(file.name.lastIndexOf("."));
                    if (!allowedExtensions.includes(fileExtension)) {
                      alert("Please select a valid CSV or Excel file.");
                      setSelectedFile(null);
                      return;
                    }
                    setSelectedFile(file);
                  } else {
                    setSelectedFile(null);
                  }
                }}
              />
              <Button onClick={() => {
                setIsImportDialogOpen(false);
                if (selectedFile) {
                  const reader = new FileReader();
                  reader.onload = async (e: any) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
                    setColumnHeaders(headers);
                    // Store headers or pass them to the next step
                  };
                  reader.readAsArrayBuffer(selectedFile);
                }
              }}>
                Import
              </Button>
            </DialogContent>
          </Dialog> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setExportFormat("excel");
                handleExport();
              }}>
                Excel (.xls)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setExportFormat("csv");
                handleExport();
              }}>
                CSV (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleAddAsset}>
                          Add Asset
                        </Button>
                      </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="asset-form-description">
              <DialogHeader>
                <DialogTitle>{editingAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
              </DialogHeader>
              <DialogDescription id="asset-form-description">
                {editingAsset ? "Update the asset details." : "Fill in the details to create a new asset."}
              </DialogDescription>
              <AssetForm
                onClose={() => setIsDialogOpen(false)}
                assetToEdit={editingAsset}
                onSuccess={fetchAssets}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Assets Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => asset ? (
            <Card key={asset.id} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getAssetIcon(asset?.type)}
                    <div>
                      <CardTitle className="text-lg">{asset?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{asset?.type}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDetailModal(asset)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditAsset(asset)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedAsset(asset); setIsTransferOpen(true); }}>Transfer</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={async () => {
                        if (confirm('Move this asset to Recycle Bin?')) {
                          try {
                            const response = await fetch(`http://localhost:5018/api/assets/${asset.id}/trash`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              }
                            });
                            if (response.ok) {
                              fetchAssets(); // Refresh the list
                            }
                          } catch (error) {
                            console.error('Error moving to recycle bin:', error);
                          }
                        }
                      }}>Move to Recycle Bin</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                  <span className="text-sm font-medium text-green-600">
                    INR {(asset.purchasePrice || 0).toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p>{asset.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assignee:</span>
                    <p>{asset.assigneeName || 'Unassigned'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p>{asset.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null)}
        </div>
      ) : (
        <div className="border rounded-md p-4">
          {/* List View */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between font-semibold border-b pb-2">
              <div className="w-1/4">Name</div>
              <div className="w-1/4">Type</div>
              <div className="w-1/4">Status</div>
              <div className="w-1/4">Location</div>
              <div className="w-1/12"></div>
            </div>
            {filteredAssets.map((asset) => asset ? (
              <div key={asset.id} className="flex justify-between items-center border-b py-2">
                <div className="w-1/4">{asset.name}</div>
                <div className="w-1/4">{asset.type}</div>
                <div className="w-1/4">
                  <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                </div>
                <div className="w-1/4">{asset.location}</div>
                <div className="w-1/12">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDetailModal(asset)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditAsset(asset)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedAsset(asset); setIsTransferOpen(true); }}>Transfer</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={async () => {
                        if (confirm('Move this asset to Recycle Bin?')) {
                          try {
                            const response = await fetch(`http://localhost:5018/api/assets/${asset.id}/trash`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ deletedBy: "currentUser" }) // Include deletedBy information
                            });
                            if (response.ok) {
                              fetchAssets(); // Refresh the list
                            } else {
                              console.error('Failed to move to recycle bin:', await response.text());
                            }
                          } catch (error) {
                            console.error('Error moving to recycle bin:', error);
                          }
                        }
                      }}>Move to Recycle Bin</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      {columnHeaders.length > 0 && (
        <ColumnMappingDialog
          isOpen={columnHeaders.length > 0}
          onClose={() => setColumnHeaders([])}
          headers={columnHeaders}
          onConfirm={handleImportConfirm}
          file={selectedFile}
        />
      )}

      {selectedAsset && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedAsset.name}</DialogTitle>
              <DialogDescription>{selectedAsset.type} - {selectedAsset.model}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div><span className="font-semibold">Serial Number:</span> {selectedAsset.serialNumber}</div>
              <div><span className="font-semibold">Vendor:</span> {selectedAsset.vendor}</div>
              <div><span className="font-semibold">Purchase Date:</span> {selectedAsset.purchaseDate ? new Date(selectedAsset.purchaseDate).toLocaleDateString() : 'N/A'}</div>
              <div><span className="font-semibold">Purchase Price:</span> INR {(selectedAsset.purchasePrice || 0).toLocaleString()}</div>
              <div><span className="font-semibold">Warranty End Date:</span> {selectedAsset.warrantyEndDate ? new Date(selectedAsset.warrantyEndDate).toLocaleDateString() : 'N/A'}</div>
              <div><span className="font-semibold">Location:</span> {selectedAsset.location}</div>
              {selectedAsset.assigneeName && <div><span className="font-semibold">Assignee:</span> {selectedAsset.assigneeName}</div>}
              <div className="col-span-2"><span className="font-semibold">Description:</span> {selectedAsset.description}</div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedAsset && (
        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Asset</DialogTitle>
            </DialogHeader>
            <TransferAsset
              assetId={selectedAsset.id}
              isOpen={isTransferOpen}
              onClose={() => setIsTransferOpen(false)}
              onTransfer={handleTransfer}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedAsset && (
        <Dialog open={isRetireOpen} onOpenChange={setIsRetireOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Retire Asset</DialogTitle>
              <DialogDescription>Are you sure you want to retire this asset?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRetireOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleRetire}>Retire</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AssetGrid;

