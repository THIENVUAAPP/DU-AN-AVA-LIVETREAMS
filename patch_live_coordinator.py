import re

with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the logic for Step 3 and 4 in useLiveCoordinator.js
old_fallback_logic = """          // 💬 BƯỚC 4: CÂU HỎI / PHẢN HỒI CHĂM SÓC KHÁCH HÀNG (CUSTOMER CARE)
          // ⚠️ CHỈ DÙNG KHI BÌNH LUẬN KHÔNG LIÊN QUAN ĐẾN TỪ KHÓA VÀ NGOÀI PHẠM VI BỘ NÃO AI
          if (!isHandled) {
            if (commentConfig.useUnknownFallbackReply !== false) {
              const fbTpl = commentConfig.unknownFallbackReply || 'Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để shop chăm sóc và phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!';
              bodyAnswer = fillTemplate(fbTpl, { user: userName, comment: commentText });
              isHandled = true;
            } else if (commentConfig.sampleAnswers) {
              const rawSample = getRandomSample(commentConfig.sampleAnswers);
              bodyAnswer = fillTemplate(rawSample, { user: userName, comment: commentText });
              isHandled = true;
            } else {
              bodyAnswer = `Dạ em cảm ơn câu hỏi của bạn ${userName} nha! Shop đã ghi nhận câu hỏi và hỗ trợ mình ngay ạ!`;
              isHandled = true;
            }
          }
        }

        // BƯỚC 5: HẬU TỐ CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG & CẢM ƠN
        // ⚠️ QUY TẮC QUAN TRỌNG: Chỉ ghép thêm câu chăm sóc khách hàng khi người dùng hỏi KHÔNG liên quan đến từ khóa!
        // Khi đã khớp đúng từ khóa, trả lời trực tiếp nội dung từ khóa mà không ghép thêm câu chăm sóc khách hàng.
        let followUpPart = '';
        if (!isKeywordMatched && commentConfig.appendFollowUpQuestion !== false) {
          const tpl = commentConfig.followUpQuestionText || ' Dạ không biết bạn {user} có cần em hỗ trợ thêm điều gì nữa không ạ? Bạn có thể nhắn tin trực tiếp cho shop để nhận tư vấn chi tiết và nhiều ưu đãi nha!';
          followUpPart = fillTemplate(tpl, { user: userName, comment: commentText });
        }

        // GHÉP TOÀN BỘ CÂU THOẠI HOÀN CHỈNH
        replyText = `${repeatPrefix} ${bodyAnswer} ${followUpPart}`.replace(/\s+/g, ' ').trim();"""

new_fallback_logic = """          // 💬 BƯỚC 3: CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG
          // Gọi khi AI không trả lời được
          if (!isHandled) {
            if (commentConfig.appendFollowUpQuestion !== false) {
              const tpl = commentConfig.followUpQuestionText || ' Dạ không biết bạn {user} có cần em hỗ trợ thêm điều gì nữa không ạ? Bạn có thể nhắn tin trực tiếp cho shop để nhận tư vấn chi tiết và nhiều ưu đãi nha!';
              bodyAnswer = fillTemplate(tpl, { user: userName, comment: commentText });
              isHandled = true;
            }
          }

          // 💬 BƯỚC 4: XỬ LÝ KHI AI KHÔNG BIẾT / KHÔNG HIỂU CÂU HỎI (FALLBACK KHÉO LÉO)
          // Gọi khi Bước 3 tắt hoặc thất bại
          if (!isHandled) {
            if (commentConfig.useUnknownFallbackReply !== false) {
              const fbTpl = commentConfig.unknownFallbackReply || 'Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để shop chăm sóc và phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!';
              bodyAnswer = fillTemplate(fbTpl, { user: userName, comment: commentText });
              isHandled = true;
            } else if (commentConfig.sampleAnswers) {
              const rawSample = getRandomSample(commentConfig.sampleAnswers);
              bodyAnswer = fillTemplate(rawSample, { user: userName, comment: commentText });
              isHandled = true;
            } else {
              bodyAnswer = `Dạ em cảm ơn câu hỏi của bạn ${userName} nha! Shop đã ghi nhận câu hỏi và hỗ trợ mình ngay ạ!`;
              isHandled = true;
            }
          }
        }

        // GHÉP TOÀN BỘ CÂU THOẠI HOÀN CHỈNH
        replyText = `${repeatPrefix} ${bodyAnswer}`.replace(/\s+/g, ' ').trim();"""

if old_fallback_logic in content:
    content = content.replace(old_fallback_logic, new_fallback_logic)
    print("Logic replaced successfully!")
else:
    print("WARNING: old_fallback_logic not found!")

# 2. Add setTimeout for Voice
old_voice_trigger = """        if (shouldSpeakVoice && onVoiceReply) {
          let rawVol = currentEvConfig.voiceVolume !== undefined ? Number(currentEvConfig.voiceVolume) : (currentEvConfig.volume !== undefined ? Number(currentEvConfig.volume) : (effectiveVoice.volume ?? 1.0));
          // Chuẩn hóa: nếu giá trị > 1 thì coi là phần trăm (0-100) -> chuyển về 0.0-1.0
          const effectiveVolume = (rawVol > 1 && rawVol <= 100) ? rawVol / 100 : Math.max(0, Math.min(1.0, rawVol));
          const effectiveRate = currentEvConfig.voiceRate !== undefined ? Number(currentEvConfig.voiceRate) : (effectiveVoice.rate ?? 1.0);
          const finalVoiceObj = {
            ...effectiveVoice,
            volume: effectiveVolume,
            rate: effectiveRate
          };
          onVoiceReply({
            text: replyText,
            action: shouldAction,
            baseVideoItem: matchedEventVideo || activeVideoItem,
            preRecordedCat: matchedEventVideo ? matchedEventVideo.category : (shouldAction === 'gift_reaction' ? 'reaction' : null),
            voiceId: effectiveVoice.id,
            voiceObj: finalVoiceObj,
            voiceChannel: targetVoiceRole,
            volume: effectiveVolume,
            isTest: isTestMode
          });
        }"""

new_voice_trigger = """        if (shouldSpeakVoice && onVoiceReply) {
          let rawVol = currentEvConfig.voiceVolume !== undefined ? Number(currentEvConfig.voiceVolume) : (currentEvConfig.volume !== undefined ? Number(currentEvConfig.volume) : (effectiveVoice.volume ?? 1.0));
          const effectiveVolume = (rawVol > 1 && rawVol <= 100) ? rawVol / 100 : Math.max(0, Math.min(1.0, rawVol));
          const effectiveRate = currentEvConfig.voiceRate !== undefined ? Number(currentEvConfig.voiceRate) : (effectiveVoice.rate ?? 1.0);
          const finalVoiceObj = {
            ...effectiveVoice,
            volume: effectiveVolume,
            rate: effectiveRate
          };
          
          // LƯU Ý QUAN TRỌNG: Gửi chat text lên trước, sau đó chờ 800ms mới phát voice để đúng trình tự Text trước -> Voice sau
          setTimeout(() => {
            onVoiceReply({
              text: replyText,
              action: shouldAction,
              baseVideoItem: matchedEventVideo || activeVideoItem,
              preRecordedCat: matchedEventVideo ? matchedEventVideo.category : (shouldAction === 'gift_reaction' ? 'reaction' : null),
              voiceId: effectiveVoice.id,
              voiceObj: finalVoiceObj,
              voiceChannel: targetVoiceRole,
              volume: effectiveVolume,
              isTest: isTestMode
            });
          }, 800);
        }"""

if old_voice_trigger in content:
    content = content.replace(old_voice_trigger, new_voice_trigger)
    print("Voice trigger replaced successfully!")
else:
    print("WARNING: old_voice_trigger not found!")

with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
    f.write(content)
