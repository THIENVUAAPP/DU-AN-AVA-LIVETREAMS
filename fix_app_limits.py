import re

with open("src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix AIAvatarStudio limit
old_avatar = """            {activeTab === "avatars" && (
              <AIAvatarStudio isLive={isLive} aiAvatarFeatureEnabled={aiAvatarFeatureEnabled} />
            )}"""
new_avatar = """            {activeTab === "avatars" && (
              (currentUser?.plan === 'FREE' || currentUser?.plan === 'STARTER')
                ? <UpgradePrompt featureName="AI Avatar Studio" requiredPlan="Gói PRO" setActiveTab={setActiveTab} />
                : <AIAvatarStudio isLive={isLive} aiAvatarFeatureEnabled={aiAvatarFeatureEnabled} />
            )}"""
content = content.replace(old_avatar, new_avatar)

# Fix Multistream limit (STARTER should have access)
old_multi = """            {activeTab === "multistream" && (
              (currentUser?.plan === 'FREE' || currentUser?.plan === 'STARTER') 
                ? <UpgradePrompt featureName="Phân Phối Luồng Restream Đa Kênh" requiredPlan="Gói PRO" setActiveTab={setActiveTab} />
                : <MultistreamStudio isLive={isLive} setIsLive={setIsLive} currentUser={currentUser} />
            )}"""
new_multi = """            {activeTab === "multistream" && (
              (currentUser?.plan === 'FREE') 
                ? <UpgradePrompt featureName="Phân Phối Luồng Restream Đa Kênh" requiredPlan="Gói STARTER" setActiveTab={setActiveTab} />
                : <MultistreamStudio isLive={isLive} setIsLive={setIsLive} currentUser={currentUser} />
            )}"""
content = content.replace(old_multi, new_multi)

# Fix UnifiedChatHub limit (STARTER+)
old_chat = """            {activeTab === "chat-hub" && (
              <UnifiedChatHub isLive={isLive} />
            )}"""
new_chat = """            {activeTab === "chat-hub" && (
              (currentUser?.plan === 'FREE')
                ? <UpgradePrompt featureName="Hộp Thư Đa Nền Tảng (Chat Hub)" requiredPlan="Gói STARTER" setActiveTab={setActiveTab} />
                : <UnifiedChatHub isLive={isLive} />
            )}"""
content = content.replace(old_chat, new_chat)

# Fix TeamPermissionsManager limit (PRO+)
old_team = """            {activeTab === "team" && (
              <TeamPermissionsManager currentUser={currentUser} setCurrentUser={setCurrentUser} setActiveTab={setActiveTab} />
            )}"""
new_team = """            {activeTab === "team" && (
              (currentUser?.plan === 'FREE' || currentUser?.plan === 'STARTER')
                ? <UpgradePrompt featureName="Quản Lý Phân Quyền Đội Ngũ" requiredPlan="Gói PRO" setActiveTab={setActiveTab} />
                : <TeamPermissionsManager currentUser={currentUser} setCurrentUser={setCurrentUser} setActiveTab={setActiveTab} />
            )}"""
content = content.replace(old_team, new_team)

# Fix SalesAnalyticsManager limit (PRO+)
old_sales = """            {activeTab === "sales-analytics" && (
              <SalesAnalyticsManager currentUser={currentUser} />
            )}"""
new_sales = """            {activeTab === "sales-analytics" && (
              (currentUser?.plan === 'FREE' || currentUser?.plan === 'STARTER')
                ? <UpgradePrompt featureName="Phân Tích Bán Hàng & Chuyển Đổi" requiredPlan="Gói PRO" setActiveTab={setActiveTab} />
                : <SalesAnalyticsManager currentUser={currentUser} />
            )}"""
content = content.replace(old_sales, new_sales)

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed access limits in App.jsx")
