import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";

interface ProcurementRequest {
  id: string;
  title: string;
  type: "Purchase" | "Maintenance" | "Disposal";
  requester: string;
  amount: number;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Rejected";
  description: string;
  dateSubmitted: string;
  stage: "Request" | "Approval" | "Quotation" | "Purchase" | "Receive";
  quotationId?: string;
  quotationAmount?: number;
  quotationVendor?: string;
  purchaseOrderNumber?: string;
  purchaseDate?: string;
  receiveDate?: string;
  receivedBy?: string;
}

interface ProcurementFormProps {
  onClose: () => void;
  procurementRequestToEdit?: ProcurementRequest | null;
}

interface FormData {
  title: string;
  type: "Purchase" | "Maintenance" | "Disposal";
  requester: string;
  amount: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  quotationId: string;
  quotationAmount: string;
  quotationVendor: string;
  purchaseOrderNumber: string;
  purchaseDate: string;
  receiveDate: string;
  receivedBy: string;
  stage: "Request" | "Approval" | "Quotation" | "Purchase" | "Receive";
}

const ProcurementForm: React.FC<ProcurementFormProps> = ({ onClose, procurementRequestToEdit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "Purchase",
    requester: "",
    amount: "",
    priority: "Medium",
    description: "",
    quotationId: "",
    quotationAmount: "",
    quotationVendor: "",
    purchaseOrderNumber: "",
    purchaseDate: "",
    receiveDate: "",
    receivedBy: "",
    stage: "Request",
  });

  useEffect(() => {
    if (procurementRequestToEdit) {
      setFormData(prev => ({
        ...prev,
        title: procurementRequestToEdit.title,
        type: procurementRequestToEdit.type,
        requester: procurementRequestToEdit.requester,
        amount: procurementRequestToEdit.amount.toString(),
        priority: procurementRequestToEdit.priority,
        description: procurementRequestToEdit.description,
        quotationId: procurementRequestToEdit.quotationId ?? "",
        quotationAmount: procurementRequestToEdit.quotationAmount?.toString() ?? "",
        quotationVendor: procurementRequestToEdit.quotationVendor ?? "",
        purchaseOrderNumber: procurementRequestToEdit.purchaseOrderNumber ?? "",
        purchaseDate: procurementRequestToEdit.purchaseDate ?? "",
        receiveDate: procurementRequestToEdit.receiveDate ?? "",
        receivedBy: procurementRequestToEdit.receivedBy ?? "",
        stage: procurementRequestToEdit.stage ?? "Request",
      }));
    }
  }, [procurementRequestToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = procurementRequestToEdit
      ? `http://localhost:5018/api/procurement/${procurementRequestToEdit.id}`
      : "http://localhost:5018/api/procurement";
    
    const method = procurementRequestToEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          quotationId: formData.quotationId,
          quotationAmount: parseFloat(formData.quotationAmount),
          quotationVendor: formData.quotationVendor,
          purchaseOrderNumber: formData.purchaseOrderNumber,
          purchaseDate: formData.purchaseDate,
          receiveDate: formData.receiveDate,
          receivedBy: formData.receivedBy,
          stage: formData.stage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${procurementRequestToEdit ? 'update' : 'create'} procurement request`);
      }

      toast({
        title: `Procurement request ${procurementRequestToEdit ? 'updated' : 'created'} successfully`,
        description: `${formData.title} has been ${procurementRequestToEdit ? 'updated' : 'added'}.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: `Error ${procurementRequestToEdit ? 'updating' : 'creating'} procurement request`,
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Procurement Request Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter request title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              required
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Disposal">Disposal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requester">Requester *</Label>
            <Input
              id="requester"
              name="requester"
              placeholder="Enter requester name"
              value={formData.requester}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (INR) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
              required
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter additional details about this request"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quotationId">Quotation ID</Label>
            <Input
              id="quotationId"
              name="quotationId"
              placeholder="Enter quotation ID"
              value={formData.quotationId}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quotationAmount">Quotation Amount</Label>
            <Input
              id="quotationAmount"
              name="quotationAmount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.quotationAmount}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quotationVendor">Quotation Vendor</Label>
            <Input
              id="quotationVendor"
              name="quotationVendor"
              placeholder="Enter quotation vendor"
              value={formData.quotationVendor}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
            <Input
              id="purchaseOrderNumber"
              name="purchaseOrderNumber"
              placeholder="Enter purchase order number"
              value={formData.purchaseOrderNumber}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiveDate">Receive Date</Label>
            <Input
              id="receiveDate"
              name="receiveDate"
              type="date"
              value={formData.receiveDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receivedBy">Received By</Label>
            <Input
              id="receivedBy"
              name="receivedBy"
              placeholder="Enter receiver name"
              value={formData.receivedBy}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle className="text-sm">Stage</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => handleSelectChange("stage", value)}
              required
            >
              <SelectTrigger id="stage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Request">Request</SelectItem>
                <SelectItem value="Approval">Approval</SelectItem>
                <SelectItem value="Quotation">Quotation</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Receive">Receive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
        
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{procurementRequestToEdit ? "Update Request" : "Create Request"}</Button>
      </div>
    </form>
  );
};

export default ProcurementForm;