import re
with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                          <EventVoiceTester 
                            text={currentConfig.sampleAnswers || 'Xin chào và cảm ơn bạn đã tương tác cùng phiên livestream nhé!'}
                            defaultVoiceId={currentConfig.voiceId || "free_vi_female"}
                            onVoiceChange={(vid) => handleSimpleChange('voiceId', vid)}
                            label={`Nghe thử & Lưu Giọng đọc (${selectedEventInfo?.label || 'Sự kiện'})`}
                            compact={false}
                          />"""
replacement = """                          <EventVoiceTester 
                            text={currentConfig.sampleAnswers || 'Xin chào và cảm ơn bạn đã tương tác cùng phiên livestream nhé!'}
                            defaultVoiceId={currentConfig.voiceId || "free_vi_female"}
                            defaultSpeed={currentConfig.voiceRate !== undefined ? currentConfig.voiceRate : 1.0}
                            defaultVolume={currentConfig.voiceVolume !== undefined ? currentConfig.voiceVolume : 1.0}
                            onVoiceChange={(vid) => handleSimpleChange('voiceId', vid)}
                            onSpeedChange={(val) => handleSimpleChange('voiceRate', val)}
                            onVolumeChange={(val) => handleSimpleChange('voiceVolume', val)}
                            label={`Nghe thử & Lưu Giọng đọc (${selectedEventInfo?.label || 'Sự kiện'})`}
                            compact={false}
                          />"""

if target in content:
    content = content.replace(target, replacement)
    print("Patched generic EventVoiceTester!")
else:
    print("Generic target not found")

target2 = """                      <EventVoiceTester 
                        text={currentConfig.assistantPrompt || 'Dạ vâng, cảm ơn mọi người đã theo dõi live nha!'}
                        defaultVoiceId={currentConfig.assistantVoiceId || "free_vi_female"}
                        onVoiceChange={(vid) => handleSimpleChange('assistantVoiceId', vid)}
                        label={`Nghe thử câu Trợ lý (${selectedEventInfo?.label || 'Sự kiện'})`}
                        compact={false}
                      />"""
replacement2 = """                      <EventVoiceTester 
                        text={currentConfig.assistantPrompt || 'Dạ vâng, cảm ơn mọi người đã theo dõi live nha!'}
                        defaultVoiceId={currentConfig.assistantVoiceId || "free_vi_female"}
                        defaultSpeed={currentConfig.assistantVoiceRate !== undefined ? currentConfig.assistantVoiceRate : 1.0}
                        defaultVolume={currentConfig.assistantVoiceVolume !== undefined ? currentConfig.assistantVoiceVolume : 1.0}
                        onVoiceChange={(vid) => handleSimpleChange('assistantVoiceId', vid)}
                        onSpeedChange={(val) => handleSimpleChange('assistantVoiceRate', val)}
                        onVolumeChange={(val) => handleSimpleChange('assistantVoiceVolume', val)}
                        label={`Nghe thử câu Trợ lý (${selectedEventInfo?.label || 'Sự kiện'})`}
                        compact={false}
                      />"""

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Patched assistant EventVoiceTester!")
else:
    print("Assistant target not found")

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
