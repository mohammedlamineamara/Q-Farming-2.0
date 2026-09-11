import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { useI18n } from "@/i18n";
import { Sprout } from "lucide-react";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-sm text-center bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg">
        <CardHeader className="pb-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 mb-2 text-white">
            <Sprout className="w-6 h-6" />
          </div>
          <CardTitle className="text-4xl font-bold text-slate-900 dark:text-white">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("common.pageNotFoundDesc")}</p>
          <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white cursor-pointer">
            <Link to="/">{t("common.backToHome")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

