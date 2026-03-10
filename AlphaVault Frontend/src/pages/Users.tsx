
import Layout from "@/components/layout/Layout";
import UserList from "@/components/users/UserList";

const Users = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and configure access permissions
          </p>
        </div>
        
        <UserList />
      </div>
    </Layout>
  );
};

export default Users;
