const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the exact place where the main ternary should end
  // In UserProfile, it's before </main>
  
  if (content.includes('}')) {
    content = content.replace(/(\s*)<\/div>\s*\}\s*<\/main>/, 
`$1            </>
          ) : (
            renderPlaceholder(activeSidebarTab)
          )}
        </div>
      </main>`);
  }
  
  fs.writeFileSync(file, content);
}

fixFile('./src/components/UserProfile.jsx');
fixFile('./src/components/AdminDashboard.jsx');
