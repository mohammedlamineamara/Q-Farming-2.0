import { useI18n } from "@/i18n";
import type { Language } from "@/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, supportedLanguages, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative gap-1.5 px-2.5 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 ${className || ""}`}
          aria-label={t("languages.selectLanguage")}
          title={t("languages.selectLanguage")}
        >
          <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
            {language}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-lg">
        {supportedLanguages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code as Language)}
              className="flex items-center justify-between cursor-pointer py-2 px-3 focus:bg-emerald-50 dark:focus:bg-emerald-500/10"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none" role="img" aria-label={lang.name}>
                  {lang.flag}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                    {lang.nativeName}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {lang.name}
                  </span>
                </div>
              </div>
              {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ms-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
