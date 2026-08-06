import re

with open('src/components/UnifiedChatHub.jsx', 'r') as f:
    content = f.read()

# 1. Remove mock data from aiProducts, comments
content = re.sub(r'const \[aiProducts, setAiProducts\] = useState\(\[.*?\]\);', 'const [aiProducts, setAiProducts] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r"const \[comments, setComments\] = useState\(\[\s*\{\s*id: 'c1'.*?\]\);", 'const [comments, setComments] = useState([]);', content, flags=re.DOTALL)

# 2. Remove setInterval that generates fake comments
# First, find the useEffect that depends on autoAiReplyEnabled
use_effect_pattern = r'  // Dynamic AI Engine matching real dataset\n  useEffect\(\(\) => \{\n    if \(\!autoAiReplyEnabled\) return;\n    const interval = setInterval\(\(\) => \{.*?\}, 9000\);\n\n    return \(\) => clearInterval\(interval\);\n  \}, \[autoAiReplyEnabled, aiProducts, businessInfo, customQuestions\]\);'
content = re.sub(use_effect_pattern, '', content, flags=re.DOTALL)

# 3. Enhance handleAiSuggestAnswer
enhanced_ai = """  const handleAiSuggestAnswer = (comment) => {
    if (!comment || !comment.text) return;
    
    const textL = comment.text.toLowerCase();
    let aiAnswer = '';
    
    // AI Intent Detection & Sales Scripting (Chốt sale, Xử lý từ chối)
    if (textL.includes('đắt') || textL.includes('cao') || textL.includes('giảm giá không')) {
       // Xử lý từ chối về giá (Objection Handling)
       aiAnswer = `Dạ shop chào chị ${comment.user}! Dạ mức giá này là hoàn toàn xứng đáng với chất lượng sản phẩm nhập khẩu trực tiếp ạ. Tuy nhiên trên Live hôm nay, shop đang tặng kèm Voucher freeship và quà tặng độc quyền. Chị an tâm chốt đơn nha!`;
    } else if (textL.includes('chất lượng') || textL.includes('tốt không') || textL.includes('bảo hành')) {
       // Xử lý nghi ngờ chất lượng
       aiAnswer = `Dạ chị ${comment.user} cứ yên tâm tuyệt đối ạ, hàng bên em cam kết chính hãng 100%, bảo hành 12 tháng 1 đổi 1. Chị nhắn tin SĐT để em lên đơn giữ ưu đãi nhé!`;
    } else if (textL.includes('size') || textL.includes('kích thước') || textL.includes('màu')) {
       // Tư vấn thông tin
       aiAnswer = `Dạ mẫu ${comment.productSuggested || 'này'} bên em đang đủ màu đủ size ạ. Chị cao nặng bao nhiêu để AI bên em tư vấn size chuẩn xác nhất nhé?`;
    } else if (textL.includes('chốt') || textL.includes('lấy') || textL.includes('mua') || textL.includes('sđt') || textL.includes('09')) {
       // Chốt sale (Closing)
       aiAnswer = `✅ Dạ em đã nhận thông tin chốt đơn của chị ${comment.user}. Hệ thống đã tự động lưu mã ưu đãi. Chị kiểm tra tin nhắn chờ để shop gửi xác nhận đơn hàng nha!`;
    } else {
       // Chăm sóc chung (General CSKH)
       aiAnswer = `Dạ shop chào chị ${comment.user}! Mẫu ${comment.productSuggested || 'hot hit'} bên em đang có ưu đãi độc quyền trên phiên live này. Chị ưng ý thì chốt đơn để lại SĐT ngay để không bỏ lỡ deal hời nha!`;
    }
    
    setReplyInput(aiAnswer);
  };"""

content = re.sub(r'  const handleAiSuggestAnswer = \(comment\) => \{.*?\n  \};', enhanced_ai, content, flags=re.DOTALL)

with open('src/components/UnifiedChatHub.jsx', 'w') as f:
    f.write(content)

