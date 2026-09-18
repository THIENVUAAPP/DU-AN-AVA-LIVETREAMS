import re

def clear_state_array(file_path, state_var):
    with open(file_path, 'r') as f:
        content = f.read()
    # Replace `const [var, setVar] = useState([...]);` or `const [var] = useState([...]);`
    pattern = r'const \[' + state_var + r'(?:,\s*set[a-zA-Z0-9_]+)?\] = useState\(\[.*?\]\);'
    replacement = f'const [{state_var}, set{state_var[0].upper() + state_var[1:]}] = useState([]);'
    
    # Check if there's no setter
    pattern_no_set = r'const \[' + state_var + r'\] = useState\(\[.*?\]\);'
    if re.search(pattern_no_set, content, flags=re.DOTALL):
        replacement = f'const [{state_var}] = useState([]);'
        pattern = pattern_no_set

    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    with open(file_path, 'w') as f:
        f.write(content)


clear_state_array('src/components/AffiliateProgram.jsx', 'referrals')
clear_state_array('src/components/UnifiedChatHub.jsx', 'cartItems')
clear_state_array('src/components/ProductionStudio.jsx', 'customStudioAvatars')
clear_state_array('src/components/TeamPermissionsManager.jsx', 'employees')
clear_state_array('src/components/UserProfile.jsx', 'userInvoices')
clear_state_array('src/components/MultistreamStudio.jsx', 'channels')
clear_state_array('src/components/AffiliateDashboard.jsx', 'referrals')

