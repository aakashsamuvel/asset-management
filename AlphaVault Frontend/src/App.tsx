
import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { AuthProvider } from "./components/auth/AuthContext";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AssetsPage from "./pages/Assets";
import VendorsPage from "./pages/Vendors";
import ProcurementPage from "./pages/Procurement";
import UsersPage from "./pages/Users";
import BudgetsPage from "./pages/Budgets";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import RecycleBinPage from "./pages/RecycleBin";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();
const msalInstance = new PublicClientApplication(msalConfig);

const App = () => (
  <MsalProvider instance={msalInstance}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthenticatedTemplate>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/assets" element={<AssetsPage />} />
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/procurement" element={<ProcurementPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/budgets" element={<BudgetsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/recycle-bin" element={<RecycleBinPage />} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </UnauthenticatedTemplate>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </MsalProvider>
);

export default App;
