import { Routes, Route } from "react-router";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Fields from "@/pages/Fields";
import Inventory from "@/pages/Inventory";
import Sensors from "@/pages/Sensors";
import Workers from "@/pages/Workers";
import Analytics from "@/pages/Analytics";
import CalendarPage from "@/pages/Calendar";
import AiInsightsPage from "@/pages/AiInsights";
import SettingsPage from "@/pages/SettingsPage";
import AgriculturePage from "@/pages/Agriculture";
import CropDetailPage from "@/pages/CropDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import { RoleGuard } from "@/components/rbac/RoleGuard";
import { Toaster } from "@/components/ui/sonner";

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/agriculture" element={<AgriculturePage />} />
        <Route path="/agriculture/crops/:cropId" element={<CropDetailPage />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route
          path="/workers"
          element={
            <RoleGuard requiredPermission="workers.view">
              <Workers />
            </RoleGuard>
          }
        />
        <Route
          path="/analytics"
          element={
            <RoleGuard requiredPermission="analytics.view">
              <Analytics />
            </RoleGuard>
          }
        />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route
          path="/ai"
          element={
            <RoleGuard requiredPermission="aiInsights.view">
              <AiInsightsPage />
            </RoleGuard>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
      <Toaster />
    </>
  );
}
