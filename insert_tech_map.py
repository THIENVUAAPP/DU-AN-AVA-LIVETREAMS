import re

with open("src/components/SalesLandingPage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Import
import_pattern = r"import SePayModal from '\./SePayModal';"
content = content.replace(import_pattern, "import SePayModal from './SePayModal';\nimport TechEcosystemMap from './TechEcosystemMap';")

# Inject component
inject_pattern = r"""      </section>

      \{\/\* 4\. PRICING SECTION \*\/\}"""

new_content = """      </section>

      {/* TECH ECOSYSTEM SECTION */}
      <TechEcosystemMap />

      {/* 4. PRICING SECTION */}"""
content = re.sub(inject_pattern, new_content, content)

with open("src/components/SalesLandingPage.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected TechEcosystemMap successfully.")
