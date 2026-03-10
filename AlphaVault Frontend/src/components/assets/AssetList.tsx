
import React, { useState, useEffect } from "react";
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
  assignee?: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    permissions: string;
  } | null;
  previousOwner?: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    permissions: string;
  } | null;
}

const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list"); // Default to list view
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
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
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(assets.map(asset => asset.type)))];

  return (
    <div className="space-y-6">
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
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "All Categories" : category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Assets Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getAssetIcon(asset.type)}
                    <div>
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{asset.type}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Transfer</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Retire</DropdownMenuItem>
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
                    INR {asset.purchasePrice.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p>{asset.location}</p>
                  </div>
                  {asset.assignee && (
                    <div>
                      <span className="text-muted-foreground">Assignee:</span>
                      <p className="font-medium">{asset.assignee.fullName}</p>
                    </div>
                  )}
                  {asset.previousOwner && (
                    <div>
                      <span className="text-muted-foreground">Previous Owner:</span>
                      <p className="font-medium">{asset.previousOwner.fullName}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getAssetIcon(asset.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground">{asset.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {asset.assignee && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Assigned to</p>
                          <p className="font-medium">{asset.assignee.fullName}</p>
                        </div>
                      )}
                      {asset.previousOwner && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Previous Owner</p>
                          <p className="font-medium">{asset.previousOwner.fullName}</p>
                        </div>
                      )}
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>{asset.location}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="font-medium text-green-600">INR {asset.purchasePrice.toLocaleString()}</p>
                      </div>
                      
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Transfer</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Retire</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredAssets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <Laptop className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No assets found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssetList;
