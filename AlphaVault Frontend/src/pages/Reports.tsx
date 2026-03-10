import Layout from "@/components/layout/Layout";

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view asset management reports
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-muted-foreground">Reporting features coming soon.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;