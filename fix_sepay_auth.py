import re

with open("src/components/SePayModal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old_poll = """        if (data && data.status === 'completed') {
          clearInterval(pollPayment);
          setIsVerifying(true);
          setTimeout(() => {
             setIsVerifying(false);
             onSuccess();
          }, 1500);
        }"""

new_poll = """        if (data && data.status === 'completed') {
          clearInterval(pollPayment);
          setIsVerifying(true);
          
          // Update local storage so the frontend knows immediately
          const saved = localStorage.getItem("avalive_current_user");
          if (saved) {
             let parsed = JSON.parse(saved);
             parsed.plan = plan.name.replace('Gói ', '').toUpperCase();
             parsed.plan_expires_at = new Date(Date.now() + 30 * 86400000).toISOString();
             localStorage.setItem("avalive_current_user", JSON.stringify(parsed));
          }

          setTimeout(() => {
             setIsVerifying(false);
             onSuccess();
             window.location.reload(); // Force app to remount with new plan
          }, 1500);
        }"""

content = content.replace(old_poll, new_poll)

with open("src/components/SePayModal.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added localstorage update and reload to SePayModal")
