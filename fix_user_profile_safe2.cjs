const fs = require('fs');
const file = './src/components/UserProfile.jsx';
let content = fs.readFileSync(file, 'utf8');

// First, fix the broken ternary we injected in the previous step by completely removing it
content = content.replace(/\{activeSidebarTab === 'profile' \? \(/g, '');
content = content.replace(/\) : \(\s*renderPlaceholder\(activeSidebarTab\)\s*\)/g, '');
content = content.replace(/<\/div>\n\s*<\/main>/g, '</main>');

// Now, correctly wrap the ENTIRE content inside .flex-1 with ternary and fragment
const flex1StartRegex = /<div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">/;

content = content.replace(flex1StartRegex, 
`<div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
          {activeSidebarTab === 'profile' ? (
            <>`
);

// End of main content before closing main/div
const flex1EndRegex = /<\/div>\s*<\/main>\s*<\/div>\s*\);\s*\}/;
content = content.replace(flex1EndRegex,
`            </>
          ) : (
            renderPlaceholder(activeSidebarTab)
          )}
        </div>
      </main>
    </div>
  );
}`);

fs.writeFileSync(file, content);
