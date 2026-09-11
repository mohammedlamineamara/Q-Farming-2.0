
#!/data/data/com.termux/files/usr/bin/bash

echo "AI REVIEW REPORT" > report.txt

npm run check >> report.txt 2>&1
npm run lint >> report.txt 2>&1
npm run build >> report.txt 2>&1

cat report.txt
