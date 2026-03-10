
import React from "react";
import Layout from "@/components/layout/Layout";
import AssetGrid from "@/components/assets/AssetGrid";

const AssetsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AlphaVault</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all company assets with our modern, visual interface.
            </p>
          </div>
        </div>
        
        <AssetGrid />
      </div>
    </Layout>
  );
};

export default AssetsPage;
