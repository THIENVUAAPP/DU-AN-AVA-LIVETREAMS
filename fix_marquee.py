import re

# 1. Update index.css
with open("src/index.css", "r", encoding="utf-8") as f:
    css = f.read()
    
css = css.replace(".animate-marquee { display: flex; width: 200%; animation: marquee 25s linear infinite; }", ".animate-marquee { display: flex; width: max-content; animation: marquee 25s linear infinite; }")
css = css.replace(".animate-marquee-reverse { display: flex; width: 200%; animation: marquee-reverse 25s linear infinite reverse; }", ".animate-marquee-reverse { display: flex; width: max-content; animation: marquee-reverse 25s linear infinite reverse; }")

if "@keyframes marquee-reverse" not in css:
    css += "\n@keyframes marquee-reverse { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }\n.animate-marquee-reverse { display: flex; width: max-content; animation: marquee-reverse 25s linear infinite reverse; }\n"

with open("src/index.css", "w", encoding="utf-8") as f:
    f.write(css)


# 2. Update SalesLandingPage.jsx
with open("src/components/SalesLandingPage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("w-[200%]", "w-max")
content = content.replace("flex w-1/2 justify-around items-center px-4", "flex w-max justify-around items-center px-4 gap-8")

with open("src/components/SalesLandingPage.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed marquee width")
