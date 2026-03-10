import { useMsal } from "@azure/msal-react";

// This is a placeholder for the actual user object type
interface User {
  permissions: string;
}

// This is a placeholder for a hook that returns the current user
const useUser = (): { user: User | null } => {
  // In a real application, you would fetch the user from your backend
  // and store it in a context or state management library.
  // For this example, we'll use a mock user.
  const { accounts } = useMsal();
  const user = {
    //This is a mock permission string. In a real application, this would be fetched from the backend.
    permissions: JSON.stringify({
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
    })
  };
  return { user: accounts.length > 0 ? user : null };
};

export const usePermissions = () => {
  const { user } = useUser();

  const hasPermission = (permission: string) => {
    if (!user || !user.permissions) {
      return false;
    }

    try {
      const permissions = JSON.parse(user.permissions);
      return permissions[permission] === true;
    } catch (error) {
      console.error("Failed to parse user permissions:", error);
      return false;
    }
  };

  return { hasPermission };
};