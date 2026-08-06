import re

with open("src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the initial currentUser state logic
old_user_state = """  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("avalive_current_user");
      return saved ? JSON.parse(saved) : {
        name: "Quốc Thiên Admin",
        email: "quocthiencr90@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user",
        isAdmin: true,
        plan: "STARTER"
      };
    } catch (e) {
      return null;
    }
  });"""

new_user_state = """  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("avalive_current_user");
      if (saved) {
         let parsedUser = JSON.parse(saved);
         // Realtime check plan expiration
         if (parsedUser.plan !== 'FREE' && parsedUser.plan_expires_at) {
             const expiresAt = new Date(parsedUser.plan_expires_at).getTime();
             const now = new Date().getTime();
             if (now > expiresAt) {
                 // Downgrade to FREE
                 parsedUser.plan = 'FREE';
                 parsedUser.plan_expires_at = null;
                 localStorage.setItem("avalive_current_user", JSON.stringify(parsedUser));
             }
         }
         return parsedUser;
      }
      return {
        name: "Quốc Thiên Admin",
        email: "quocthiencr90@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user",
        isAdmin: true,
        plan: "FREE",
        plan_expires_at: null
      };
    } catch (e) {
      return null;
    }
  });"""

content = content.replace(old_user_state, new_user_state)

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(content)

