
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  Building, 
  Clock, 
  FileCheck 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Legend
} from "recharts";

// Asset data for chart
const assetCategoryData = [
  { name: "Computer", value: 35 },
  { name: "Furniture", value: 25 },
  { name: "AV Equipment", value: 15 },
  { name: "IT Infrastructure", value: 18 },
  { name: "Transportation", value: 7 }
];

// Monthly data for bar chart
const monthlySpendData = [
  { name: "Jan", amt: 8500 },
  { name: "Feb", amt: 12300 },
  { name: "Mar", amt: 7800 },
  { name: "Apr", amt: 15200 },
  { name: "May", amt: 8900 }
];

// Approval data for charts
const approvalsByStatus = [
  { name: "Approved", value: 23, color: "#22c55e" },
  { name: "Pending", value: 14, color: "#3b82f6" },
  { name: "Rejected", value: 8, color: "#ef4444" },
];

// Colors for asset categories
const COLORS = ["#0694a2", "#1a365d", "#7e69ab", "#6E59A5", "#D6BCFA"];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    unassignedAssets: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5018/api/dashboard/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div onClick={() => navigate('/assets')} className="cursor-pointer">
            <StatCard
              title="Total Assets"
              value={stats.totalAssets.toString()}
              icon={<Briefcase className="h-5 w-5 text-company-blue" />}
              trend={{ value: "12%", positive: true }}
            />
          </div>
          <div onClick={() => navigate('/assets')} className="cursor-pointer">
            <StatCard
              title="Available Assets"
              value={`${stats.availableAssets} (${stats.totalAssets > 0 ? Math.round((stats.availableAssets / stats.totalAssets) * 100) : 0}%)`}
              icon={<FileCheck className="h-5 w-5 text-company-teal" />}
            />
          </div>
          <div onClick={() => navigate('/assets')} className="cursor-pointer">
            <StatCard
              title="Unassigned Assets"
              value={stats.unassignedAssets.toString()}
              icon={<Building className="h-5 w-5 text-company-blue" />}
            />
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="border shadow-sm rounded-lg cursor-pointer" onClick={() => navigate('/approvals')}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
