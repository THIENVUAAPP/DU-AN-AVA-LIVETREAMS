import re

with open("src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import
if 'RecentPurchasePopup' not in content:
    content = content.replace('import React, { useState, useEffect } from "react";', 
                             'import React, { useState, useEffect } from "react";\nimport RecentPurchasePopup from "./components/RecentPurchasePopup";')

# 2. Add component
if '<RecentPurchasePopup />' not in content:
    content = content.replace('      {googleLoginModalOpen && (',
                              '      <RecentPurchasePopup />\n\n      {/* 🌐 OFFICIAL GOOGLE OAUTH AUTHENTICATION MODAL (CLEAN 1-BUTTON ONLY) */}\n      {googleLoginModalOpen && (')
    # Also fallback just in case the comment was removed
    content = content.replace('      <RecentPurchasePopup />\n\n      {/* 🌐 OFFICIAL GOOGLE OAUTH AUTHENTICATION MODAL (CLEAN 1-BUTTON ONLY) */}\n      {/* 🌐 OFFICIAL GOOGLE OAUTH AUTHENTICATION MODAL (CLEAN 1-BUTTON ONLY) */}\n      {googleLoginModalOpen && (', 
                              '      <RecentPurchasePopup />\n\n      {/* 🌐 OFFICIAL GOOGLE OAUTH AUTHENTICATION MODAL (CLEAN 1-BUTTON ONLY) */}\n      {googleLoginModalOpen && (')

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected RecentPurchasePopup successfully.")
