import re

with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace matched keyword logic
old_kw = """                if (matched && rule.replyText) {
                  bodyAnswer = fillTemplate(rule.replyText, { user: userName, comment: commentText });
                  isHandled = true;
                  isKeywordMatched = true;
                  break;
                }"""

new_kw = """                if (matched && rule.replyText) {
                  bodyAnswer = fillTemplate(rule.replyText, { user: userName, comment: commentText });
                  isHandled = true;
                  isKeywordMatched = true;
                  // LƯU LẠI ROLE GIỌNG ĐỌC CỦA RULE NÀY ĐỂ GHI ĐÈ LÊN GLOBAL VOICE
                  if (rule.role || rule.voiceId) {
                    currentEvConfig._matchedRuleRole = rule.role;
                    currentEvConfig._matchedRuleVoiceId = rule.voiceId;
                  }
                  break;
                }"""

content = content.replace(old_kw, new_kw)

# Replace targetVoiceRole logic
old_voice = """      const targetVoiceRole = isTestMode ? 'idol' : (currentEvConfig.ttsVoiceRole || currentEvConfig.speaker || (evKey === 'comment' ? 'comment' : evKey === 'checkout' ? 'manager' : 'idol'));
      const effectiveVoice = resolveEffectiveVoice(targetVoiceRole, isTestMode ? null : (currentEvConfig.voiceId || currentEvConfig.voiceObj?.id), currentEvConfig.avatarId, { isLiveEvent: true, eventKey: evKey });"""

new_voice = """      const targetVoiceRole = isTestMode ? 'idol' : (currentEvConfig._matchedRuleRole || currentEvConfig.ttsVoiceRole || currentEvConfig.speaker || (evKey === 'comment' ? 'comment' : evKey === 'checkout' ? 'manager' : 'idol'));
      const voiceTargetId = currentEvConfig._matchedRuleVoiceId || currentEvConfig.voiceId || currentEvConfig.voiceObj?.id;
      const effectiveVoice = resolveEffectiveVoice(targetVoiceRole, isTestMode ? null : voiceTargetId, currentEvConfig.avatarId, { isLiveEvent: true, eventKey: evKey });"""

content = content.replace(old_voice, new_voice)

with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
    f.write(content)
