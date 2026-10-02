with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

start_23 = content.find("// 2.3. Kiểm tra bộ quy tắc từ khóa")
end_23 = content.find("BƯỚC 3: NẾU KHÔNG KHỚP TỪ KHÓA")

if start_23 != -1 and end_23 != -1:
    # Need to go back to the start of the line for end_23
    end_23 = content.rfind("\n", 0, end_23)
    block_23 = content[start_23:end_23]
    content = content[:start_23] + content[end_23:]
    
    start_21 = content.find("// 2.1. Kiểm tra Kho Tri Thức")
    if start_21 != -1:
        content = content[:start_21] + block_23 + "\n        " + content[start_21:]
        
        with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Moved 2.3 before 2.1 successfully!")
    else:
        print("Could not find 2.1")
else:
    print("Could not find 2.3 or 3")
