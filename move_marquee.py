import re

with open("src/components/SalesLandingPage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

marquee_pattern = r"(\s*\{\/\* 2\.5 PLATFORM LOGOS \(MARQUEE REVERSE\) \*\/.*?<\/section>)"
marquee_match = re.search(marquee_pattern, content, re.DOTALL)
if not marquee_match:
    print("Could not find marquee")
    exit(1)

marquee_text = marquee_match.group(1)

# Remove marquee from its original position
content = content.replace(marquee_text, "")

# Find the static logo section
static_logo_pattern = r"(\s*<div className=\"text-center\">\s*<h4 className=\"text-gray-500 text-sm font-bold uppercase tracking-widest mb-6\">ĐỐI TÁC TIN CẬY<\/h4>\s*<div className=\"flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500\">\s*<span className=\"flex items-center gap-2 text-white font-bold\">.*?<\/span>\s*<\/div>\s*<\/div>)"

# Replace static logo section with marquee
# I will slightly modify marquee_text to remove the outer `<section>` so it fits within the current section, or I can just wrap it in a div.
new_marquee = """
          <div className="text-center mt-8">
            <h4 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-6">ĐỐI TÁC TIN CẬY</h4>
            <div className="relative z-20 overflow-hidden marquee-container py-4">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a10] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a10] to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex w-[200%] animate-marquee-reverse">
                <div className="flex w-1/2 justify-around items-center px-4">
                   <PlatformLogo text="TikTok" icon={<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>} hoverColor="hover:text-cyan-400" />
                   <PlatformLogo text="facebook" icon={<Facebook className="w-8 h-8"/>} hoverColor="hover:text-[#1877F2]" />
                   <PlatformLogo text="YouTube" icon={<Tv className="w-8 h-8"/>} hoverColor="hover:text-[#FF0000]" />
                   <PlatformLogo text="Shopee" icon={<ShoppingCart className="w-8 h-8"/>} hoverColor="hover:text-[#EE4D2D]" />
                   <PlatformLogo text="Lazada" icon={<Globe className="w-8 h-8"/>} hoverColor="hover:text-[#0A2647]" />
                </div>
                <div className="flex w-1/2 justify-around items-center px-4">
                   <PlatformLogo text="TikTok" icon={<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>} hoverColor="hover:text-cyan-400" />
                   <PlatformLogo text="facebook" icon={<Facebook className="w-8 h-8"/>} hoverColor="hover:text-[#1877F2]" />
                   <PlatformLogo text="YouTube" icon={<Tv className="w-8 h-8"/>} hoverColor="hover:text-[#FF0000]" />
                   <PlatformLogo text="Shopee" icon={<ShoppingCart className="w-8 h-8"/>} hoverColor="hover:text-[#EE4D2D]" />
                   <PlatformLogo text="Lazada" icon={<Globe className="w-8 h-8"/>} hoverColor="hover:text-[#0A2647]" />
                </div>
              </div>
            </div>
          </div>"""

content = re.sub(static_logo_pattern, new_marquee, content, flags=re.DOTALL)

with open("src/components/SalesLandingPage.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Moved marquee")
