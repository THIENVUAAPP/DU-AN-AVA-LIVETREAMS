import re

# 1. Update App.jsx
with open("src/App.jsx", "r", encoding="utf-8") as f:
    app_jsx = f.read()

# Make login keep user on overview
app_jsx = app_jsx.replace('setActiveTab("broadcast");\n\n    // Sync directly', 'setActiveTab("overview");\n\n    // Sync directly')

# Hide Header on landing pages
app_jsx = app_jsx.replace('{currentUser && (\\n        <Header', "{currentUser && activeTab !== 'overview' && activeTab !== 'affiliate-landing' && (\\n        <Header")
app_jsx = app_jsx.replace('{currentUser && (\n        <Header', "{currentUser && activeTab !== 'overview' && activeTab !== 'affiliate-landing' && (\n        <Header")

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(app_jsx)


# 2. Update Header.jsx
with open("src/components/Header.jsx", "r", encoding="utf-8") as f:
    header_jsx = f.read()

header_jsx = header_jsx.replace("""  const handleLogoClick = () => {
    if (currentUser) {
      setActiveTab('broadcast');
    } else {
      setActiveTab('overview');
    }
  };""", """  const handleLogoClick = () => {
    setActiveTab('overview');
  };""")

with open("src/components/Header.jsx", "w", encoding="utf-8") as f:
    f.write(header_jsx)


# 3. Update SalesLandingPage.jsx
with open("src/components/SalesLandingPage.jsx", "r", encoding="utf-8") as f:
    sales_jsx = f.read()

old_button = """              <button 
                onClick={() => setActiveTab('broadcast')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-2"
              >
                VÀO DASHBOARD <ArrowRight className="w-4 h-4" />
              </button>"""

new_button = """              <div 
                onClick={() => setActiveTab('broadcast')}
                className="flex items-center gap-2 cursor-pointer bg-[#111] hover:bg-white/10 px-4 py-1.5 rounded-full transition-all border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                title="Vào Dashboard Quản Trị"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs border border-white/20">
                   {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-200 truncate max-w-[150px]">{currentUser.email}</span>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-black px-2 py-0.5 rounded-full text-white ml-2 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  DASHBOARD
                </div>
              </div>"""

sales_jsx = sales_jsx.replace(old_button, new_button)

with open("src/components/SalesLandingPage.jsx", "w", encoding="utf-8") as f:
    f.write(sales_jsx)

print("Fixed login flow")
