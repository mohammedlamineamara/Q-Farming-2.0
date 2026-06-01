import { getDb } from "../api/queries/connection";
import {
  fields,
  inventoryItems,
  sensors,
  workers,
  activities,
  aiInsights,
  calendarEvents,
  notifications,
  settings,
} from "./schema";

async function seed() {
  const db = getDb();

  // Default userId = 1 (first admin user)
  const userId = 1;

  // ─── Seed Fields ─────────────────────────────────────────────
  await db.insert(fields).values([
    {
      name: "Field A - Wheat",
      crop: "Wheat",
      size: "12.5",
      status: "active",
      progress: 78,
      location: "Algiers North",
      lat: "36.75°N",
      lng: "3.06°E",
      moisture: 68,
      temp: 31,
      userId,
    },
    {
      name: "Field B - Barley",
      crop: "Barley",
      size: "8.3",
      status: "irrigation",
      progress: 45,
      location: "Algiers South",
      lat: "36.72°N",
      lng: "3.08°E",
      moisture: 72,
      temp: 33,
      userId,
    },
    {
      name: "Field C - Oats",
      crop: "Oats",
      size: "5.0",
      status: "harvest",
      progress: 92,
      location: "Blida",
      lat: "36.48°N",
      lng: "2.83°E",
      moisture: 55,
      temp: 30,
      userId,
    },
  ]);
  console.log("✅ Fields seeded");

  // ─── Seed Inventory ──────────────────────────────────────────
  await db.insert(inventoryItems).values([
    { name: "Wheat Seeds", category: "seeds", stock: 450, unit: "kg", icon: "🌱", max: 500, userId },
    { name: "NPK Fertilizer", category: "fertilizer", stock: 12, unit: "bags", icon: "🧪", max: 50, userId },
    { name: "Drip Irrigation", category: "equipment", stock: 3, unit: "units", icon: "💧", max: 10, userId },
    { name: "Barley Seeds", category: "seeds", stock: 200, unit: "kg", icon: "🌱", max: 300, userId },
    { name: "Organic Compost", category: "fertilizer", stock: 25, unit: "bags", icon: "🧪", max: 40, userId },
    { name: "Tractor Tires", category: "equipment", stock: 2, unit: "pcs", icon: "🔧", max: 8, userId },
    { name: "Pesticide A", category: "pesticide", stock: 8, unit: "L", icon: "🛡️", max: 20, userId },
    { name: "Corn Seeds", category: "seeds", stock: 320, unit: "kg", icon: "🌱", max: 400, userId },
  ]);
  console.log("✅ Inventory seeded");

  // ─── Seed Sensors ────────────────────────────────────────────
  await db.insert(sensors).values([
    { name: "Soil Moisture", value: "68", unit: "%", max: 100, status: "optimal", color: "#10b981", icon: "💧", fieldId: 1, userId },
    { name: "Temperature", value: "31", unit: "°C", max: 50, status: "optimal", color: "#f59e0b", icon: "🌡️", fieldId: 1, userId },
    { name: "Humidity", value: "45", unit: "%", max: 100, status: "optimal", color: "#3b82f6", icon: "💨", fieldId: 1, userId },
    { name: "pH Level", value: "6.8", unit: "pH", max: 14, status: "optimal", color: "#8b5cf6", icon: "⚗️", fieldId: 2, userId },
    { name: "Nitrogen", value: "45", unit: "%", max: 100, status: "warning", color: "#06b6d4", icon: "🧪", fieldId: 2, userId },
    { name: "Light Intensity", value: "850", unit: "lux", max: 1000, status: "optimal", color: "#fbbf24", icon: "☀️", fieldId: 3, userId },
    { name: "CO2 Level", value: "420", unit: "ppm", max: 600, status: "optimal", color: "#10b981", icon: "🌬️", fieldId: 3, userId },
    { name: "Wind Speed", value: "12", unit: "km/h", max: 30, status: "optimal", color: "#60a5fa", icon: "💨", fieldId: 1, userId },
  ]);
  console.log("✅ Sensors seeded");

  // ─── Seed Workers ────────────────────────────────────────────
  await db.insert(workers).values([
    { name: "Ahmed B.", role: "Field Manager", status: "online", avatar: "👨‍🌾", phone: "+2135550001", email: "ahmed@qfarming.com", userId },
    { name: "Fatima K.", role: "Agronomist", status: "online", avatar: "👩‍🔬", phone: "+2135550002", email: "fatima@qfarming.com", userId },
    { name: "Karim M.", role: "Equipment Operator", status: "busy", avatar: "👷", phone: "+2135550003", email: "karim@qfarming.com", userId },
    { name: "Amina R.", role: "Data Analyst", status: "online", avatar: "👩‍💻", phone: "+2135550004", email: "amina@qfarming.com", userId },
    { name: "Youssef T.", role: "Irrigation Tech", status: "offline", avatar: "👨‍🔧", phone: "+2135550005", email: "youssef@qfarming.com", userId },
    { name: "Sara L.", role: "Quality Inspector", status: "online", avatar: "👩‍🔬", phone: "+2135550006", email: "sara@qfarming.com", userId },
  ]);
  console.log("✅ Workers seeded");

  // ─── Seed Activities ─────────────────────────────────────────
  await db.insert(activities).values([
    { title: "Irrigation completed - Field A", icon: "💧", type: "success", read: false, userId },
    { title: "Fertilizer applied - Field B", icon: "🧪", type: "warning", read: false, userId },
    { title: "Harvest started - Field C", icon: "🌾", type: "success", read: true, userId },
    { title: "Weather alert: High temp expected", icon: "☀️", type: "danger", read: true, userId },
    { title: "Sensor calibration complete", icon: "📡", type: "info", read: true, userId },
    { title: "Inventory restocked - Seeds", icon: "📦", type: "success", read: true, userId },
  ]);
  console.log("✅ Activities seeded");

  // ─── Seed AI Insights ────────────────────────────────────────
  await db.insert(aiInsights).values([
    {
      title: "Water Optimization Recommendation",
      content: "Based on soil moisture sensors and weather forecast, AI recommends reducing irrigation by 15% for Field A. Current soil moisture at 68% is above optimal threshold. Estimated water savings: 367L/day.",
      icon: "💧",
      confidence: 94,
      category: "water",
      userId,
    },
    {
      title: "Harvest Prediction",
      content: "Field C (Oats) is predicted to reach optimal harvest maturity in 3 days. Current growth stage: 92% complete. Weather forecast shows favorable conditions. Recommended harvest window: June 2-4, 2026.",
      icon: "🌾",
      confidence: 91,
      category: "harvest",
      userId,
    },
    {
      title: "Fertilizer Schedule Optimization",
      content: "Nitrogen levels in Field B are declining faster than projected. AI suggests advancing next fertilizer application by 2 days. Current NPK balance: N-45%, P-32%, K-38%. Target: N-50%, P-30%, K-35%.",
      icon: "🧪",
      confidence: 88,
      category: "fertilizer",
      userId,
    },
    {
      title: "Weather Risk Alert",
      content: "High probability of heatwave (38°C+) in next 48 hours. AI recommends activating shade nets for sensitive crops and increasing evening irrigation cycles. UV index expected to reach 9+ on Thursday.",
      icon: "⚠️",
      confidence: 87,
      category: "weather",
      userId,
    },
  ]);
  console.log("✅ AI Insights seeded");

  // ─── Seed Calendar Events ────────────────────────────────────
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const wednesday = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const friday = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  const saturday = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  await db.insert(calendarEvents).values([
    { title: "Irrigation - Field A", description: "Morning irrigation cycle", eventDate: tomorrow, fieldId: 1, workerId: 5, priority: "high", userId },
    { title: "Fertilizer Application - Field B", description: "NPK fertilizer application", eventDate: wednesday, fieldId: 2, workerId: 2, priority: "medium", userId },
    { title: "Harvest - Field C", description: "Oats harvest operation", eventDate: friday, fieldId: 3, workerId: 1, priority: "urgent", userId },
    { title: "Equipment Maintenance", description: "Tractor service and inspection", eventDate: saturday, workerId: 3, priority: "low", userId },
  ]);
  console.log("✅ Calendar Events seeded");

  // ─── Seed Notifications ──────────────────────────────────────
  await db.insert(notifications).values([
    { title: "Irrigation Complete", description: "Field A - Wheat irrigation cycle completed successfully", icon: "💧", read: false, userId },
    { title: "Weather Alert", description: "High temperature expected tomorrow - 38°C peak", icon: "⚠️", read: false, userId },
    { title: "Low Stock Alert", description: "NPK Fertilizer stock below threshold (12 bags remaining)", icon: "📦", read: true, userId },
    { title: "Harvest Ready", description: "Field C - Oats at 92% maturity, ready for harvest", icon: "🌾", read: true, userId },
  ]);
  console.log("✅ Notifications seeded");

  // ─── Seed Settings ───────────────────────────────────────────
  await db.insert(settings).values([
    {
      userId,
      theme: "dark",
      offlineMode: true,
      autoSync: true,
      gpsTracking: true,
      aiNotifications: true,
      predictiveAnalytics: true,
      farmLocation: "Algiers, Algeria",
    },
  ]);
  console.log("✅ Settings seeded");

  console.log("\n🌾 Q-Farming 2.0 database seeded successfully!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
