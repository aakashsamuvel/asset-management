
import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/authConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  permissions: string;
}

interface UserFormProps {
  onClose: () => void;
  user?: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ onClose, user }) => {
  const { instance, accounts } = useMsal();
  const { toast } = useToast();
  const [azureUsers, setAzureUsers] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    permissions: {
      viewAssets: false,
      manageAssets: false,
      viewVendors: false,
      manageVendors: false,
      viewApprovals: false,
      manageApprovals: false,
      viewUsers: false,
      manageUsers: false,
      viewReports: false,
      manageSettings: false
    }
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        permissions: JSON.parse(user.permissions || '{}')
      });
    } else {
      const fetchAzureUsers = async () => {
        try {
          const request = {
            ...loginRequest,
            account: accounts[0]
          };

          const authResult = await instance.acquireTokenSilent(request);
          const token = authResult.accessToken;

          const response = await fetch("http://localhost:5018/api/users/azure-ad", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error("Failed to fetch Azure AD users");
          }

          const responseData = await response.json();
          setAzureUsers(responseData.users);
        } catch (error) {
          toast({
            title: "Error",
            description: (error as Error).message,
            variant: "destructive"
          });
        }
      };

      fetchAzureUsers();
    }
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = user ? `http://localhost:5018/api/users/${user.id}` : "http://localhost:5018/api/users";
      const method = user ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user?.id,
          ...formData,
          permissions: JSON.stringify(formData.permissions)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${user ? 'update' : 'create'} user`);
      }

      toast({
        title: "Success",
        description: `User ${user ? 'updated' : 'created'} successfully`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  const setRolePermissions = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    
    // Set default permissions based on role
    let defaultPermissions = {
      viewAssets: false,
      manageAssets: false,
      viewVendors: false,
      manageVendors: false,
      viewApprovals: false,
      manageApprovals: false,
      viewUsers: false,
      manageUsers: false,
      viewReports: false,
      manageSettings: false
    };

    switch (role) {
      case "Admin":
        defaultPermissions = {
          viewAssets: true,
          manageAssets: true,
          viewVendors: true,
          manageVendors: true,
          viewApprovals: true,
          manageApprovals: true,
          viewUsers: true,
          manageUsers: true,
          viewReports: true,
          manageSettings: true
        };
        break;
      case "Manager":
        defaultPermissions = {
          viewAssets: true,
          manageAssets: true,
          viewVendors: true,
          manageVendors: false,
          viewApprovals: true,
          manageApprovals: true,
          viewUsers: true,
          manageUsers: false,
          viewReports: true,
          manageSettings: false
        };
        break;
      case "Staff":
        defaultPermissions = {
          viewAssets: true,
          manageAssets: false,
          viewVendors: true,
          manageVendors: false,
          viewApprovals: true,
          manageApprovals: false,
          viewUsers: false,
          manageUsers: false,
          viewReports: false,
          manageSettings: false
        };
        break;
    }

    setFormData(prev => ({
      ...prev,
      permissions: defaultPermissions
    }));
  };

  const handleAzureUserChange = (value: string) => {
    const selectedUser = azureUsers.find(u => u.userPrincipalName === value);
    if (selectedUser) {
      setFormData(prev => ({
        ...prev,
        fullName: selectedUser.displayName,
        email: selectedUser.userPrincipalName
      }));
    }
    setOpen(false)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="azure-user">Select User from Azure AD</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
              disabled={!!user}
            >
              {formData.email
                ? azureUsers.find(u => u.userPrincipalName === formData.email)?.displayName
                : "Select a user"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search user..." />
              <CommandList>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {azureUsers.map(u => (
                    <CommandItem
                      key={u.userPrincipalName}
                      value={u.userPrincipalName}
                      onSelect={handleAzureUserChange}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.email === u.userPrincipalName ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {u.displayName} ({u.userPrincipalName})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Enter full name"
            required
            disabled={!!user || !!formData.email}
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
            required
            disabled={!!user || !!formData.email}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="role">Role *</Label>
        <Select value={formData.role} onValueChange={setRolePermissions}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Contributor</SelectItem>
            <SelectItem value="Staff">Reader</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Access Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Assets</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viewAssets"
                  checked={formData.permissions.viewAssets}
                  onCheckedChange={(checked) => handlePermissionChange("viewAssets", checked as boolean)}
                />
                <Label htmlFor="viewAssets">View Assets</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageAssets"
                  checked={formData.permissions.manageAssets}
                  onCheckedChange={(checked) => handlePermissionChange("manageAssets", checked as boolean)}
                />
                <Label htmlFor="manageAssets">Manage Assets</Label>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Vendors</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viewVendors"
                  checked={formData.permissions.viewVendors}
                  onCheckedChange={(checked) => handlePermissionChange("viewVendors", checked as boolean)}
                />
                <Label htmlFor="viewVendors">View Vendors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageVendors"
                  checked={formData.permissions.manageVendors}
                  onCheckedChange={(checked) => handlePermissionChange("manageVendors", checked as boolean)}
                />
                <Label htmlFor="manageVendors">Manage Vendors</Label>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Approvals</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viewApprovals"
                  checked={formData.permissions.viewApprovals}
                  onCheckedChange={(checked) => handlePermissionChange("viewApprovals", checked as boolean)}
                />
                <Label htmlFor="viewApprovals">View Approvals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageApprovals"
                  checked={formData.permissions.manageApprovals}
                  onCheckedChange={(checked) => handlePermissionChange("manageApprovals", checked as boolean)}
                />
                <Label htmlFor="manageApprovals">Manage Approvals</Label>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Administration</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viewUsers"
                  checked={formData.permissions.viewUsers}
                  onCheckedChange={(checked) => handlePermissionChange("viewUsers", checked as boolean)}
                />
                <Label htmlFor="viewUsers">View Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageUsers"
                  checked={formData.permissions.manageUsers}
                  onCheckedChange={(checked) => handlePermissionChange("manageUsers", checked as boolean)}
                />
                <Label htmlFor="manageUsers">Manage Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viewReports"
                  checked={formData.permissions.viewReports}
                  onCheckedChange={(checked) => handlePermissionChange("viewReports", checked as boolean)}
                />
                <Label htmlFor="viewReports">View Reports</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageSettings"
                  checked={formData.permissions.manageSettings}
                  onCheckedChange={(checked) => handlePermissionChange("manageSettings", checked as boolean)}
                />
                <Label htmlFor="manageSettings">Manage Settings</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {user ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
