import re

with open("src/components/SalesLandingPage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update PlatformLogo to be colorful and vibrant
old_logo = """function PlatformLogo({ icon, text, hoverColor }) {
  return (
    <div className={`flex items-center gap-3 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer min-w-max mx-12 group text-white ${hoverColor}`}>
      {React.cloneElement(icon, { className: "w-8 h-8 group-hover:scale-110 transition-transform" })}
      <span className="text-2xl font-bold">{text}</span>
    </div>
  );
}"""

new_logo = """function PlatformLogo({ icon, text, hoverColor }) {
  const colorClass = hoverColor ? hoverColor.replace('hover:', '') : 'text-white';
  return (
    <div className={`flex items-center gap-3 transition-all duration-500 cursor-pointer min-w-max mx-12 group drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 ${colorClass}`}>
      {React.cloneElement(icon, { className: "w-9 h-9 group-hover:scale-110 transition-transform" })}
      <span className="text-3xl font-black tracking-wider uppercase">{text}</span>
    </div>
  );
}"""

content = content.replace(old_logo, new_logo)

# 2. Update Pricing grid layout
content = content.replace("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto w-full")

# 3. Increase interactivity
content = content.replace("active:scale-95 group", "active:scale-90 group hover:border-blue-500/50")

with open("src/components/SalesLandingPage.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed UI")
