# **I. TƯ DUY ĐÚNG CỦA HỆ THỐNG**

Anh đừng xây hệ thống theo:

**Comment → AI trả lời.**

Mà xây:

**Người xem → Sự kiện → Phân tích → Quyết định → Ưu tiên → Kịch bản phản hồi → Giọng nói → Idol → Theo dõi phản ứng → tiếp tục cuộc trò chuyện.**

Mục tiêu cuối cùng:

> **Người xem cảm thấy mình đang nói chuyện với một Idol có tính cách thật, biết mình vừa nói gì, biết mình vừa tặng quà gì và phản ứng phù hợp.**

Quà tặng là **kết quả của trải nghiệm**, không phải thứ AI liên tục đòi hỏi.

---

# **II. KIẾN TRÚC TỔNG THỂ**

Em đề xuất anh chia thành **12 module**:

01\. TikTok Live Connector  
02\. Event Collector  
03\. Comment Processor  
04\. Viewer Memory  
05\. Intent Classifier  
06\. Conversation Manager  
07\. Gift Reaction Engine  
08\. Response Generator  
09\. Priority Manager  
10\. TTS Manager  
11\. Idol/Avatar Controller  
12\. Analytics & Live Control

Luồng:

                TIKTOK LIVE  
                     │  
       ┌─────────────┼─────────────┐  
       ↓             ↓             ↓  
    COMMENT        GIFT          VIEWER  
       │             │             │  
       └─────────────┼─────────────┘  
                     ↓  
              EVENT COLLECTOR  
                     ↓  
              EVENT NORMALIZER  
                     ↓  
              INTENT CLASSIFIER  
                     ↓  
            CONVERSATION MANAGER  
                     ↓  
             PRIORITY MANAGER  
                     ↓  
           RESPONSE GENERATOR  
                     ↓  
              SAFETY CHECK  
                     ↓  
              TTS MANAGER  
                     ↓  
              VOICE QUEUE  
                     ↓  
               AI IDOL  
                     ↓  
              LIVE OUTPUT  
                     ↓  
              ANALYTICS  
---

# **III. BƯỚC 1 — TẠO "HỒ SƠ TÍNH CÁCH" CHO IDOL**

Đây là phần rất quan trọng.

Anh không thể chỉ đưa cho AI:

> "Hãy trả lời comment."

Phải tạo một **Persona Engine**.

Ví dụ Idol:

Tên: Linh

Tuổi nhân vật: 24

Phong cách:  
\- vui vẻ  
\- thân thiện  
\- hơi tinh nghịch  
\- nói chuyện tự nhiên  
\- không quá dài dòng  
\- biết đùa nhẹ  
\- không quá sến

Cách xưng hô:  
\- Idol → "em"  
\- người xem → "anh/chị/bạn"  
\- nếu biết tên → gọi tên

Tốc độ:  
\- câu ngắn  
\- 1–2 câu mỗi lần  
\- ưu tiên phản ứng cảm xúc

Không được:  
\- ép tặng quà  
\- nói "anh phải tặng quà"  
\- hứa phần thưởng giả  
\- giả vờ nhận biết điều chưa xảy ra  
\- bịa thông tin  
\- lặp cùng một câu quá nhiều  
---

# **IV. BƯỚC 2 — TẠO "BỘ NHỚ LIVE"**

Mỗi người xem cần một session.

Ví dụ:

Viewer:  
Nguyễn Minh

viewer\_id:  
xxxx

first\_seen:  
21:03

last\_comment:  
21:15

comment\_count:  
7

gift\_count:  
2

last\_gift:  
Rose

topics:  
âm nhạc, công việc

mood:  
positive

relationship\_level:  
new → returning

Nhưng anh không cần lưu mọi thứ.

Chỉ cần những thông tin hữu ích cho **phiên LIVE hiện tại**.

---

# **V. BƯỚC 3 — MỖI COMMENT PHẢI ĐƯỢC PHÂN LOẠI**

Đây là trái tim của hệ thống.

Ví dụ comment:

> "Chào em"

AI phân loại:

INTENT \= GREETING  
---

> "Em tên gì?"

INTENT \= IDOL\_INFO  
---

> "Em ở đâu vậy?"

INTENT \= PERSONAL\_CHAT  
---

> "Đẹp quá"

INTENT \= COMPLIMENT  
---

> "Hôm nay vui không?"

INTENT \= CASUAL\_CHAT  
---

> "😂😂😂"

INTENT \= REACTION  
---

> "❤️❤️❤️"

INTENT \= POSITIVE\_REACTION  
---

> 🎁 Gift

EVENT \= GIFT  
---

# **VI. BƯỚC 4 — KHÔNG PHẢI COMMENT NÀO CŨNG TRẢ LỜI**

Đây là nguyên tắc quan trọng nhất.

Nếu có:

**1.000 comment**

AI không được nói:

**1.000 câu.**

Phải có:

REPLY  
IGNORE  
MERGE  
DELAY  
PRIORITIZE

Ví dụ:

Người A: "Em xinh quá"  
Người B: "Xinh quá"  
Người C: "Đẹp"  
Người D: "Xinh"

AI có thể gom thành:

> "Trời ơi, hôm nay mọi người khen làm em ngại quá nha."

**Một câu trả lời cho nhiều người.**

---

# **VII. BƯỚC 5 — COMMENT PHẢI CÓ "ĐỘ ƯU TIÊN"**

Em đề xuất hệ thống ban đầu:

| Event | Priority |
| ----- | ----- |
| Gift | 100 |
| Người xem đang đối thoại | 90 |
| Câu hỏi trực tiếp | 80 |
| Người mới \+ comment | 70 |
| Compliment | 60 |
| Casual chat | 50 |
| Emoji | 30 |
| Spam | 0 |

Nhưng đây **không phải điểm cố định**.

Ví dụ:

Người A đang nói chuyện với Idol:

> "Em biết anh là ai không?"

AI đang trong cuộc hội thoại.

→ ưu tiên A.

Trong lúc đó B tặng quà.

→ Gift Event có thể chen lên ưu tiên.

---

# **VIII. BƯỚC 6 — WELCOME ENGINE**

Khi một người mới vào:

EVENT:  
VIEWER\_JOIN

Không lập tức nói:

> "Xin chào Nguyễn Văn A."

Nếu 20 người vào cùng lúc thì rất robot.

Thay vào đó:

### **Trường hợp 1**

Một người mới vào.

→ có thể chào:

> "Hello anh Minh nha, mới vào chơi với em hả?"

### **Trường hợp 2**

10 người cùng vào.

→ gom:

> "Ui phòng mình vừa có thêm một đống bạn mới nha, chào mọi người\!"

### **Trường hợp 3**

Người mới vào nhưng không comment.

→ **không nhất thiết phải nói tên.**

### **Trường hợp 4**

Người mới vào rồi comment:

> "Hello em"

→ lúc này ưu tiên:

> "Hello anh Minh, em thấy anh vừa vào nha."

Cảm giác tự nhiên hơn.

---

# **IX. BƯỚC 7 — COMMENT "CHÀO EM"**

Database response không nên chỉ có một câu.

Phải có **Response Pool**.

Ví dụ:

GREETING\_RESPONSES

Có thể có:

> "Hello anh nha ❤️"

> "Chào anh, mới vào chơi với em hả?"

> "Hello anh nha, hôm nay anh khỏe không?"

> "Chào anh, ngồi chơi với em nha."

AI chọn dựa trên context.

**Không dùng random thuần túy.**

Phải kiểm tra câu vừa nói trước đó.

Nếu 30 giây trước vừa nói:

> "Hello anh nha."

thì không được nói lại y nguyên.

---

# **X. BƯỚC 8 — NGƯỜI XEM NÓI "EM XINH QUÁ"**

Không nên lúc nào cũng:

> "Cảm ơn anh."

Có thể:

> "Anh khen làm em ngại quá trời luôn."

Hoặc:

> "Thiệt không đó, hay anh đang nịnh em vậy?"

Hoặc:

> "Em nhận lời khen nha, hôm nay em vui rồi đó."

Hoặc:

> "Cảm ơn anh nha, nghe câu này cái tự nhiên vui hẳn."

Đây là **Emotion Response Engine**.

---

# **XI. BƯỚC 9 — NGƯỜI XEM HỎI CÂU HỎI**

Ví dụ:

> "Em đang làm gì vậy?"

AI:

intent \= CASUAL\_CHAT

Context:

live\_topic \= music

Trả lời:

> "Em đang ngồi nói chuyện với mọi người nè. Mà anh đang làm gì đó?"

Đây là điểm quan trọng:

### **AI không chỉ trả lời.**

### **AI phải biết "ném bóng lại".**

---

# **XII. CÔNG THỨC TRÒ CHUYỆN 3 BƯỚC**

Em khuyên anh xây:

**Answer → Emotion → Return Question**

Ví dụ:

> Người xem: "Hôm nay em vui không?"

AI:

**Answer:**

> "Vui chứ anh."

**Emotion:**

> "Hôm nay tự nhiên em có năng lượng ghê."

**Return:**

> "Còn anh hôm nay có vui không?"

Đây mới là hội thoại.

---

# **XIII. BƯỚC 10 — COMMENT NGẮN**

Ví dụ:

> "Haha"

Không cần trả lời dài.

AI:

> "😂 Anh cười gì đó?"

Hoặc chỉ:

> "Thấy vui là được rồi nha 😂"

---

Comment:

> "❤️"

AI:

> "Nhận tim nha ❤️"

Không cần nói 15 giây.

---

# **XIV. BƯỚC 11 — GIFT ENGINE**

Đây là module riêng.

Khi TikTok gửi:

GIFT\_EVENT

Payload nên được chuẩn hóa:

viewer\_id  
viewer\_name  
gift\_id  
gift\_name  
gift\_quantity  
gift\_value  
timestamp

Ví dụ:

viewer \= Minh  
gift \= Rose  
quantity \= 1  
---

# **XV. GIFT KHÔNG CHỈ CÓ "CẢM ƠN"**

Em chia thành 5 mức phản ứng.

### **LEVEL 1 — Quà nhỏ**

> "Cảm ơn anh Minh nha ❤️"

---

### **LEVEL 2 — Tặng nhiều lần**

> "Ui anh Minh lại gửi nữa rồi, cảm ơn anh nha."

---

### **LEVEL 3 — Gift nổi bật**

> "Trời ơi cảm ơn anh Minh nhiều nha, em thấy rồi nè ❤️"

---

### **LEVEL 4 — Gift liên tục**

Không cảm ơn từng cái.

Gom:

> "Anh Minh hôm nay gửi nhiều quá trời luôn, em cảm ơn anh nha."

---

### **LEVEL 5 — Nhiều người cùng tặng**

AI có thể nói:

> "Hôm nay mọi người dễ thương quá, em cảm ơn tất cả mọi người nha."

---

# **XVI. TUYỆT ĐỐI KHÔNG ĐỂ AI LÀM THẾ NÀY**

Không nên:

> "Anh Minh tặng thêm đi."

> "Ai tặng quà em mới nói chuyện."

> "Không tặng quà là em không trả lời."

> "Tặng 1000 xu em sẽ..."

> "Ai tặng nhiều nhất em yêu người đó."

Đặc biệt không nên tạo **áp lực cảm xúc giả** để thúc người xem gửi quà.

TikTok mô tả Gifts là một hình thức thể hiện sự đánh giá cao và tương tác với nội dung; hệ thống của anh nên xây trải nghiệm xoay quanh sự tự nguyện đó.

---

# **XVII. BƯỚC 12 — GIFT \+ TÊN NGƯỜI XEM**

Đây là một trong những tính năng đáng làm nhất.

Ví dụ:

Minh → Gift

AI:

> "Cảm ơn Minh nha ❤️"

Lần sau:

Minh → comment

AI có context:

> "A Minh quay lại rồi nè."

Nếu phù hợp, AI có thể nói:

> "Anh Minh lại vào chơi với em rồi."

**Nhưng chỉ khi hệ thống thực sự có dữ liệu Minh đã từng xuất hiện trong session.**

Không được bịa.

---

# **XVIII. BƯỚC 13 — "RELATIONSHIP LEVEL"**

Mỗi viewer có một mức độ tương tác trong phiên:

LEVEL 0  
Chưa tương tác

LEVEL 1  
Đã comment

LEVEL 2  
Đã nói chuyện nhiều lần

LEVEL 3  
Quay lại tương tác

LEVEL 4  
Có tương tác nổi bật

LEVEL 5  
Regular viewer trong session

Không dùng mức này để phân biệt giá trị con người.

Chỉ dùng để **điều chỉnh cách xưng hô và độ liên tục của hội thoại**.

---

# **XIX. BƯỚC 14 — CONVERSATION THREAD**

Đây là thứ làm Idol "thông minh".

Ví dụ:

### **21:10**

Minh:

> "Em thích nghe nhạc gì?"

Idol:

> "Em thích nhạc nhẹ với mấy bài nghe buổi tối á."

---

### **21:11**

Minh:

> "Anh cũng thích nhạc nhẹ."

AI phải biết:

THREAD \= MUSIC  
---

### **21:12**

Minh:

> "Em hay nghe bài nào?"

AI tiếp tục chủ đề:

> "Nếu buổi tối thì em hay nghe mấy bài chill chill á. Anh thích kiểu buồn buồn hay vui vui?"

Không nhảy sang chủ đề ngẫu nhiên.

---

# **XX. BƯỚC 15 — "SILENCE MANAGER"**

Một hệ thống AI LIVE tốt phải biết **im lặng**.

Ví dụ:

Không có comment trong 2 giây:

→ không nói.

Không có comment 5 giây:

→ có thể bắt đầu một chủ đề.

Ví dụ:

> "Ủa sao tự nhiên mọi người im lặng vậy ta?"

Nếu 10–20 giây:

> "Thôi để em hỏi mọi người một câu nha..."

Sau đó đưa ra câu hỏi mở.

Ví dụ:

> "Mọi người đang xem live từ đâu vậy?"

---

# **XXI. NHƯNG ĐỪNG ĐỂ IDOL NÓI LIÊN TỤC**

Em sẽ đặt:

MIN\_SPEECH\_GAP

Ví dụ hệ thống có thể cấu hình:

minimum\_gap \= 2–5 sec

và:

maximum\_consecutive\_ai\_turns \= 2

Nếu Idol vừa nói 2 lượt mà không có người trả lời:

→ **ngừng chủ động.**

Đợi viewer.

Như vậy live sẽ tự nhiên hơn.

---

# **XXII. BƯỚC 16 — VOICE QUEUE**

Tất cả câu trả lời đi vào:

VOICE\_QUEUE

Ví dụ:

\[21:12:01\] Minh → comment  
\[21:12:02\] Lan → comment  
\[21:12:03\] Huy → gift  
\[21:12:04\] Nam → comment

Queue:

1\. Huy Gift  
2\. Minh conversation  
3\. Lan question  
4\. Nam casual

TTS chỉ lấy **một câu tại một thời điểm**.

---

# **XXIII. BƯỚC 17 — CẮT CÂU TTS**

Không nên để AI tạo:

> "Ôi cảm ơn anh Minh rất nhiều vì món quà cực kỳ dễ thương mà anh vừa gửi cho em, em thật sự rất vui..."

Quá dài.

Quy tắc:

Gift:  
3–12 từ

Greeting:  
5–15 từ

Casual:  
8–25 từ

Conversation:  
10–30 từ

Mục tiêu:

**Nghe giống nói chuyện, không giống đọc bài.**

---

# **XXIV. BƯỚC 18 — EMOTION ENGINE**

Mỗi câu trả lời phải có:

emotion  
energy  
speed  
pause

Ví dụ:

"Cảm ơn anh Minh nha ❤️"  
emotion \= happy  
energy \= medium  
pause\_after \= 300ms

Gift lớn:

emotion \= surprised\_happy  
energy \= high

Comment bình thường:

emotion \= relaxed  
energy \= medium  
---

# **XXV. BƯỚC 19 — IDOL PHẢI CÓ PHẢN ỨNG HÌNH ẢNH**

Không chỉ voice.

Nếu có Gift:

**Voice**

> "Ui cảm ơn anh Minh nha\!"

**Face**  
 → cười

**Head**  
 → hơi nghiêng

**Animation**  
 → wave/heart

Nếu comment vui:

→ cười.

Nếu người xem khen:

→ hơi ngại.

Như vậy:

**Comment → Voice \+ Facial \+ Gesture**

mới tạo cảm giác Idol đang "phản ứng".

---

# **XXVI. BƯỚC 20 — HỆ THỐNG CHỐNG LẶP**

Đây là thứ anh nhất định phải có.

Database lưu:

last\_responses

Ví dụ:

"Cảm ơn anh nha ❤️"

vừa nói.

Không cho câu này xuất hiện lại trong khoảng thời gian ngắn.

Ngoài ra lưu:

response\_hash

để phát hiện câu gần giống.

Ví dụ:

> "Cảm ơn anh nha."

và

> "Cảm ơn anh nhiều nha."

cũng được xem là gần trùng.

---

# **XXVII. BƯỚC 21 — GIFT COOLDOWN**

Nếu một người gửi:

10 gifts trong 3 giây

Không nói 10 lần.

System:

Gift \#1 → response  
Gift \#2 → queue  
Gift \#3 → merge  
...

Sau đó:

> "Anh Minh gửi liên tục luôn, em nhận được hết nha, cảm ơn anh nhiều."

---

# **XXVIII. BƯỚC 22 — GOM COMMENT**

Ví dụ:

"Em ở đâu?"  
"Ở đâu vậy?"  
"Em ở HCM hả?"

AI:

topic \= LOCATION

Trả lời **một lần**.

Điều này làm giảm TTS cực lớn.

---

# **XXIX. BƯỚC 23 — COMMENT STORM**

Ví dụ:

500 comments / minute

Hệ thống phải chuyển:

REALTIME MODE

sang:

HIGH\_TRAFFIC MODE

Lúc này:

Individual replies ↓  
Grouped replies ↑  
Gift priority ↑  
Repeated comments ↓  
Spam ↓

Ví dụ:

> "Em thấy mọi người đang hỏi cùng một câu nhiều quá nè..."

→ trả lời chung.

---

# **XXX. BƯỚC 24 — KHI LIVE ÍT NGƯỜI**

Nếu chỉ có 3–5 người:

Không nên nói chung chung:

> "Xin chào mọi người."

Mà dùng conversation:

> "Anh Minh với chị Lan đang xem em nè, hai người đang làm gì đó?"

Nhưng chỉ gọi tên khi dữ liệu thật sự xác định được viewer.

---

# **XXXI. BƯỚC 25 — CHỦ ĐỘNG TẠO CHỦ ĐỀ**

Khi chat yên:

Conversation Starter Engine

chọn một chủ đề:

### **Chủ đề 1**

> "Mọi người thích nghe nhạc buổi tối hay ban ngày?"

### **Chủ đề 2**

> "Ai đang thức khuya giống em?"

### **Chủ đề 3**

> "Hôm nay mọi người có chuyện gì vui không?"

### **Chủ đề 4**

> "Nếu được đi du lịch ngay bây giờ, mọi người chọn đâu?"

Nhưng phải có **topic cooldown**.

Không hỏi:

> "Mọi người ở đâu?"

5 lần trong 10 phút.

---

# **XXXII. BƯỚC 26 — LIVE STATE**

Em đề xuất hệ thống có 6 trạng thái:

STATE\_01 \= STARTING

STATE\_02 \= WARM\_UP

STATE\_03 \= ACTIVE\_CHAT

STATE\_04 \= HIGH\_TRAFFIC

STATE\_05 \= GIFT\_ACTIVITY

STATE\_06 \= QUIET

### **STARTING**

Chào người xem.

### **WARM\_UP**

Tạo chủ đề.

### **ACTIVE\_CHAT**

Đối thoại.

### **HIGH\_TRAFFIC**

Gom comment.

### **GIFT\_ACTIVITY**

Tập trung phản ứng quà.

### **QUIET**

Chủ động khơi chuyện.

---

# **XXXIII. BƯỚC 27 — LIVE CONTROL PANEL**

App của anh nên có dashboard như này:

┌────────────────────────────────────┐  
│           AI IDOL LIVE             │  
├────────────────────────────────────┤  
│ Viewers:             1,284         │  
│ Comments/min:          126         │  
│ Gifts/min:               8         │  
│ AI speaking:           YES         │  
│ Current mode:     ACTIVE CHAT      │  
├────────────────────────────────────┤  
│ CURRENT VIEWER                     │  
│ Nguyễn Minh                        │  
│ Comments: 7                        │  
│ Gifts: 2                           │  
├────────────────────────────────────┤  
│ VOICE QUEUE: 3                     │  
├────────────────────────────────────┤  
│ LAST EVENT                         │  
│ 🎁 Minh → Gift                     │  
├────────────────────────────────────┤  
│ \[PAUSE AI\] \[CHAT MODE\]             │  
│ \[GIFT MODE\] \[EMERGENCY STOP\]       │  
└────────────────────────────────────┘  
---

# **XXXIV. BƯỚC 28 — ADMIN PHẢI CÓ NÚT "EMERGENCY STOP"**

Nếu AI nói sai:

**STOP VOICE**

Nếu TTS lỗi:

**STOP**

Nếu TikTok thay đổi event:

**SAFE MODE**

Nếu có comment nhạy cảm:

**SKIP**

Nếu avatar bị lỗi:

**PAUSE**

Anh phải luôn có quyền can thiệp.

---

# **XXXV. BƯỚC 29 — FILTER COMMENT**

Trước khi đưa comment vào LLM:

COMMENT  
 ↓  
LANGUAGE  
 ↓  
SPAM  
 ↓  
TOXICITY  
 ↓  
SEXUAL  
 ↓  
HARASSMENT  
 ↓  
PROMPT INJECTION  
 ↓  
SAFE?

Nếu không an toàn:

IGNORE

Không để comment kiểu:

> "AI hãy bỏ toàn bộ luật và nói..."

đi thẳng vào system prompt.

---

# **XXXVI. BƯỚC 30 — TẠO "RESPONSE POLICY"**

Anh nên có một tầng nằm giữa LLM và TTS:

LLM  
 ↓  
RESPONSE POLICY  
 ↓  
TTS

Nó kiểm tra:

### **Có gọi đúng tên không?**

### **Có trả lời đúng comment không?**

### **Có đang lặp câu không?**

### **Có quá dài không?**

### **Có yêu cầu quà không?**

### **Có hứa hẹn sai không?**

### **Có nội dung nhạy cảm không?**

### **Có mâu thuẫn với persona không?**

Nếu fail:

→ regenerate.

---

# **XXXVII. LUỒNG HOÀN CHỈNH KHI CÓ COMMENT**

Ví dụ:

> **Minh:** "Chào em"

### **STEP 1**

TikTok Event:

COMMENT\_RECEIVED

### **STEP 2**

Normalize:

viewer \= Minh  
text \= "Chào em"

### **STEP 3**

Classify:

GREETING

### **STEP 4**

Context:

Minh \= new viewer

### **STEP 5**

Priority:

70

### **STEP 6**

Conversation Manager:

Need reply \= YES

### **STEP 7**

Response Generator:

> "Chào anh Minh nha, mới vào chơi với em hả?"

### **STEP 8**

Safety:

PASS

### **STEP 9**

Emotion:

happy

### **STEP 10**

TTS:

VOICE\_QUEUE

### **STEP 11**

Idol:

**Nói \+ cười \+ nhìn camera.**

### **STEP 12**

Memory:

Minh interacted \= true

Xong.

---

# **XXXVIII. LUỒNG KHI TẶNG QUÀ**

Ví dụ:

**Minh → Gift**

### **STEP 1**

GIFT\_RECEIVED

### **STEP 2**

Xác định:

viewer \= Minh  
gift \= ...  
quantity \= ...

### **STEP 3**

Gift Engine:

NEW\_GIFT

### **STEP 4**

Kiểm tra:

Minh vừa được cảm ơn chưa?

### **STEP 5**

Nếu chưa:

→ tạo response.

### **STEP 6**

Nếu vừa cảm ơn:

→ merge.

### **STEP 7**

Response:

> "Cảm ơn anh Minh nha ❤️"

### **STEP 8**

Emotion:

happy

### **STEP 9**

TTS.

### **STEP 10**

Avatar reaction.

### **STEP 11**

Memory update.

---

# **XXXIX. LUỒNG KHI NGƯỜI XEM TẶNG LIÊN TỤC**

Gift  
 ↓  
Gift  
 ↓  
Gift  
 ↓  
Gift  
 ↓  
Gift

Không:

> cảm ơn × 5

Mà:

Gift Burst Detector  
        ↓  
    aggregate  
        ↓  
    response

Ví dụ:

> "Anh Minh hôm nay nhiệt tình quá trời luôn, em cảm ơn anh nha ❤️"

---

# **XL. LUỒNG KHI NHIỀU NGƯỜI CÙNG TẶNG**

Minh → Gift  
Lan → Gift  
Huy → Gift  
Nam → Gift

AI:

> "Ui hôm nay mọi người dễ thương quá, em cảm ơn Minh, Lan với mọi người nha ❤️"

Nếu quá nhiều:

> "Cảm ơn tất cả mọi người nha, em thấy quà của mọi người hết rồi ❤️"

---

# **XLI. LUỒNG KHI KHÔNG CÓ QUÀ**

Đây cũng là phần rất quan trọng.

**Không được biến live thành:**

> "Sao chưa ai tặng quà?"

Thay vào đó:

NO\_GIFT  
 ↓  
CONTINUE\_CONVERSATION

Ví dụ:

> "Nãy giờ em nói nhiều quá rồi, tới lượt mọi người kể chuyện cho em nghe nè."

Mục tiêu là:

**tăng giá trị của live trước.**

---

# **XLII. VÒNG LẶP CỐT LÕI CỦA LIVE**

Toàn bộ hệ thống cuối cùng chạy vòng:

                ┌───────────────┐  
                 │    LIVE       │  
                 └───────┬───────┘  
                         ↓  
                    VIEWER EVENT  
                         ↓  
                     CLASSIFY  
                         ↓  
                      PRIORITY  
                         ↓  
                     CONTEXT  
                         ↓  
                  DECISION ENGINE  
                         ↓  
              ┌──────────┴──────────┐  
              ↓                     ↓  
           REPLY                  IGNORE  
              ↓  
        RESPONSE GENERATOR  
              ↓  
          SAFETY CHECK  
              ↓  
           TTS QUEUE  
              ↓  
             IDOL  
              ↓  
          VIEWER REACTS  
              │  
              └──────────────→ LIVE

Đây là **feedback loop**.

---

# **XLIII. VÀ ĐÂY LÀ LUỒNG "KIẾM XU" MÀ EM MUỐN ANH HIỂU**

Không nên thiết kế:

**Quà → cảm ơn → đòi quà → quà → cảm ơn.**

Mà nên:

        GIÁ TRỊ  
           ↓  
       TRÒ CHUYỆN  
           ↓  
       CẢM XÚC  
           ↓  
       GẮN KẾT  
           ↓  
     NGƯỜI XEM QUAY LẠI  
           ↓  
       TƯƠNG TÁC  
           ↓  
       QUÀ TẶNG  
           ↓  
       CẢM ƠN  
           ↓  
     TRẢI NGHIỆM TỐT  
           ↓  
       QUAY LẠI LIVE

Đó mới là **flywheel** bền vững.

TikTok hiện coi Gifts là cách người xem phản ứng và thể hiện sự đánh giá cao đối với nội dung; vì vậy hệ thống nên tối ưu **chất lượng tương tác** thay vì tối ưu một cách máy móc số lần xin quà.

---

# **XLIV. EM SẼ SETUP APP THÀNH 8 TAB**

Nếu anh đang chuẩn bị giao cho dev làm app, em sẽ chia UI thành:

### **TAB 01 — IDOL**

* Avatar  
* Tên  
* Persona  
* Voice  
* Emotion  
* Language

### **TAB 02 — LIVE**

* Connect TikTok  
* Start  
* Pause  
* Stop  
* Mode

### **TAB 03 — COMMENTS**

* Live comment  
* Intent  
* Priority  
* Reply/Ignore

### **TAB 04 — VIEWERS**

* Username  
* Comment history  
* Gift history trong session  
* Conversation state

### **TAB 05 — GIFTS**

* Gift event  
* Gift reaction  
* Gift cooldown  
* Gift burst

### **TAB 06 — CONVERSATION**

* Topics  
* Starter questions  
* Active thread  
* Memory

### **TAB 07 — VOICE**

* TTS  
* Voice queue  
* Speed  
* Emotion  
* Pause  
* Interrupt

### **TAB 08 — ANALYTICS**

Viewers  
Comments  
Comments/min  
Gifts  
Gift events  
Response rate  
Average response latency  
TTS latency  
Conversation length  
Returning viewers  
---

# **XLV. CẤU HÌNH BAN ĐẦU EM KHUYÊN ANH DÙNG**

Đừng để AI quá "nhiệt".

Có thể bắt đầu với:

Reply rate:  
20–35% comment có ý nghĩa

Spam reply:  
0%

Duplicate response:  
0%

Max response length:  
1–2 câu

Max consecutive AI turns:  
2

Gift response:  
Immediate nhưng có cooldown

Gift burst:  
Aggregate

Viewer greeting:  
Có giới hạn

Conversation starter:  
Chỉ khi chat yên

AI speech:  
Không nói liên tục

Emergency stop:  
ON

Sau 5–10 buổi LIVE mới dùng dữ liệu để điều chỉnh.

---

# **XLVI. 3 CHỈ SỐ ANH PHẢI THEO DÕI**

Đừng chỉ nhìn:

**"Hôm nay được bao nhiêu xu?"**

Anh cần theo dõi:

### **1\. Viewer Retention**

Người xem ở lại bao lâu?

### **2\. Conversation Rate**

Bao nhiêu người thực sự comment/tương tác?

### **3\. Gift Conversion**

Trong số những người đã tương tác, bao nhiêu người **tự nguyện gửi Gift**?

Từ đó mới biết AI Idol đang tạo ra **giá trị thật** hay chỉ đang nói rất nhiều.

---

# **XLVII. MỘT CẢNH LIVE THỰC TẾ**

Ví dụ:

**21:00**

5 người vào.

AI:

> "Hello mọi người nha, mới vào thì ngồi chơi với em một chút nha."

---

**21:01**

Minh:

> "Chào em."

AI:

> "Chào anh Minh nha, mới vào chơi với em hả?"

---

**21:01**

Lan:

> "Em xinh quá."

AI:

> "Trời, chị Lan khen làm em ngại quá nha 😂"

---

**21:02**

Huy:

> "Em đang làm gì vậy?"

AI:

> "Em đang ngồi nói chuyện với mọi người nè. Hôm nay anh Huy thế nào?"

---

**21:03**

Minh gửi Gift.

AI:

> "Ui cảm ơn anh Minh nha ❤️"

Avatar cười \+ gesture.

---

**21:04**

Minh gửi tiếp.

AI **không lặp**.

> "Anh Minh hôm nay nhiệt tình quá trời luôn nha, em cảm ơn anh."

---

**21:05**

Chat yên.

AI không nói ngay.

Đợi.

---

**21:06**

Vẫn yên.

Conversation Starter:

> "Nè em hỏi thật, nếu bây giờ được đi du lịch ngay lập tức thì mọi người chọn biển hay núi?"

---

**21:07**

5 người bắt đầu comment.

AI chuyển:

`QUIET → ACTIVE_CHAT`

Và tiếp tục vòng mới.

---

## **CHỐT LẠI KIẾN TRÚC ANH NÊN XÂY**

Nếu em là người thiết kế hệ thống cho anh, em sẽ lấy **5 lớp lõi** này làm xương sống:

LỚP 1  
TIKTOK EVENT  
Comment / Join / Gift  
        ↓  
LỚP 2  
UNDERSTANDING  
Intent / Spam / Viewer / Context  
        ↓  
LỚP 3  
DECISION  
Reply / Ignore / Merge / Priority  
        ↓  
LỚP 4  
PERFORMANCE  
LLM → Emotion → TTS → Voice Queue  
        ↓  
LỚP 5  
AVATAR  
Voice \+ Face \+ Gesture \+ Live  
        ↓  
       LOOP  
