import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vendors } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Asset as GridAsset } from "./AssetGrid";

interface Asset {
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
}

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  permissions: string;
}

interface Vendor {
  id: number;
  name: string;
}

interface AssetFormProps {
  onClose: () => void;
  assetToEdit?: Asset | null;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  category: "" | "Laptop" | "Monitor" | "Mouse" | "Keyboard" |"Desktop"| "Other";
  status: string;
  location: string;
  purchaseDate: string;
  cost: string;
  vendor: string;
  model: string;
  serialNumber: string;
  description: string;
  warrantyStartDate: string | null;
  warrantyEndDate: string | null;
  warrantyProvider: string;
  assigneeId: number | null;
  previousOwnerId: string | null;
  assetGivenDate: string | null;
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
}

const AssetForm: React.FC<AssetFormProps> = ({ onClose, assetToEdit, onSuccess }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "" as "Laptop" | "Monitor" | "Mouse" | "Keyboard" |"Desktop" | "Other" | "",
    status: "Available",
    location: "",
    purchaseDate: "",
    cost: "",
    vendor: "",
    model: "",
    serialNumber: "",
    description: "",
    warrantyStartDate: null,
    warrantyEndDate: null,
    warrantyProvider: "",
    assigneeId: null as number | null,
    previousOwnerId: null as string | null,
    assetGivenDate: null,
    // Specifications
    processor: "",
    ram: "",
    storage: "",
    screenSize: "",
    resolution: "",
    panelType: "",
    refreshRate: "",
    connectionType: "" as "Wired" | "Wireless" | "Bluetooth" | "",
    batteryLife: "",
    orderNumber: null,
  });

  useEffect(() => {
    fetchUsers();
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch("http://localhost:5018/api/vendors");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    }
  };

  useEffect(() => {
    const populateFormData = async () => {
      if (assetToEdit) {
        // Wait for users to be fetched
        if (users.length === 0) {
          await fetchUsers();
        }

        setFormData({
          name: assetToEdit.name,
          category: assetToEdit.type as any,
          status: assetToEdit.status,
          location: assetToEdit.location,
          purchaseDate: new Date(assetToEdit.purchaseDate).toISOString().split('T')[0],
          cost: assetToEdit.purchasePrice.toString(),
          vendor: assetToEdit.vendor,
          model: assetToEdit.model,
          serialNumber: assetToEdit.serialNumber,
          description: assetToEdit.description || "",
          warrantyStartDate: assetToEdit.warrantyStartDate ? new Date(assetToEdit.warrantyStartDate).toISOString().split('T')[0] : null,
          warrantyEndDate: assetToEdit.warrantyEndDate ? new Date(assetToEdit.warrantyEndDate).toISOString().split('T')[0] : null,
          warrantyProvider: assetToEdit.warrantyProvider || "",
          assigneeId: assetToEdit.assigneeId || null,
          previousOwnerId: assetToEdit.previousOwnerId?.toString() || null,
          assetGivenDate: assetToEdit.assetGivenDate ? new Date(assetToEdit.assetGivenDate).toISOString().split('T')[0] : null,
          processor: assetToEdit.processor || "",
          ram: assetToEdit.ram || "",
          storage: assetToEdit.storage || "",
          screenSize: assetToEdit.screenSize || "",
          resolution: assetToEdit.resolution || "",
          panelType: assetToEdit.panelType || "",
          refreshRate: assetToEdit.refreshRate || "",
          connectionType: assetToEdit.connectionType as any,
          batteryLife: assetToEdit.batteryLife || "",
          orderNumber: assetToEdit.orderNumber || null,
        });
      }
    };

    populateFormData();
  }, [assetToEdit, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5018/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "assigneeId" || name === "previousOwnerId") {
      setFormData((prev) => ({ ...prev, [name]: value === "null" ? null : parseInt(value, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = assetToEdit
      ? `http://localhost:5018/api/assets/${assetToEdit.id}`
      : "http://localhost:5018/api/assets";
    
    const method = assetToEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: assetToEdit?.id,
          type: formData.category,
          purchasePrice: parseFloat(formData.cost),
          assigneeId: formData.assigneeId,
          previousOwnerId: formData.previousOwnerId,
          assetGivenDate: formData.assetGivenDate,
          orderNumber: formData.orderNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${assetToEdit ? 'update' : 'create'} asset`);
      }

      toast({
        title: `Asset ${assetToEdit ? 'updated' : 'created'} successfully`,
        description: `${formData.name} has been ${assetToEdit ? 'updated' : 'added to your asset inventory'}.`,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: `Error ${assetToEdit ? 'updating' : 'creating'} asset`,
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const renderSpecificationFields = () => {
    switch (formData.category) {
      case "Laptop":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Laptop Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processor">Processor</Label>
                <Input
                  id="processor"
                  name="processor"
                  placeholder="e.g., Intel Core i7, Apple M2"
                  value={formData.processor}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ram">RAM</Label>
                <Input
                  id="ram"
                  name="ram"
                  placeholder="e.g., 16GB DDR4"
                  value={formData.ram}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage">Storage</Label>
                <Input
                  id="storage"
                  name="storage"
                  placeholder="e.g., 512GB SSD"
                  value={formData.storage}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="screenSize">Screen Size</Label>
                <Input
                  id="screenSize"
                  name="screenSize"
                  placeholder="e.g., 15.6-inch"
                  value={formData.screenSize}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case "Monitor":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Monitor Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="screenSize">Screen Size</Label>
                <Input
                  id="screenSize"
                  name="screenSize"
                  placeholder="e.g., 27-inch"
                  value={formData.screenSize}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Input
                  id="resolution"
                  name="resolution"
                  placeholder="e.g., 2560 x 1440"
                  value={formData.resolution}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panelType">Panel Type</Label>
                <Select
                  value={formData.panelType}
                  onValueChange={(value) => handleSelectChange("panelType", value)}
                >
                  <SelectTrigger id="panelType">
                    <SelectValue placeholder="Select panel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IPS">IPS</SelectItem>
                    <SelectItem value="VA">VA</SelectItem>
                    <SelectItem value="TN">TN</SelectItem>
                    <SelectItem value="OLED">OLED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="refreshRate">Refresh Rate</Label>
                <Input
                  id="refreshRate"
                  name="refreshRate"
                  placeholder="e.g., 144Hz"
                  value={formData.refreshRate}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case "Mouse":
      case "Keyboard":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{formData.category} Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connectionType">Connection Type</Label>
                <Select
                  value={formData.connectionType}
                  onValueChange={(value) => handleSelectChange("connectionType", value)}
                >
                  <SelectTrigger id="connectionType">
                    <SelectValue placeholder="Select connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wired">Wired</SelectItem>
                    <SelectItem value="Wireless">Wireless</SelectItem>
                    <SelectItem value="Bluetooth">Bluetooth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(formData.connectionType === "Wireless" || formData.connectionType === "Bluetooth") && (
                <div className="space-y-2">
                  <Label htmlFor="batteryLife">Battery Life</Label>
                  <Input
                    id="batteryLife"
                    name="batteryLife"
                    placeholder="e.g., Up to 70 days"
                    value={formData.batteryLife}
                    onChange={handleChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter asset name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Monitor">Monitor</SelectItem>
                <SelectItem value="Mouse">Mouse</SelectItem>
                <SelectItem value="Keyboard">Keyboard</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="External HDD">External HDD</SelectItem>
                <SelectItem value="Headset">Headset</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Monitor Stand">Monitor Stand</SelectItem>
                <SelectItem value="Pendrive">Pendrive</SelectItem>
                <SelectItem value="WebCam">WebCam</SelectItem>
                <SelectItem value="HDMI">HDMI</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              placeholder="Product model"
              value={formData.model}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              name="serialNumber"
              placeholder="Serial number"
              value={formData.serialNumber}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
              required
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="In Repair">In Repair</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
                <SelectItem value="Damage">Damage</SelectItem>
                <SelectItem value="Donated">Donated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              placeholder="Where is this asset located?"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Remarks</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter additional details about this asset"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
           <Label htmlFor="assigneeId">Assignee</Label>
           <Combobox
              options={users.map(user => ({ label: user.fullName, value: user.id.toString() }))}
              value={formData.assigneeId?.toString()}
              onChange={(value) => handleSelectChange("assigneeId", value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="previousOwnerId">Previous Owner</Label>
            <Combobox
              options={users.map(user => ({ label: user.fullName, value: user.id.toString() }))}
              value={formData.previousOwnerId?.toString()}
              onChange={(value) => handleSelectChange("previousOwnerId", value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assetGivenDate">Asset Given Date</Label>
            <Input
              id="assetGivenDate"
              name="assetGivenDate"
              type="date"
              value={formData.assetGivenDate || ""}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order #</Label>
            <Input
              id="orderNumber"
              name="orderNumber"
              placeholder="Enter order number"
              value={formData.orderNumber || ""}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

    {/* Warranty Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Warranty Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="warrantyStartDate">Warranty Start Date</Label>
            <Input
              id="warrantyStartDate"
              name="warrantyStartDate"
              type="date"
              value={formData.warrantyStartDate || ""}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="warrantyEndDate">Warranty End Date</Label>
            <Input
              id="warrantyEndDate"
              name="warrantyEndDate"
              type="date"
              value={formData.warrantyEndDate || ""}
              onChange={handleChange}
            />
          </div>
          
          {/* <div className="space-y-2 col-span-2">
            <Label htmlFor="warrantyProvider">Warranty Provider</Label>
            <Input
              id="warrantyProvider"
              name="warrantyProvider"
              placeholder="Warranty provider name"
              value={formData.warrantyProvider}
              onChange={handleChange}
            />
          </div> */}
        </CardContent>
      </Card>

      {/* Category-specific specifications */}
      {formData.category && renderSpecificationFields()}

      {/* Purchase Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Purchase Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Cost (INR) *</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.cost}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="vendor">Vendor *</Label>
              <Select
                value={formData.vendor}
                onValueChange={(value) => handleSelectChange("vendor", value)}
                required
              >
                <SelectTrigger id="vendor">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{assetToEdit ? "Update Asset" : "Create Asset"}</Button>
        </div>
      </form>
    );
  };

export default AssetForm;
