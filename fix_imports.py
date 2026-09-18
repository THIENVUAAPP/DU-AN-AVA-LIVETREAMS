with open('src/components/LivestreamClonerStudio.jsx', 'r') as f:
    lines = f.readlines()

# Clean up broken imports
for i, line in enumerate(lines):
    if "import React" in line and "import LivePlayer" in line:
        lines[i] = "import React, { useState, useEffect } from 'react';\nimport LivePlayer from './LivePlayer';\nimport { BarChart2, User } from 'lucide-react';\n"

with open('src/components/LivestreamClonerStudio.jsx', 'w') as f:
    f.writelines(lines)
