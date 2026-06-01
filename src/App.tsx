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
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/ai" element={<AiInsightsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}
