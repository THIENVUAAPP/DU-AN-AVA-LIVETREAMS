import re

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Step 3 text
old_step_3_title = "CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG & CẢM ƠN (INBOX SHOP)"
new_step_3_title = "CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG (DÙNG KHI AI KHÔNG BIẾT)"
content = content.replace(old_step_3_title, new_step_3_title)

old_step_3_desc = "Tự động ghép vào cuối sau khi trả lời xong câu hỏi:"
new_step_3_desc = "Khi AI không biết trả lời, tự động dùng câu hỏi gợi mở để tiếp tục tương tác:"
content = content.replace(old_step_3_desc, new_step_3_desc)

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("UI text patched successfully!")
