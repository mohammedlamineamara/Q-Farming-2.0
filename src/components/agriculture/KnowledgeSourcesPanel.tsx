import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Building2 } from "lucide-react";

interface KnowledgeSource {
  id: string;
  acronym: string;
  fullName: { en: string; ar: string; fr: string };
  institutionType: string;
  url?: string;
  provenance: string;
}

interface KnowledgeSourcesPanelProps {
  sources: KnowledgeSource[];
}

export function KnowledgeSourcesPanel({ sources }: KnowledgeSourcesPanelProps) {
  const { language } = useI18n();

  const getLocalizedName = (s: KnowledgeSource) => {
    if (language === "ar") return s.fullName.ar;
    if (language === "fr") return s.fullName.fr;
    return s.fullName.en;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {sources.map((source) => (
        <div
          key={source.id}
          className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 font-mono">
                {source.acronym}
              </span>
              <Badge variant="outline" className="text-[10px] capitalize text-slate-500 border-slate-200 dark:border-white/10">
                {source.institutionType.replace("_", " ")}
              </Badge>
            </div>

            <h4 className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {getLocalizedName(source)}
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 pt-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>{source.provenance}</span>
            </p>
          </div>

          {source.url && (
            <div className="pt-3 mt-2 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {language === "ar" ? "زيارة البوابة الرسمية" : language === "fr" ? "Portail officiel" : "Official Portal"}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export default KnowledgeSourcesPanel;
