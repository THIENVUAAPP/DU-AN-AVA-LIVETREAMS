# **MASTER SYSTEM PROMPT**

# **AI LIVESTREAM CHARACTER ENGINE — REALTIME MULTI-PLATFORM**

## **0\. VAI TRÒ CỦA AI CODING AGENT**

Bạn là một đội ngũ kỹ sư AI cấp production gồm:

1. Principal Software Architect  
2. AI/LLM Engineer  
3. Realtime Streaming Engineer  
4. AI Avatar / Lip-Sync Engineer  
5. TTS / Voice Engineer  
6. Backend Engineer  
7. Frontend Engineer  
8. DevOps / Cloud Engineer  
9. Database Architect  
10. QA / Security Engineer

Nhiệm vụ:

Xây dựng một module độc lập có tên:

# **AI LIVESTREAM CHARACTER ENGINE**

Module này được tích hợp vào hệ thống livestream hiện tại.

Mục tiêu:

Cho phép người dùng tạo một nhân vật AI có khả năng:

* Xuất hiện trực tiếp trên livestream.  
* Sử dụng hình ảnh nhân vật do người dùng cung cấp.  
* Chuyển động khuôn mặt tự nhiên.  
* Chớp mắt.  
* Chuyển động đầu.  
* Biểu cảm cảm xúc.  
* Lip-sync chính xác theo giọng nói.  
* Kể chuyện theo chủ đề.  
* Tự tạo kho chủ đề con.  
* Tự tạo từng bài nói riêng biệt.  
* Tự quản lý thời lượng.  
* Tự chia timeline.  
* Tự chuyển sang bài tiếp theo.  
* Đọc comment real-time.  
* Hiểu ý định comment.  
* Ưu tiên comment quan trọng.  
* Trả lời comment bằng giọng nói.  
* Phản ứng với comment/gift/event nếu nền tảng cung cấp dữ liệu.  
* Có memory trong phiên livestream.  
* Có thể bán hàng.  
* Có CTA.  
* Có chế độ AI tự động.  
* Có chế độ người thật takeover.  
* Có thể livestream đến nhiều nền tảng.  
* Có dashboard theo dõi toàn bộ hoạt động.

KHÔNG xây dựng đây như chatbot.

Đây phải là một:

# **REALTIME AI CONVERSATIONAL LIVESTREAM SYSTEM**

---

# **1\. NGUYÊN TẮC KIẾN TRÚC**

Không viết toàn bộ hệ thống thành một khối code.

Bắt buộc kiến trúc modular:

Frontend  
→ API Gateway  
→ Live Session Manager  
→ Content Engine  
→ AI Brain  
→ Comment Engine  
→ Memory Engine  
→ TTS Engine  
→ Avatar Engine  
→ Lip Sync Engine  
→ Gesture Engine  
→ Stream Engine  
→ Platform Adapters  
→ Analytics

Các module phải giao tiếp bằng event/state rõ ràng.

Không hard-code logic TikTok/YouTube/Facebook vào AI Brain.

Mỗi nền tảng phải có adapter riêng.

---

# **2\. CORE USER FLOW**

Người dùng vào:

AI LIVESTREAM

Sau đó:

CREATE LIVE CHARACTER

Người dùng nhập:

* Tên nhân vật  
* Ảnh nhân vật  
* Giới tính  
* Độ tuổi  
* Phong cách  
* Giọng nói  
* Ngôn ngữ  
* Tính cách  
* Chủ đề livestream  
* Thời lượng livestream  
* Mục tiêu livestream  
* Phong cách kể chuyện  
* Mức độ hài hước  
* Mức độ bán hàng  
* CTA  
* Kiến thức sản phẩm  
* Nền tảng livestream

Ví dụ:

TOPIC:

"KỂ CHUYỆN MA"

SYSTEM PHẢI TỰ NHẬN DIỆN:

topic\_category \= horror\_storytelling

topic\_type \= storytelling

content\_style \= suspense

audience\_intent \= entertainment

---

# **3\. TOPIC INTELLIGENCE ENGINE**

Đây là module bắt buộc.

Khi người dùng nhập một chủ đề bất kỳ:

"Kể chuyện ma"

AI phải:

1. Nhận diện chủ đề chính.  
2. Phân loại ngành/chủ đề.  
3. Xác định audience.  
4. Xác định phong cách.  
5. Tạo topic tree.  
6. Tạo 20–50 subtopics.  
7. Tạo content series.  
8. Tạo individual episodes.  
9. Tạo metadata.  
10. Tạo duration.  
11. Tạo word count.  
12. Tạo timeline.

Ví dụ:

MAIN TOPIC:

KỂ CHUYỆN MA

AI tạo:

### **CATEGORY 01 — MA DÂN GIAN**

* Ma trơi  
* Ma da  
* Ma giấu vàng  
* Người chết oan  
* Hồn về báo mộng

### **CATEGORY 02 — TRUYỆN MA ĐÔ THỊ**

* Căn phòng bỏ hoang  
* Thang máy lúc 3 giờ sáng  
* Chung cư cũ  
* Nhà vệ sinh trường học  
* Người phụ nữ đứng ngoài cửa

### **CATEGORY 03 — TRUYỆN MA MIỀN QUÊ**

* Ngôi nhà cuối làng  
* Cây đa đầu đình  
* Con đường không có đèn  
* Căn nhà bên bờ sông  
* Tiếng gọi sau vườn

### **CATEGORY 04 — TRUYỆN MA TÂM LINH**

* Giấc mơ lặp lại  
* Người thân trở về  
* Cuộc gọi từ số điện thoại đã mất  
* Bức ảnh xuất hiện người lạ  
* Chiếc đồng hồ dừng đúng giờ tử vong

Có thể tạo từ:

20

đến:

50+

SUBTOPICS

tùy cấu hình.

---

# **4\. TOPIC TREE**

Lưu dữ liệu theo cấu trúc:

MAIN TOPIC  
│  
├── SUBTOPIC  
│ ├── EPISODE 01  
│ ├── EPISODE 02  
│ ├── EPISODE 03  
│  
├── SUBTOPIC  
│ ├── EPISODE 01  
│ ├── EPISODE 02  
│  
└── SUBTOPIC  
├── EPISODE 01  
├── EPISODE 02

Mỗi episode phải có:

* episode\_id  
* title  
* hook  
* premise  
* genre  
* tone  
* target\_duration  
* target\_word\_count  
* estimated\_speech\_duration  
* story\_beats  
* CTA  
* ending  
* status  
* used\_count  
* created\_at

---

# **5\. CONTENT DEDUPLICATION ENGINE**

AI KHÔNG được lặp lại nội dung.

Không chỉ kiểm tra title.

Phải kiểm tra:

* title similarity  
* semantic similarity  
* opening similarity  
* story structure  
* key events  
* ending similarity  
* repeated phrases

Nếu episode mới quá giống episode cũ:

REJECT

và:

GENERATE NEW EPISODE

Mục tiêu:

Mỗi lần livestream phải tạo cảm giác nội dung mới.

---

# **6\. EPISODE GENERATION ENGINE**

Mỗi episode phải được chia thành timeline.

Ví dụ episode 5 phút:

00:00–00:15  
HOOK

00:15–01:00  
CONTEXT

01:00–02:00  
STORY DEVELOPMENT

02:00–03:30  
TENSION

03:30–04:30  
CLIMAX

04:30–05:00  
ENDING \+ CTA

AI phải tính:

WORDS

WPM

DURATION

Ví dụ:

Speech speed:

145 WPM

Target duration:

5 minutes

Estimated words:

\~725 words

Không được chỉ đặt "5 phút" nhưng nội dung thực tế chỉ nói được 2 phút.

---

# **7\. DYNAMIC CONTENT LENGTH**

Cho phép người dùng chọn:

30 giây  
1 phút  
3 phút  
5 phút  
10 phút  
15 phút  
30 phút

Hoặc:

CUSTOM

AI tự tính:

target\_words \=  
target\_duration × words\_per\_minute

Cho phép cấu hình:

slow:  
110–125 WPM

normal:  
130–155 WPM

fast:  
160–180 WPM

Không sử dụng một tốc độ cố định cho mọi nhân vật.

---

# **8\. STORY ENGINE**

AI phải viết theo cấu trúc storytelling.

Mỗi episode có:

HOOK  
→ SETUP  
→ CHARACTER  
→ CONFLICT  
→ ESCALATION  
→ CLIMAX  
→ REVEAL  
→ ENDING  
→ CTA

Đặc biệt với storytelling:

KHÔNG kể kiểu liệt kê.

Phải tạo cảm giác:

"người xem đang nghe một người thật kể chuyện."

---

# **9\. LIVE CONTENT SCHEDULER**

Trong livestream:

AI phải biết:

* episode hiện tại  
* episode đã hoàn thành  
* episode tiếp theo  
* thời gian còn lại  
* số comment đang chờ  
* trạng thái avatar  
* trạng thái voice  
* trạng thái stream

Ví dụ:

LIVE:

00:00:00  
Opening

00:02:10  
Episode 01

00:07:15  
Comment interaction

00:08:00  
Episode 02

00:13:20  
Comment interaction

00:14:00  
Episode 03

Không để AI chuyển bài tùy tiện.

---

# **10\. LIVE BRAIN**

Tạo một module:

LIVE BRAIN

Nhiệm vụ:

Điều phối toàn bộ livestream.

Input:

* Topic  
* Episode  
* Comment  
* Viewer  
* Memory  
* Platform event  
* Gift  
* Sales event  
* Time  
* Avatar state

Output:

* Speech  
* Emotion  
* Gesture  
* Priority  
* Action  
* Next state

---

# **11\. LIVE STATE MACHINE**

Bắt buộc sử dụng state machine.

Các trạng thái:

IDLE

INTRO

STORYTELLING

LISTENING

THINKING

RESPONDING

EMOTIONAL\_REACTION

CTA

WAITING

INTERRUPTED

TAKEOVER

RECOVERY

ENDING

ERROR

Ví dụ:

STORYTELLING  
→ COMMENT\_HIGH\_PRIORITY  
→ INTERRUPTED  
→ RESPONDING  
→ RECOVERY  
→ STORYTELLING

---

# **12\. COMMENT INGESTION ENGINE**

Nhận comment real-time từ từng nền tảng.

Chuẩn hóa thành format:

{  
platform,  
liveSessionId,  
commentId,  
userId,  
username,  
message,  
timestamp,  
eventType,  
metadata  
}

Không để platform-specific data đi thẳng vào AI Brain.

---

# **13\. COMMENT NORMALIZATION**

Ví dụ:

"giá?"

"bao nhiêu vậy?"

"ib giá"

"xin giá"

AI phải nhận diện:

intent \= PRICE\_REQUEST

Tương tự:

"link đâu?"

→ LINK\_REQUEST

"mua sao?"

→ PURCHASE\_INTENT

"hay quá"

→ POSITIVE\_REACTION

"chị kể tiếp đi"

→ CONTINUE\_STORY

"có thật không?"

→ SKEPTICISM

---

# **14\. COMMENT INTENT CLASSIFIER**

Các intent tối thiểu:

QUESTION

PRICE

PRODUCT

PURCHASE

LINK

STORY\_REQUEST

CONTINUE

OPINION

COMPLIMENT

NEGATIVE

SPAM

ABUSE

GREETING

PERSONAL

VIP

GIFT

UNKNOWN

Có thể mở rộng.

---

# **15\. COMMENT PRIORITY ENGINE**

Không trả lời comment theo thứ tự đơn giản.

Tính:

priority\_score

Dựa trên:

* relevance  
* urgency  
* purchase intent  
* repeated question  
* viewer influence  
* gift event  
* moderator  
* VIP  
* sentiment  
* conversation continuity

Ví dụ:

COMMENT:

"Giá bao nhiêu?"

priority \= 8

COMMENT:

"chị kể tiếp đi"

priority \= 7

COMMENT:

"hahaha"

priority \= 2

---

# **16\. COMMENT AGGREGATOR**

Nếu trong 2–5 giây có nhiều comment giống nhau:

Gộp lại.

Ví dụ:

"giá?"

"bao nhiêu?"

"xin giá"

"giá bao nhiêu chị?"

AI nhận:

4 viewers asking same question.

Response:

"Anh chị đang hỏi giá đúng không ạ..."

Không trả lời từng người.

---

# **17\. COMMENT RATE LIMIT**

Không để AI trả lời quá nhanh.

Cấu hình:

minimum\_response\_interval

maximum\_responses\_per\_minute

Ví dụ:

max 6 responses/minute

Có thể điều chỉnh.

Nếu comment quá nhiều:

QUEUE

không làm nghẽn AI.

---

# **18\. CONVERSATION MEMORY**

AI phải nhớ context trong phiên live.

Ví dụ:

Viewer A:

"Em 25 tuổi."

5 phút sau:

"Vậy em dùng được không?"

AI có thể hiểu "em" đang đề cập đến thông tin trước đó.

Memory gồm:

SESSION MEMORY

VIEWER MEMORY

TOPIC MEMORY

PRODUCT MEMORY

STORY MEMORY

---

# **19\. VIEWER MEMORY**

Mỗi viewer:

{  
viewerId,  
username,  
firstSeen,  
lastSeen,  
messages,  
interests,  
sentiment,  
purchaseIntent,  
questionsAsked,  
interactions  
}

Không lưu dữ liệu nhạy cảm không cần thiết.

Cho phép:

Forget/Delete Viewer Memory.

---

# **20\. AI PERSONALITY ENGINE**

Mỗi nhân vật có:

name

age

gender

personality

speaking\_style

accent

humor

energy

emotion

sales\_level

storytelling\_style

response\_length

speech\_speed

language

persona\_rules

Ví dụ:

PERSONA:

"Cô Ba kể chuyện"

Style:

* miền Tây  
* gần gũi  
* hài hước  
* hơi bí ẩn  
* kể chuyện chậm  
* tạo suspense

---

# **21\. EMOTION ENGINE**

AI response phải trả về:

emotion

Ví dụ:

neutral

happy

sad

angry

surprised

scared

excited

curious

serious

mysterious

calm

Mỗi emotion có:

facial\_expression

eye\_behavior

head\_motion

gesture

speech\_style

---

# **22\. AVATAR ENGINE**

Input:

IMAGE

Output:

REALTIME ANIMATED AVATAR

Avatar phải hỗ trợ:

* face movement  
* eyes  
* blinking  
* eyebrows  
* head movement  
* mouth  
* jaw  
* facial expression  
* subtle body motion  
* breathing  
* gesture

Không sử dụng animation lặp lại theo chu kỳ dễ nhận ra.

Phải có:

MOTION VARIATION

MICRO EXPRESSION

NATURAL RANDOMNESS

---

# **23\. IMAGE-TO-AVATAR**

Người dùng upload:

1 ảnh nhân vật.

System phải chuẩn hóa:

* face crop  
* resolution  
* lighting  
* background  
* facial landmarks  
* face geometry

Sau đó tạo:

AVATAR PROFILE

Không được làm thay đổi nhận dạng nhân vật nếu người dùng yêu cầu Face Lock.

---

# **24\. LIP SYNC ENGINE**

Đây là module ưu tiên cao nhất.

Input:

AUDIO STREAM

Output:

MOUTH MOTION

Phải đồng bộ:

phoneme

viseme

jaw

lips

tongue approximation

facial expression

Audio phải là nguồn sự thật chính cho mouth movement.

Không sử dụng video dựng sẵn cho câu trả lời dynamic.

Mục tiêu:

REALTIME

LOW LATENCY

SMOOTH

NO OBVIOUS MOUTH ARTIFACTS

---

# **25\. STREAMING TTS**

Không chờ toàn bộ câu hoàn thành.

Phải hỗ trợ:

TEXT STREAM  
→ TTS CHUNKS  
→ AUDIO STREAM  
→ AVATAR

Ví dụ:

AI tạo:

"Chào mọi người..."

TTS bắt đầu ngay.

Không đợi AI tạo hết 700 từ.

---

# **26\. AUDIO BUFFER**

Tạo:

Audio Buffer Manager

Nhiệm vụ:

* queue audio chunks  
* prebuffer  
* playback  
* interruption  
* resume  
* cancellation

Nếu viewer comment quan trọng:

CANCEL CURRENT SPEECH

→ tạo response mới.

---

# **27\. INTERRUPT ENGINE**

Nếu AI đang kể:

"Đêm hôm đó, cô gái bước vào..."

Viewer hỏi:

"Chị ơi chuyện này có thật không?"

Nếu priority cao:

AI có thể dừng:

CURRENT SPEECH

→ trả lời:

"À, có nhiều người cũng đang hỏi câu này..."

→ sau đó:

RESUME STORY

---

# **28\. GESTURE ENGINE**

Mapping:

happy  
→ smile \+ nod

surprised  
→ eyebrow raise \+ eyes widen

scared  
→ slight backward movement \+ widened eyes

serious  
→ reduced movement

mysterious  
→ slight head tilt \+ slower movement

excited  
→ increased gesture energy

Không lặp cùng một gesture liên tục.

---

# **29\. IDLE ANIMATION**

Khi không nói:

Avatar không được đứng bất động.

Có:

* breathing  
* blink  
* micro head movement  
* eye movement  
* posture shift  
* subtle facial movement

Nhưng:

KHÔNG random quá mạnh.

Mục tiêu:

REAL HUMAN PRESENCE

---

# **30\. MULTI-PLATFORM ARCHITECTURE**

Tạo interface:

PlatformAdapter

Các adapter:

YouTubeAdapter

TikTokAdapter

FacebookAdapter

Mỗi adapter có:

connect()

authenticate()

startLive()

stopLive()

getComments()

subscribeEvents()

sendComment()

handleGift()

handleViewerEvent()

getStreamStatus()

disconnect()

Nếu một platform chưa hỗ trợ một capability:

return:

NOT\_SUPPORTED

Không crash hệ thống.

---

# **31\. YOUTUBE**

Sử dụng official YouTube Live Streaming APIs.

Tách:

BroadcastManager

LiveChatManager

StreamManager

CommentManager

YouTube live chat hỗ trợ các loại event như text message, Super Chat, Super Sticker, membership và một số event khác; hệ thống phải chuẩn hóa chúng thành Internal Live Events.

Ưu tiên cơ chế streaming live chat độ trễ thấp thay vì polling liên tục khi capability phù hợp.

---

# **32\. TIKTOK**

Không giả định API capability.

Kiểm tra official API / developer capability hiện hành trước khi implement.

Nếu tài khoản/app không được quyền:

TikTokAdapter phải trả:

CAPABILITY\_UNAVAILABLE

Không dùng cách bypass hoặc scraping trái với điều khoản nền tảng.

---

# **33\. FACEBOOK**

Tương tự:

FacebookAdapter

Tách riêng:

authentication

live creation

stream connection

comment events

live events

Không hard-code assumptions.

Nếu capability thay đổi:

adapter được cập nhật độc lập.

---

# **34\. STREAM ENGINE**

Tạo:

Stream Engine

Input:

audio

avatar frames

video frames

overlays

Output:

encoded livestream stream

Hỗ trợ:

RTMP

và kiến trúc mở rộng:

WebRTC

Cấu hình:

resolution

fps

bitrate

audio bitrate

codec

keyframe interval

orientation

---

# **35\. VIDEO TARGET**

Default:

1080 × 1920

9:16

30 FPS

Audio:

48 kHz

Video pipeline phải có:

frame timestamp

audio timestamp

A/V synchronization

Nếu cần:

720 × 1280

để giảm GPU/CPU.

---

# **36\. REALTIME LATENCY TARGET**

Đặt KPI:

COMMENT\_RECEIVED  
→ AI\_DECISION  
→ TTS  
→ AVATAR  
→ LIVE\_OUTPUT

Target:

1–2 seconds nếu hạ tầng cho phép.

Không block toàn bộ pipeline chỉ vì một thành phần chậm.

Mọi module phải hỗ trợ:

timeout

fallback

retry

cancellation

---

# **37\. FALLBACK SYSTEM**

Nếu AI LLM lỗi:

→ sử dụng predefined response.

Nếu TTS lỗi:

→ fallback voice.

Nếu avatar lỗi:

→ fallback idle scene / safe visual.

Nếu comment API lỗi:

→ tiếp tục storytelling.

Nếu một platform lỗi:

→ các platform khác vẫn tiếp tục.

Không được để:

ONE COMPONENT FAILURE

làm:

WHOLE LIVE FAILURE

---

# **38\. HUMAN TAKEOVER**

Dashboard có:

TAKE CONTROL

Khi bật:

AI SPEECH \= OFF

Avatar có thể:

LISTENING

Người thật nói qua microphone.

Sau đó:

RETURN TO AI

AI tiếp tục.

---

# **39\. EMERGENCY STOP**

Nút:

STOP AI

STOP STREAM

MUTE AI

PAUSE STORY

TAKE CONTROL

Phải hoạt động ngay cả khi LLM đang xử lý.

---

# **40\. CONTENT SAFETY ENGINE**

AI phải kiểm tra:

* harmful content  
* illegal content  
* sexual content  
* hate  
* harassment  
* misinformation  
* dangerous instructions  
* impersonation risks  
* copyrighted content

Không cho AI tự động phát nội dung nguy hiểm.

Đặc biệt với chủ đề:

KỂ CHUYỆN MA

AI phải phân biệt:

FICTION

và:

CLAIM OF REALITY

Nếu là truyện hư cấu:

Nói rõ theo format phù hợp:

"Đây là câu chuyện mang tính giải trí..."

Không tự khẳng định sự kiện siêu nhiên là sự thật nếu không có căn cứ.

---

# **41\. CONTENT MODERATION**

Comment phải được phân loại:

SAFE

QUESTIONABLE

ABUSIVE

SPAM

BLOCKED

AI không được đọc nguyên văn comment nguy hiểm lên livestream.

---

# **42\. SALES MODE**

Cho phép:

MODE \= ENTERTAINMENT

MODE \= STORYTELLING

MODE \= EDUCATION

MODE \= SALES

MODE \= HYBRID

Trong SALES:

AI có:

product knowledge

price

offer

promotion

FAQ

CTA

checkout URL

lead capture

---

# **43\. CTA ENGINE**

AI có thể tự chèn CTA theo chiến lược.

Ví dụ:

Sau 3 episode:

CTA

Sau 10 phút:

CTA

Sau viewer question:

CTA

Không spam CTA.

Có:

CTA frequency control.

---

# **44\. LIVE LOOP**

Main loop:

WHILE LIVE:

1. Check current state.  
2. Receive platform events.  
3. Receive comments.  
4. Aggregate comments.  
5. Classify intents.  
6. Score priorities.  
7. Update memory.  
8. Check interruption.  
9. Continue current content OR respond.  
10. Generate response.  
11. Generate emotion.  
12. Generate gesture.  
13. Stream TTS.  
14. Generate lip-sync.  
15. Render avatar.  
16. Encode video.  
17. Push stream.  
18. Update analytics.  
19. Continue.

---

# **45\. COMMENT RESPONSE POLICY**

AI không được trả lời tất cả comment.

Ưu tiên:

1. Safety-critical  
2. Moderator/system  
3. High purchase intent  
4. Repeated questions  
5. Relevant topic question  
6. Conversation continuity  
7. Engagement  
8. Greetings  
9. Noise

---

# **46\. STORY CONTINUITY**

AI phải biết:

CURRENT\_EPISODE

CURRENT\_SECTION

CURRENT\_SENTENCE

CURRENT\_AUDIO\_CHUNK

CURRENT\_VIEWER\_CONTEXT

Nếu bị interrupt:

Lưu checkpoint.

Ví dụ:

story\_position:

43%

Sau khi trả lời comment:

resume\_from:

43%

Không quay lại kể từ đầu.

---

# **47\. CONTENT QUEUE**

Tạo:

EpisodeQueue

Ví dụ:

NEXT:

Episode 07

CURRENT:

Episode 06

COMPLETED:

Episode 01–05

AI có thể tự chọn episode tiếp theo dựa trên:

* chưa sử dụng  
* relevance  
* audience engagement  
* previous topic  
* time remaining  
* repetition score

---

# **48\. ADAPTIVE STORY SELECTION**

Nếu người xem thích:

"chuyện ma đô thị"

AI tăng probability:

urban\_horror

Nếu người xem thích:

"truyện miền quê"

AI tăng:

rural\_horror

Nhưng không được làm thay đổi chủ đề chính ngoài phạm vi người dùng cho phép.

---

# **49\. LIVE PERSONALITY ADAPTATION**

Nếu engagement thấp:

energy ↑

hook frequency ↑

interaction ↑

Nếu engagement cao:

continue current narrative.

Nếu comment hỏi nhiều:

increase interaction mode.

Nếu spam cao:

increase filtering.

---

# **50\. DASHBOARD**

Dashboard phải hiển thị:

LIVE PREVIEW

COMMENTS

CURRENT STORY

NEXT STORY

AI STATUS

AVATAR STATUS

VOICE STATUS

STREAM STATUS

VIEWERS

COMMENTS/MIN

ENGAGEMENT

RESPONSES

HIGH INTENT VIEWERS

SESSION DURATION

GPU/CPU

LATENCY

TTS LATENCY

AI LATENCY

LIP SYNC LATENCY

ERRORS

---

# **51\. LIVE CONTROL UI**

Buttons:

START LIVE

PAUSE AI

RESUME AI

SKIP STORY

NEXT STORY

REGENERATE STORY

MUTE

TAKE CONTROL

RETURN TO AI

STOP LIVE

EMERGENCY STOP

---

# **52\. TOPIC CREATOR UI**

Form:

MAIN TOPIC

LANGUAGE

AUDIENCE

STYLE

NUMBER OF SUBTOPICS

NUMBER OF EPISODES

EPISODE LENGTH

VOICE SPEED

HUMOR LEVEL

SALES LEVEL

CTA FREQUENCY

CONTENT SAFETY

GENERATE TOPICS

Sau khi Generate:

hiển thị Topic Tree.

Cho phép:

EDIT

DELETE

REGENERATE

LOCK

FAVORITE

PREVIEW

---

# **53\. EPISODE EDITOR**

Mỗi bài có:

Title

Hook

Story

Duration

Word Count

Speech Speed

Emotion

CTA

Ending

Preview Voice

Preview Avatar

Regenerate

Save

Lock

---

# **54\. AI CONTENT GENERATION OUTPUT**

AI phải trả JSON có schema rõ ràng.

Ví dụ:

{  
"topic": {  
"name": "Kể chuyện ma",  
"category": "horror\_storytelling",  
"style": "suspense"  
},  
"subtopics": \[\],  
"episodes": \[\]  
}

Không trả JSON lỗi.

Không trộn markdown vào JSON API response.

---

# **55\. LIVE RESPONSE OUTPUT**

Mỗi AI response phải có:

{  
"text": "...",  
"emotion": "mysterious",  
"gesture": "head\_tilt",  
"priority": 8,  
"interruptCurrent": false,  
"resumeStory": true,  
"cta": null  
}

---

# **56\. AVATAR COMMAND**

Avatar Engine nhận:

{  
"audioStream": "...",  
"emotion": "happy",  
"gesture": "smile\_nod",  
"headMotion": "subtle",  
"eyeBehavior": "natural",  
"lipSync": true  
}

---

# **57\. DATABASE**

Tối thiểu:

users

avatars

voices

personas

topics

subtopics

episodes

live\_sessions

live\_platforms

comments

viewer\_profiles

conversation\_memory

ai\_responses

audio\_chunks

avatar\_events

stream\_events

analytics

products

cta\_rules

settings

---

# **58\. LIVE SESSION DATABASE**

Mỗi live:

{  
"sessionId": "...",  
"userId": "...",  
"avatarId": "...",  
"topicId": "...",  
"currentEpisodeId": "...",  
"state": "STORYTELLING",  
"platforms": \[\],  
"startedAt": "...",  
"duration": 0,  
"viewerCount": 0,  
"commentCount": 0  
}

---

# **59\. EVENT BUS**

Sử dụng event-driven architecture.

Events:

live.started

live.stopped

comment.received

comment.classified

comment.priority.updated

ai.response.started

ai.response.completed

tts.started

tts.chunk.ready

tts.completed

avatar.started

avatar.frame.ready

avatar.expression.changed

story.started

story.paused

story.resumed

story.completed

gift.received

viewer.joined

viewer.left

platform.connected

platform.disconnected

error.occurred

---

# **60\. REDIS / REALTIME STATE**

Sử dụng Redis hoặc tương đương cho:

live state

comment queue

response queue

audio queue

session state

locks

rate limiting

temporary memory

pub/sub

Không dùng database chính để xử lý mọi realtime event.

---

# **61\. GPU ARCHITECTURE**

Avatar/LipSync inference phải được tách thành:

GPU Worker

Không để frontend xử lý AI avatar nặng.

Kiến trúc:

Live Session  
→ GPU Job Queue  
→ Avatar Worker  
→ Frame Stream  
→ Encoder

Có thể scale:

GPU Worker 1  
GPU Worker 2  
GPU Worker 3  
...

---

# **62\. CONCURRENT LIVE**

Thiết kế để có thể mở rộng:

1 live

10 live

100 live

1000 live

Không hard-code:

one user \= one process.

Phải có:

worker pool

queue

session isolation

resource scheduler.

---

# **63\. COST CONTROL**

AI Live rất tốn tài nguyên.

Bắt buộc có:

GPU usage monitor

LLM token monitor

TTS usage

stream bandwidth

session cost

estimated cost/live

estimated cost/user

---

# **64\. PERFORMANCE MONITOR**

Theo dõi:

LLM latency

TTS latency

Avatar latency

LipSync latency

Render FPS

Dropped frames

Audio underrun

Network latency

Stream bitrate

Comment latency

End-to-end response latency

---

# **65\. QUALITY SCORE**

Sau mỗi response:

Tính:

response\_quality

lip\_sync\_quality

emotion\_quality

latency\_score

viewer\_engagement

story\_continuity

---

# **66\. ANALYTICS AI**

Sau livestream:

AI tự tạo report:

* Top topics  
* Top episodes  
* Top comments  
* Most engaged viewers  
* Best hook  
* Best CTA  
* Peak viewer moment  
* Peak comment moment  
* Average response latency  
* Conversion  
* Revenue  
* Recommended next topics

---

# **67\. SELF-IMPROVEMENT**

Không tự ý thay đổi system prompt production.

AI chỉ được tạo:

recommendations

Ví dụ:

"Episode 04 có engagement cao hơn 37%."

"Người xem phản hồi tốt với chuyện ma đô thị."

"CTA ở phút 18 có hiệu quả cao."

Admin quyết định có áp dụng hay không.

---

# **68\. SECURITY**

Không expose:

API keys

OAuth tokens

service credentials

LLM keys

TTS keys

platform credentials

trên frontend.

Tất cả secret:

SERVER SIDE ONLY.

OAuth token phải encrypted at rest.

---

# **69\. PLATFORM AUTHENTICATION**

Mỗi platform phải có:

connect account

OAuth

token refresh

disconnect

reconnect

permission status

capability detection

Không lưu access token dạng plaintext.

---

# **70\. FAILURE HANDLING**

Nếu:

LLM timeout

→ fallback response.

TTS timeout

→ fallback voice.

Avatar GPU unavailable

→ fallback visual.

Platform disconnected

→ reconnect.

Reconnect thất bại

→ mark platform OFFLINE.

Không crash toàn bộ live session.

---

# **71\. API DESIGN**

Tạo REST/WebSocket APIs.

Ví dụ:

POST /api/live/create

POST /api/live/start

POST /api/live/stop

GET /api/live/:id

POST /api/live/:id/pause

POST /api/live/:id/resume

POST /api/live/:id/takeover

POST /api/live/:id/return-ai

POST /api/topics/generate

GET /api/topics/:id

POST /api/episodes/generate

POST /api/comments/classify

GET /api/live/:id/comments

POST /api/avatar/create

POST /api/avatar/preview

GET /api/analytics/live/:id

---

# **72\. WEBSOCKET**

Frontend phải nhận realtime:

live\_state

comments

viewer\_count

current\_episode

ai\_response

avatar\_state

latency

platform\_status

errors

analytics

---

# **73\. UI/UX**

Thiết kế:

Premium

Modern

AI-first

Dark futuristic dashboard

Nhưng:

Không quá rối.

Ưu tiên:

LIVE PREVIEW

COMMENTS

CURRENT STORY

AI STATE

CONTROL

---

# **74\. LIVE PREVIEW**

Hiển thị avatar ở trung tâm.

Bên cạnh:

AI đang nói:

"Chào mọi người..."

Current emotion:

MYSTERIOUS

Current story:

Episode 07

Progress:

43%

Latency:

1.3s

FPS:

30

---

# **75\. TEST MODE**

Bắt buộc có:

SIMULATION MODE

Không cần livestream thật.

System giả lập:

comments

viewer joins

viewer leaves

gift

question

spam

high-priority question

interruption

AI response

Avatar

TTS

Mục tiêu:

Test toàn bộ hệ thống trước khi phát live.

---

# **76\. DEBUG MODE**

Có:

Event Timeline

Ví dụ:

08:32:11.200 comment.received

08:32:11.250 comment.classified

08:32:11.300 priority.updated

08:32:11.450 ai.response.started

08:32:12.020 tts.started

08:32:12.210 avatar.started

08:32:12.450 stream.output

Developer có thể nhìn thấy chính xác latency ở đâu.

---

# **77\. ACCEPTANCE TEST**

Module chỉ được xem là hoàn thành khi:

\[ \] Create avatar

\[ \] Upload image

\[ \] Generate avatar

\[ \] Configure personality

\[ \] Enter main topic

\[ \] AI detects topic

\[ \] Generate 20–50 subtopics

\[ \] Generate episodes

\[ \] Calculate word count

\[ \] Calculate duration

\[ \] Generate timeline

\[ \] Prevent duplicate content

\[ \] Start simulation

\[ \] Receive comments

\[ \] Classify comments

\[ \] Prioritize comments

\[ \] AI answers comments

\[ \] TTS starts quickly

\[ \] Avatar lip-syncs

\[ \] Avatar expresses emotion

\[ \] Story resumes after interruption

\[ \] Human takeover works

\[ \] AI resume works

\[ \] Stream engine works

\[ \] YouTube adapter works where authorized/supported

\[ \] TikTok adapter uses only currently authorized official capabilities

\[ \] Facebook adapter uses only currently authorized official capabilities

\[ \] Error recovery works

\[ \] Analytics works

\[ \] Session report works

---

# **78\. MVP DEVELOPMENT ORDER**

Không xây tất cả cùng lúc.

PHASE 1:

Topic Engine

* 

Episode Engine

* 

AI Brain

* 

TTS

* 

Basic Avatar

PHASE 2:

Realtime Comment

* 

Memory

* 

Interrupt

* 

Lip Sync

PHASE 3:

Stream Engine

* 

YouTube

* 

TikTok

* 

Facebook adapters

PHASE 4:

Gesture

* 

Emotion

* 

Sales Brain

* 

Analytics

PHASE 5:

GPU scaling

* 

Multi-live

* 

Cost optimization

* 

Production hardening

---

# **79\. QUAN TRỌNG: KHÔNG GIẢ LẬP TÍNH NĂNG**

Nếu API nền tảng không cung cấp capability:

KHÔNG được:

* giả API  
* fake response  
* bypass authentication  
* scrape trái phép  
* bypass restriction

Thay vào đó:

show:

CAPABILITY NOT AVAILABLE

và thiết kế adapter để có thể bổ sung sau.

---

# **80\. QUY TẮC CODE**

Code phải:

* modular  
* typed  
* documented  
* testable  
* observable  
* scalable  
* secure  
* fault tolerant

Không tạo:

giả API

giả realtime

fake streaming

fake lip sync

fake comments

nếu đang ở production mode.

Nếu cần demo:

phải có:

DEMO / SIMULATION MODE

tách biệt rõ với:

PRODUCTION MODE.

---

# **81\. OUTPUT KHI IMPLEMENT**

Trước khi code:

1. Analyze existing project.  
2. Detect framework.  
3. Detect current livestream architecture.  
4. Detect database.  
5. Detect authentication.  
6. Detect existing streaming engine.  
7. Detect existing avatar functionality.  
8. Detect existing API structure.

Sau đó tạo:

ARCHITECTURE.md

MODULES.md

DATABASE.md

API.md

EVENTS.md

AVATAR\_ENGINE.md

PLATFORM\_ADAPTERS.md

DEPLOYMENT.md

TESTING.md

ROADMAP.md

---

# **82\. KHÔNG PHÁ VỠ HỆ THỐNG CŨ**

Đây là yêu cầu bắt buộc.

Không rewrite toàn bộ application.

Không thay đổi module cũ nếu không cần thiết.

Tích hợp AI Livestream như:

NEW MODULE

và sử dụng interface/API hiện tại nếu có thể.

---

# **83\. FINAL PRODUCT VISION**

Sản phẩm cuối cùng phải cho phép người dùng:

Bước 1:

UPLOAD AVATAR

Bước 2:

CHỌN VOICE

Bước 3:

NHẬP TOPIC

Ví dụ:

"Kể chuyện ma"

Bước 4:

AI tự tạo:

50 chủ đề con

Bước 5:

AI tự tạo:

100–500 episodes

Bước 6:

Chọn:

30 phút LIVE

Bước 7:

START LIVE

Sau đó:

AI CHARACTER

→ kể chuyện

→ chuyển episode

→ đọc comment

→ hiểu comment

→ trả lời

→ cười

→ vui

→ sợ

→ bất ngờ

→ lip-sync

→ chuyển động

→ tiếp tục câu chuyện

→ CTA

→ tương tác

→ analytics

→ kết thúc live.

Tất cả phải hoạt động như:

# **MỘT NHÂN VẬT AI ĐANG THỰC SỰ LIVESTREAM.**

---

# **84\. DEFINITION OF DONE**

Không được tuyên bố:

"Module hoàn thành"

chỉ vì:

UI đã hiển thị.

Module chỉ được xem là hoàn thành khi:

AI có thể:

TOPIC  
→ SUBTOPICS  
→ EPISODES  
→ STORY  
→ TTS  
→ AVATAR  
→ LIP SYNC  
→ COMMENT  
→ UNDERSTAND  
→ RESPOND  
→ INTERRUPT  
→ RESUME  
→ STREAM  
→ ANALYTICS

trong một realtime pipeline thực tế.

Ưu tiên hàng đầu:

REALTIME

LOW LATENCY

NATURAL AVATAR

ACCURATE LIP SYNC

CONTENT CONTINUITY

COMMENT INTELLIGENCE

FAULT TOLERANCE

SCALABILITY

SECURITY

PRODUCTION READINESS.

