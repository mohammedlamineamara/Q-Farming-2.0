import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { trpc } from "../providers/trpc";
import { useI18n } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sprout,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { t, dir } = useI18n();
  const utils = trpc.useUtils();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => {
      const msg = err.message || "";
      if (msg.includes("Invalid email or password") || err.data?.code === "UNAUTHORIZED") {
        setServerError(t("auth.errors.invalidCredentials"));
      } else if (msg.includes("Too many requests") || err.data?.code === "TOO_MANY_REQUESTS") {
        setServerError(t("auth.errors.serverError"));
      } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setServerError(t("auth.errors.networkError"));
      } else {
        setServerError(t("auth.errors.serverError"));
      }
    },
  });

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = t("auth.errors.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = t("auth.errors.invalidEmail");
      }
    }

    if (!password) {
      errors.password = t("auth.errors.passwordRequired");
    } else if (password.length < 6) {
      errors.password = t("auth.errors.passwordTooShort");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate({
      email: email.trim().toLowerCase(),
      password,
    });
  };

  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      {/* Ambient background decoration */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          aria-label={t("common.backToHome")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {t("app.title")}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium leading-tight">
              {t("app.subtitle")}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl transition-all">
          <CardHeader className="text-center pb-4 pt-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-3 text-white">
              <Sprout className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t("auth.loginTitle")}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {t("auth.loginSubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* Server Error Alert */}
            {serverError && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="login-email"
                  className="text-slate-700 dark:text-slate-300 text-sm font-medium"
                >
                  {t("auth.email")}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    id="login-email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder={t("auth.emailPlaceholder")}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                      if (serverError) setServerError(null);
                    }}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
                    className={`ps-10 h-11 bg-slate-50/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus-visible:ring-emerald-500 transition-colors ${
                      fieldErrors.email ? "border-red-500 dark:border-red-500/80" : ""
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="login-email-error" className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="login-password"
                  className="text-slate-700 dark:text-slate-300 text-sm font-medium"
                >
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    autoComplete="current-password"
                    placeholder={t("auth.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                      if (serverError) setServerError(null);
                    }}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
                    className={`ps-10 pe-10 h-11 bg-slate-50/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus-visible:ring-emerald-500 transition-colors ${
                      fieldErrors.password ? "border-red-500 dark:border-red-500/80" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="login-password-error" className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                id="login-submit-btn"
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.99] transition-all cursor-pointer mt-2"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("auth.signingIn")}</span>
                  </span>
                ) : (
                  <span>{t("auth.submitLogin")}</span>
                )}
              </Button>
            </form>

            {/* Switch to Register */}
            <div className="pt-2 text-center border-t border-slate-200/80 dark:border-white/10">
              <Link
                to="/register"
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded p-1"
              >
                {t("auth.needAccount")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer Bar */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 z-10">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded p-1"
        >
          <BackArrow className="w-3.5 h-3.5" />
          <span>{t("auth.backToHome")}</span>
        </Link>
        <span>
          {t("app.title")} • {t("settings.version")}
        </span>
      </footer>
    </div>
  );
}


