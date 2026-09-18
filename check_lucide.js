import * as lucide from 'lucide-react';

const icons = [
  'Sparkles', 'CheckCircle2', 'ArrowRight', 'Zap', 'ShieldCheck', 
  'Tv', 'Users', 'CreditCard', 'ChevronRight', 'Crown', 'Star', 
  'BarChart2', 'Share2', 'Globe', 'HeartHandshake', 'Building2',
  'Lock', 'Copy', 'RefreshCw', 'Clock', 'X', 'Scan', 'Check'
];

let missing = [];
for (const icon of icons) {
  if (!lucide[icon]) {
    missing.push(icon);
  }
}

console.log("Missing icons:", missing);
