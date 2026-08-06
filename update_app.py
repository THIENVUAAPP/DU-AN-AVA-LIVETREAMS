import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace('import LandingHero from "./components/LandingHero";', 'import LandingHero from "./components/LandingHero";\nimport SalesLandingPage from "./components/SalesLandingPage";')

# Replace overview logic
content = content.replace(
    '{activeTab === "overview" && (\n          <LandingHero setActiveTab={setActiveTab} setGoogleLoginModalOpen={setGoogleLoginModalOpen} />\n        )}',
    '{activeTab === "overview" && (\n          <SalesLandingPage setActiveTab={setActiveTab} setGoogleLoginModalOpen={setGoogleLoginModalOpen} currentUser={currentUser} />\n        )}'
)

# Force default tab to overview if not logged in
# Look for: const [activeTab, setActiveTab] = useState("broadcast");
content = content.replace(
    'const [activeTab, setActiveTab] = useState("broadcast");',
    'const [activeTab, setActiveTab] = useState(() => { const saved = localStorage.getItem("avalive_current_user"); return saved ? "broadcast" : "overview"; });'
)

with open('src/App.jsx', 'w') as f:
    f.write(content)
