import Layout from "@/components/layout/Layout";

const Budgets = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
          <p className="text-muted-foreground">
            Track and manage asset budgets and spending
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-muted-foreground">Budget management features coming soon.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Budgets;