export type Language = "ar" | "en" | "fr";
export type Direction = "rtl" | "ltr";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  dir: Direction;
  flag: string;
}

export interface Translations {
  app: {
    title: string;
    subtitle: string;
    description: string;
    systemReady: string;
    systemOnline: string;
    systemOffline: string;
  };
  nav: {
    dashboard: string;
    fields: string;
    inventory: string;
    sensors: string;
    workers: string;
    analytics: string;
    calendar: string;
    aiInsights: string;
    settings: string;
    logout: string;
    climateOverview: string;
    algiersRegion: string;
    humidity: string;
    wind: string;
    sunny: string;
  };
  languages: {
    selectLanguage: string;
    en: string;
    ar: string;
    fr: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    update: string;
    close: string;
    search: string;
    filter: string;
    loading: string;
    noData: string;
    active: string;
    online: string;
    offline: string;
    busy: string;
    status: string;
    actions: string;
    viewAll: string;
    backToHome: string;
    pageNotFound: string;
    pageNotFoundDesc: string;
    ha: string;
    kg: string;
    celsius: string;
    items: string;
  };
  dashboard: {
    heroBadge: string;
    greeting: string;
    heroSubtitle: string;
    activeFields: string;
    totalSensors: string;
    efficiency: string;
    fieldsCard: string;
    sensorsCard: string;
    workersCard: string;
    inventoryCard: string;
    fieldsSub: string;
    sensorsSub: string;
    workersSub: string;
    inventorySub: string;
    live: string;
    lowStockNotice: string;
    quickOperations: string;
    startIrrigation: string;
    startIrrigationSub: string;
    applyFertilizer: string;
    applyFertilizerSub: string;
    logHarvest: string;
    logHarvestSub: string;
    setAlert: string;
    setAlertSub: string;
    recentOperations: string;
    activityBadge: string;
    noActivities: string;
    weatherForecast: string;
    tomorrow: string;
    wed: string;
    thu: string;
    fri: string;
  };
  fields: {
    title: string;
    subtitle: string;
    addField: string;
    addNewField: string;
    fieldName: string;
    fieldNamePlaceholder: string;
    cropType: string;
    sizeHectares: string;
    location: string;
    locationPlaceholder: string;
    searchPlaceholder: string;
    growthProgress: string;
    moistureLevel: string;
    statusActive: string;
    statusIrrigation: string;
    statusHarvest: string;
    statusFallow: string;
    crops: {
      wheat: string;
      barley: string;
      oats: string;
      corn: string;
      potatoes: string;
      tomatoes: string;
    };
  };
  inventory: {
    title: string;
    subtitle: string;
    addItem: string;
    addNewItem: string;
    itemName: string;
    itemNamePlaceholder: string;
    category: string;
    stock: string;
    maxCapacity: string;
    unit: string;
    unitPlaceholder: string;
    capacity: string;
    lowStock: string;
    categories: {
      all: string;
      seeds: string;
      fertilizer: string;
      equipment: string;
      pesticide: string;
      other: string;
    };
  };
  sensors: {
    title: string;
    subtitle: string;
    badge: string;
    optimal: string;
    warning: string;
    critical: string;
    moisture: string;
    soilTemp: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    phLevel: string;
    sensorUnits: string;
    liveTelemetry: string;
  };
  workers: {
    title: string;
    subtitle: string;
    addWorker: string;
    addNewWorker: string;
    fullName: string;
    fullNamePlaceholder: string;
    role: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    roles: {
      fieldManager: string;
      agronomist: string;
      equipmentOperator: string;
      dataAnalyst: string;
      irrigationTech: string;
      qualityInspector: string;
    };
  };
  calendar: {
    title: string;
    subtitle: string;
    addEvent: string;
    addNewEvent: string;
    eventTitle: string;
    eventTitlePlaceholder: string;
    dateTime: string;
    fieldOptional: string;
    selectField: string;
    assignToOptional: string;
    selectWorker: string;
    priority: string;
    low: string;
    medium: string;
    high: string;
    urgent: string;
    upcomingTasks: string;
    noUpcomingEvents: string;
    months: string[];
    weekdays: string[];
  };
  aiInsights: {
    title: string;
    subtitle: string;
    analysisReady: string;
    confidence: string;
    predictionAccuracy: string;
    predictionAccuracySubtitle: string;
    yieldLabel: string;
    weatherLabel: string;
    resourcesLabel: string;
    impactMetrics: string;
    estimatedSavings: string;
    yieldImprovement: string;
    waterOptimization: string;
    resourceEfficiency: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    periods: {
      last7Days: string;
      last30Days: string;
      lastQuarter: string;
      lastYear: string;
    };
    yieldPerformance: string;
    resourceEfficiency: string;
    waterEfficiency: string;
    fertilizerUtilization: string;
    energyConsumption: string;
    revenueTrend: string;
    wheat: string;
    barley: string;
    oats: string;
  };
  settings: {
    title: string;
    subtitle: string;
    languageAndRegion: string;
    languageLabel: string;
    languageDesc: string;
    appearance: string;
    lightMode: string;
    darkMode: string;
    system: string;
    connectivity: string;
    offlineMode: string;
    offlineModeDesc: string;
    autoSync: string;
    autoSyncDesc: string;
    farmLocationTitle: string;
    primaryLocation: string;
    updateGps: string;
    gpsTracking: string;
    gpsTrackingDesc: string;
    aiTitle: string;
    aiNotifications: string;
    aiNotificationsDesc: string;
    predictiveAnalytics: string;
    predictiveAnalyticsDesc: string;
    dataManagement: string;
    exportFarmData: string;
    exportFarmDataDesc: string;
    exportJson: string;
    clearLocalCache: string;
    clearLocalCacheDesc: string;
    clearCacheBtn: string;
    aboutTitle: string;
    aboutApp: string;
    aboutSubtitle: string;
    version: string;
    optimizedFor: string;
    badges: {
      offlineReady: string;
      aiPrecision: string;
      iotTelemetry: string;
    };
    toasts: {
      settingsUpdated: string;
      dataExported: string;
      cacheCleared: string;
    };
  };
  notifications: {
    title: string;
    markAllRead: string;
    noNotifications: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    name: string;
    namePlaceholder: string;
    role: string;
    accountTypeBadge: string;
    showPassword: string;
    hidePassword: string;
    submitLogin: string;
    submitRegister: string;
    signingIn: string;
    creatingAccount: string;
    alreadyHaveAccount: string;
    needAccount: string;
    backToHome: string;
    errors: {
      requiredField: string;
      nameRequired: string;
      emailRequired: string;
      invalidEmail: string;
      passwordRequired: string;
      passwordTooShort: string;
      confirmPasswordRequired: string;
      passwordMismatch: string;
      invalidCredentials: string;
      emailExists: string;
      serverError: string;
      networkError: string;
    };
    success: {
      registrationSuccess: string;
    };
  };
  rbac: {
    roleLabel: string;
    roles: {
      admin: string;
      manager: string;
      worker: string;
    };
    descriptions: {
      admin: string;
      manager: string;
      worker: string;
    };
    accessDenied: {
      title: string;
      message: string;
      currentRole: string;
      requiredCode: string;
      backToDashboard: string;
    };
    myRole: {
      title: string;
      subtitle: string;
      currentRole: string;
      roleDescription: string;
      permissionsSummary: string;
      systemAccessLevel: string;
      activeStatus: string;
      granted: string;
      restricted: string;
      capabilities: {
        dashboardView: string;
        fieldsManage: string;
        fieldsDelete: string;
        inventoryManage: string;
        inventoryDelete: string;
        sensorsManage: string;
        workersView: string;
        workersManage: string;
        workersDelete: string;
        analyticsView: string;
        aiInsightsView: string;
        calendarManage: string;
        systemAdmin: string;
      };
    };
    actions: {
      unauthorizedAction: string;
      adminOnly: string;
      managerOrAdmin: string;
    };
  };
  account: {
    menuTitle: string;
    login: string;
    profile: string;
    myRole: string;
    permissions: string;
    settings: string;
    logout: string;
    futureFeatures: string;
    userManagement: string;
    roleManagement: string;
    securitySessions: string;
    activityLog: string;
    reports: string;
    comingSoon: string;
    guest: string;
    guestDescription: string;
    manageAccount: string;
  };
}

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? ObjectType[Key] extends readonly unknown[]
      ? `${Key}` | `${Key}.${number}`
      : `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<Translations>;
