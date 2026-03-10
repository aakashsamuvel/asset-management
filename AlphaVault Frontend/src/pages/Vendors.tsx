
import React from "react";
import Layout from "@/components/layout/Layout";
import VendorList from "@/components/vendors/VendorList";

const VendorsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
        <p className="text-muted-foreground">
          Manage vendor relationships and view quotations.
        </p>
        
        <VendorList />
      </div>
    </Layout>
  );
};

export default VendorsPage;
