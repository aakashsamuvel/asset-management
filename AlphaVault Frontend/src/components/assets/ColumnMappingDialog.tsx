import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ColumnMappingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  headers: string[];
  onConfirm: (mappings: { [key: string]: string }) => void;
  file: File | null;
}

interface ColumnMapping {
  [key: string]: string;
}

const ColumnMappingDialog: React.FC<ColumnMappingDialogProps> = ({ isOpen, onClose, headers, onConfirm, file }) => {
  const [mappings, setMappings] = useState<ColumnMapping>({});

  const handleMappingChange = (header: string, value: string) => {
    setMappings((prevMappings) => ({
      ...prevMappings,
      [header]: value,
    }));
  };

  const assetFields = [
    { label: "ID", value: "id" },
    { label: "Name", value: "name" },
    { label: "Type", value: "type" },
    { label: "Location", value: "location" },
    { label: "Purchase Date", value: "purchaseDate" },
    { label: "Purchase Price", value: "purchasePrice" },
    { label: "Status", value: "status" },
    { label: "Model", value: "model" },
    { label: "Serial Number", value: "serialNumber" },
    { label: "Vendor", value: "vendor" },
    { label: "Warranty Start Date", value: "warrantyStartDate" },
    { label: "Warranty End Date", value: "warrantyEndDate" },
    // { label: "Warranty Provider", value: "warrantyProvider" },
    { label: "Description", value: "description" },
    { label: "Assignee ID", value: "assigneeId" },
    { label: "Previous Owner ID", value: "previousOwnerId" },
    { label: "Asset Given Date", value: "assetGivenDate" },
    { label: "Processor", value: "processor" },
    { label: "RAM", value: "ram" },
    { label: "Storage", value: "storage" },
    { label: "Screen Size", value: "screenSize" },
    { label: "Resolution", value: "resolution" },
    { label: "Panel Type", value: "panelType" },
    { label: "Refresh Rate", value: "refreshRate" },
    { label: "Connection Type", value: "connectionType" },
    { label: "Battery Life", value: "batteryLife" },
    { label: "Order Number", value: "orderNumber" },
  ];

  const half = Math.ceil(headers.length / 2);
  const headersLeft = headers.slice(0, half);
  const headersRight = headers.slice(half);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Map Columns</DialogTitle>
          <DialogDescription>
            Map the columns from your file to the corresponding asset fields.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            {headersLeft.map((header) => (
              <div key={header} className="grid grid-cols-2 items-center gap-4">
                <label htmlFor={header} className="text-right text-sm font-medium leading-none">
                  {header}
                </label>
                <div>
                  <Combobox
                    options={assetFields}
                    value={mappings[header] || ""}
                    onChange={(value) => handleMappingChange(header, value)}
                    placeholder="Select field"
                  />
                </div>
              </div>
            ))}
          </div>
          <div>
            {headersRight.map((header) => (
              <div key={header} className="grid grid-cols-2 items-center gap-4">
                <label htmlFor={header} className="text-right text-sm font-medium leading-none">
                  {header}
                </label>
                <div>
                  <Combobox
                    options={assetFields}
                    value={mappings[header] || ""}
                    onChange={(value) => handleMappingChange(header, value)}
                    placeholder="Select field"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => onConfirm(mappings)}>Confirm Mapping</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnMappingDialog;