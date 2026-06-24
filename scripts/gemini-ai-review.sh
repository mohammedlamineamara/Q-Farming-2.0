#!/data/data/com.termux/files/usr/bin/bash

REPORT=/tmp/project_report.txt

echo "======================" > "$REPORT"
echo "PROJECT AI REVIEW" >> "$REPORT"
echo "======================" >> "$REPORT"

echo "" >> "$REPORT"
echo "===== TYPESCRIPT =====" >> "$REPORT"
npm run check >> "$REPORT" 2>&1

echo "" >> "$REPORT"
echo "===== ESLINT =====" >> "$REPORT"
npm run lint >> "$REPORT" 2>&1

echo "" >> "$REPORT"
echo "===== BUILD =====" >> "$REPORT"
npm run build >> "$REPORT" 2>&1

echo "" >> "$REPORT"
echo "===== FILE STRUCTURE =====" >> "$REPORT"
find src api db -type f \( -name "*.ts" -o -name "*.tsx" \) >> "$REPORT"

cat <<PROMPT > /tmp/gemini_prompt.txt
أنت مهندس برمجيات خبير.

حلل مشروع React + Vite + TypeScript + tRPC + Drizzle.

المطلوب:
1. تحليل أخطاء TypeScript.
2. تحليل أخطاء ESLint.
3. اقتراح إصلاحات دقيقة.
4. اقتراح تحسينات الأداء.
5. اقتراح تحسينات الأمان.
6. تقييم المشروع.
7. اقتراح الخطوات التالية.

هذا هو التقرير:

PROMPT

cat "$REPORT" >> /tmp/gemini_prompt.txt

gemini < /tmp/gemini_prompt.txt
