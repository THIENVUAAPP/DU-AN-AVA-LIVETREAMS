import re

with open("src/lib/supabaseClient.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace syncPaymentToSupabase
old_sync = """export async function syncPaymentToSupabase({ plan, amount, referenceCode, status = 'completed', email }) {"""
new_sync = """export async function syncPaymentToSupabase({ plan, amount, referenceCode, status = 'completed', email, billingCycle = 'monthly' }) {"""
content = content.replace(old_sync, new_sync)

old_update = """    // Also upgrade the user's plan in users table
    if (email && status === 'completed') {
       await supabase.from('users').update({ plan: plan ? plan.toUpperCase() : 'STARTER' }).eq('email', email);
    }"""
new_update = """    // Also upgrade the user's plan in users table
    if (email && status === 'completed') {
       const daysToAdd = billingCycle === 'annual' ? 365 : 30;
       const expiresAt = new Date(Date.now() + daysToAdd * 86400000).toISOString();
       await supabase.from('users').update({ 
           plan: plan ? plan.toUpperCase() : 'STARTER',
           plan_expires_at: expiresAt
       }).eq('email', email);
       
       // Update local storage explicitly here so it updates instantly
       try {
           const saved = localStorage.getItem("avalive_current_user");
           if (saved) {
               let parsedUser = JSON.parse(saved);
               if (parsedUser.email === email) {
                   parsedUser.plan = plan ? plan.toUpperCase() : 'STARTER';
                   parsedUser.plan_expires_at = expiresAt;
                   localStorage.setItem("avalive_current_user", JSON.stringify(parsedUser));
               }
           }
       } catch (e) {}
    }"""
content = content.replace(old_update, new_update)

with open("src/lib/supabaseClient.js", "w", encoding="utf-8") as f:
    f.write(content)

with open("src/components/EnterprisePayment.jsx", "r", encoding="utf-8") as f:
    ep_content = f.read()

ep_content = ep_content.replace("""    await syncPaymentToSupabase({
      plan: currentPlan.name,
      amount: currentPlan.priceNum,
      referenceCode: currentPlan.orderCode,
      status: "completed"
    });""", """    await syncPaymentToSupabase({
      plan: currentPlan.id.toUpperCase(), // Using ID to be precise (STARTER, PRO, VIP)
      amount: currentPlan.priceNum,
      referenceCode: currentPlan.orderCode,
      status: "completed",
      billingCycle: billingCycle
    });""")
with open("src/components/EnterprisePayment.jsx", "w", encoding="utf-8") as f:
    f.write(ep_content)

print("Updated syncPaymentToSupabase and EnterprisePayment logic")
