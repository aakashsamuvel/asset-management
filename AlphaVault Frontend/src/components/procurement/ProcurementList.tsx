
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Search, MoreHorizontal, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ProcurementRequest, procurementRequests } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import ProcurementForm from "./ProcurementForm";

const ProcurementList: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddProcurementOpen, setIsAddProcurementOpen] = useState(false);
  const [editingProcurement, setEditingProcurement] = useState<ProcurementRequest | null>(null);

  // Filter requests based on search
  const filteredRequests = procurementRequests.filter((request) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      request.title.toLowerCase().includes(searchTermLower) ||
      request.requester.toLowerCase().includes(searchTermLower) ||
      request.type.toLowerCase().includes(searchTermLower)
    );
  });

  const getStatusBadge = (status: ProcurementRequest["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "Approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: ApprovalRequest["type"]) => {
    switch (type) {
      case "Purchase":
        return <Badge className="bg-blue-100 text-blue-800">Purchase</Badge>;
      case "Maintenance":
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      case "Disposal":
        return <Badge className="bg-gray-100 text-gray-800">Disposal</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getPriorityIcon = (priority: ProcurementRequest["priority"]) => {
    switch (priority) {
      case "High":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "Medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const response = await fetch(`http://localhost:5018/api/procurement/${requestId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to approve request");
      }

      toast({
        title: "Request Approved",
        description: "The approval request has been approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error approving request",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`http://localhost:5018/api/procurement/${requestId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "Rejected from UI" }), // You might want to add a dialog to get the reason from the user
      });

      if (!response.ok) {
        throw new Error("Failed to reject request");
      }

      toast({
        title: "Request Rejected",
        description: "The approval request has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error rejecting request",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

    const handleEditProcurement = (procurement: ProcurementRequest) => {
        setEditingProcurement(procurement);
        setIsAddProcurementOpen(true);
    };

  const openDetailModal = (request: ProcurementRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Procurement Requests</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddProcurementOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Procurement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{request.title}</TableCell>
                    <TableCell>{getTypeBadge(request.type)}</TableCell>
                    <TableCell>{request.requester}</TableCell>
                    <TableCell className="font-medium">${request.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(request.priority)}
                        <span className="text-sm">{request.priority}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(request.dateSubmitted).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetailModal(request)}>
                            View details
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleEditProcurement(request)}>
                            Edit
                          </DropdownMenuItem>
                          {request.status === "Pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(request.id)}>
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(request.id)}>
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No approval requests found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]" aria-describedby="approval-details-description">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <p id="approval-details-description" className="text-muted-foreground text-sm">
                View details of the procurement request.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm">{selectedRequest.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="mt-1">{getTypeBadge(selectedRequest.type)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Requester</Label>
                  <p className="text-sm">{selectedRequest.requester}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm font-medium">${selectedRequest.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getPriorityIcon(selectedRequest.priority)}
                    <span className="text-sm">{selectedRequest.priority}</span>
                  </div>
                </div>
                 <div>
                  <Label className="text-sm font-medium">Stage</Label>
                  <p className="text-sm">{selectedRequest.stage}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Quotation ID</Label>
                  <p className="text-sm">{selectedRequest.quotationId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Quotation Amount</Label>
                  <p className="text-sm">${selectedRequest.quotationAmount?.toLocaleString()}</p>
                </div>
                 <div>
                  <Label className="text-sm font-medium">Quotation Vendor</Label>
                  <p className="text-sm">{selectedRequest.quotationVendor}</p>
                </div>
                 <div>
                  <Label className="text-sm font-medium">Purchase Order Number</Label>
                  <p className="text-sm">{selectedRequest.purchaseOrderNumber}</p>
                </div>
                 <div>
                  <Label className="text-sm font-medium">Purchase Date</Label>
                  <p className="text-sm">{selectedRequest.purchaseDate}</p>
                </div>
                 <div>
                  <Label className="text-sm font-medium">Receive Date</Label>
                  <p className="text-sm">{selectedRequest.receiveDate}</p>
                </div>
                 <div>
                  <Label className="text-sm font-medium">Received By</Label>
                  <p className="text-sm">{selectedRequest.receivedBy}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm mt-1">{selectedRequest.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Date Submitted</Label>
                <p className="text-sm">{new Date(selectedRequest.dateSubmitted).toLocaleDateString()}</p>
              </div>
              
              {selectedRequest.status === "Pending" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setIsDetailOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setIsDetailOpen(false);
                    }}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Procurement Modal */}
     <Dialog open={isAddProcurementOpen} onOpenChange={setIsAddProcurementOpen}>
       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="procurement-form-description">
         <DialogHeader>
           <DialogTitle>{editingProcurement ? "Edit Procurement Request" : "Add New Procurement Request"}</DialogTitle>
         </DialogHeader>
         <ProcurementForm
           onClose={() => {
               setIsAddProcurementOpen(false);
               setEditingProcurement(null);
           }}
           procurementRequestToEdit={editingProcurement as ProcurementRequest}
         />
       </DialogContent>
     </Dialog>
    </>
  );
};

export default ProcurementList;
