import re

with open("src/components/SalesLandingPage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the previously injected TechEcosystemMap at line 425
remove_old_injection_pattern = r"      \{\/\* TECH ECOSYSTEM SECTION \*\/.*?\n      <TechEcosystemMap \/>\n"
content = re.sub(remove_old_injection_pattern, "", content, flags=re.DOTALL)

# 2. Replace the old "Right AI Robot Illustration" with TechEcosystemMap
# The block to replace starts with: {/* Right AI Robot Illustration (CSS Based mockup) */}
# And ends before: {/* Bottom Podium Badge */}
# Wait, let's just replace the whole relative h-[500px] block up to the closing div of RevealOnScroll?
# Actually, the right side is just a div:
old_robot_pattern = r"          \{\/\* Right AI Robot Illustration \(CSS Based mockup\) \*\/.*?(?=          \{\/\* Bottom Podium Badge \*\/)"
new_robot_block = """          {/* Right AI Robot Illustration (CSS Based mockup) */}
          <div className="relative h-[600px] flex items-center justify-center">
             <TechEcosystemMap />\n"""

content = re.sub(old_robot_pattern, new_robot_block, content, flags=re.DOTALL)

with open("src/components/SalesLandingPage.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Replaced old robot with TechEcosystemMap and cleaned up old injection.")
