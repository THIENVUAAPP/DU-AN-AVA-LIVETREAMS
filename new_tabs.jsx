            {/* Navigation Tabs */}
            <div className={`flex border-b p-1 gap-1 text-[11px] font-semibold ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setSimTab('video_live')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'video_live' ? 'bg-blue-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Video size={12} /> Live Video
              </button>
              <button
                onClick={() => setSimTab('ai_idol')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'ai_idol' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Sparkles size={12} /> AI Idol
              </button>
              <button
                onClick={() => setSimTab('checkout')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'checkout' ? 'bg-emerald-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <ShoppingCart size={12} /> Chốt Đơn
              </button>
              <button
                onClick={() => setSimTab('ai_assistant')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'ai_assistant' ? 'bg-red-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Brain size={12} /> Chuyên AI
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-3 space-y-3 overflow-y-auto max-h-[420px]">
              
              {/* TAB 1: LIVE VIDEO (Trả lời bình luận, Chào người mới, Cảm ơn tặng quà) */}
              {simTab === 'video_live' && (
                <div className="space-y-3">
                  {/* Bình luận */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <MessageCircle size={11} className="text-blue-500" /> Bình luận cơ bản:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button onClick={() => handleLiveEvent('COMMENT', { name: 'Khán Giả 1', text: 'Chào idol, hôm nay xinh quá!' })} className={`text-left p-1.5 rounded-lg text-[10px] font-medium transition-all flex justify-between border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}>
                        <span>💬 "Chào idol, hôm nay xinh quá!"</span>
                      </button>
                      <button onClick={() => handleLiveEvent('COMMENT', { name: 'Khán Giả 2', text: 'Live mượt quá shop ơi!' })} className={`text-left p-1.5 rounded-lg text-[10px] font-medium transition-all flex justify-between border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}>
                        <span>💬 "Live mượt quá shop ơi!"</span>
                      </button>
                    </div>
                  </div>

                  {/* Chào hỏi */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Users size={11} className="text-emerald-500" /> Chào hỏi người mới:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Khách Mới 1' })} className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all text-center border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                        👋 Khách mới vào
                      </button>
                      <button onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Fan Cứng 👑' })} className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all text-center border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                        ⭐ Fan Cứng vào
                      </button>
                    </div>
                  </div>

                  {/* Tặng quà */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Gift size={11} className="text-amber-500" /> Cảm ơn Tặng quà:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Người Hâm Mộ', gift: 'Hoa Hồng', count: 1 })} className={`py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-medium transition-all text-center`}>
                        🌹 Hoa Hồng (1 xu)
                      </button>
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Đại Gia', gift: 'Thiết Giáp', count: 50 })} className={`py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-lg text-[10px] font-medium transition-all text-center`}>
                        🛡️ Thiết Giáp (50 xu)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AI IDOL (Tất cả sự kiện tương tác chuẩn) */}
              {simTab === 'ai_idol' && (
                <div className="space-y-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Users size={11} className="text-purple-500" /> Khán giả vào phòng:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Thanh Nhàn' })} className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'}`}>👋 Khách mới</button>
                      <button onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Vip_HoàngNam 👑' })} className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}>⭐ VIP vào</button>
                      <button onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Bảo Trâm ❤️' })} className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-pink-500/10 hover:bg-pink-500/25 text-pink-300 border-pink-500/30' : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'}`}>❤️ Fan cứng</button>
                      <button onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Chủ Tịch Tổng 💎' })} className={`py-1.5 px-2 rounded-lg text-[10.5px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border-amber-500/30' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'}`}>💎 Đại gia</button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Gift size={11} className="text-amber-500" /> Tặng quà TikTok (Tất cả các mức xu):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Anh Tuấn', gift: 'Hoa Hồng', count: 1 })} className={`py-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}>🌹 Hoa Hồng (1 xu)</button>
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Hoàng Long VIP', gift: 'Nước Hoa Thiết Giáp', count: 50 })} className={`py-1.5 bg-purple-500/10 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}>🛡️ Thiết Giáp (50)</button>
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Đại Gia Phố Núi', gift: 'Vương Miện Hoàng Kim', count: 200 })} className={`py-1.5 bg-yellow-500/10 hover:bg-yellow-500/25 text-yellow-500 border border-yellow-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}>👑 Thần Tướng (200)</button>
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Thần Kiếm', gift: 'Kiếm Sấm Sét', count: 500 })} className={`py-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}>⚔️ Vạn Kiếm (500)</button>
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Chủ Tịch Tập Đoàn', gift: 'Thần Long Vũ Trụ', count: 1000 })} className={`py-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg text-[10px] font-bold transition-all text-center truncate`}>🐉 Giáng Long (1000)</button>
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Tổng Giám Đốc', gift: 'Sư Tử Vàng Vũ Trụ', count: 10000 })} className={`py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-yellow-300 border border-yellow-400/50 rounded-lg text-[10px] font-black transition-all text-center truncate shadow-sm`}>🦁 Sư Tử (10k xu)</button>
                      <button onClick={() => handleLiveEvent('GIFT', { name: 'Đại Tướng Quân', gift: 'Mũ Trụ TikTok Universe', count: 30000 })} className={`col-span-2 py-1.5 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-amber-600/30 hover:opacity-90 text-pink-300 border border-pink-400/60 rounded-lg text-[10px] font-black transition-all text-center truncate shadow-md animate-pulse`}>🚀 Mũ Trụ Siêu Cấp (30k)</button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Heart size={11} className="text-red-500" /> Tương tác kênh & Cột mốc Tim:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      <button onClick={() => handleLiveEvent('LIKE', { count: '10.000 tim' })} className="py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate">💖 10k Tim</button>
                      <button onClick={() => handleLiveEvent('LIKE', { count: '50.000 tim' })} className="py-1.5 bg-pink-500/10 hover:bg-pink-500/25 text-pink-400 border border-pink-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate">💖 50k Tim</button>
                      <button onClick={() => handleLiveEvent('FOLLOW', { name: 'Khánh Vy' })} className="py-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate">➕ Follow Kênh</button>
                      <button onClick={() => handleLiveEvent('SHARE', { name: 'Minh Trang' })} className="py-1.5 bg-violet-500/10 hover:bg-violet-500/25 text-violet-500 border border-violet-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate">↗️ Chia Sẻ Live</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CHỐT ĐƠN */}
              {simTab === 'checkout' && (
                <div className="space-y-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Các bình luận hỏi mua hàng:</span>
                    <div className="space-y-1.5">
                      <button onClick={() => handleLiveEvent('COMMENT', { name: 'Hải Đăng', text: 'Mẫu này chất liệu gì và còn size L không shop?' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}>
                        <span>🛒 "Mẫu này chất liệu gì và còn size L không shop?"</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-blue-500/20 text-white' : 'bg-blue-200 text-blue-900'}`}>Hỏi Size</span>
                      </button>
                      <button onClick={() => handleLiveEvent('COMMENT', { name: 'Quỳnh Như', text: 'Sản phẩm này giá bao nhiêu và có freeship không ạ?' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'}`}>
                        <span>💰 "Giá bao nhiêu và có freeship không ạ?"</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-amber-500/20 text-white' : 'bg-amber-200 text-amber-900'}`}>Hỏi Giá</span>
                      </button>
                      <button onClick={() => handleLiveEvent('COMMENT', { name: 'Bảo Long', text: 'Mình 1m70 nặng 65kg mặc size nào vừa chuẩn bạn ơi?' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}>
                        <span>📏 "Mình 1m70 nặng 65kg mặc size nào chuẩn?"</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/20 text-white' : 'bg-purple-200 text-purple-900'}`}>Tư Vấn</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 mt-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Sự kiện khách đã chốt đơn:</span>
                    <div className="space-y-1.5">
                      <button onClick={() => handleLiveEvent('PURCHASE', { name: 'Hoàng Nam', item: '1 Áo Polo Cao Cấp' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                        <span>🎉 Khách Hoàng Nam vừa chốt 1 Áo Polo</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-emerald-500/30 text-white' : 'bg-emerald-200 text-emerald-900'}`}>1 Đơn</span>
                      </button>
                      <button onClick={() => handleLiveEvent('PURCHASE', { name: 'Thanh Thảo VIP', item: 'Combo 2 Váy Thiết Kế Dạ Hội' })} className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}>
                        <span>🎁 Khách Thanh Thảo vừa chốt Combo 2 Váy</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/30 text-white' : 'bg-purple-200 text-purple-900'}`}>Combo VIP</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CHUYÊN AI & VOICE */}
              {simTab === 'ai_assistant' && (
                <div className="space-y-3">
                  {/* Trợ lý & Đạo diễn */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Bộ não AI & Trợ lý Đạo Diễn:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Nói một câu chào mừng hài hước để hâm nóng không khí!' })} className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/20' : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'}`}>
                        🔥 Hâm nóng không khí
                      </button>
                      <button onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Nhắc mọi người bấm vào giỏ hàng đang có mã giảm giá!' })} className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}>
                        🛒 Nhắc xem giỏ hàng
                      </button>
                      <button onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Hãy kể một câu chuyện vui ngắn 10 giây' })} className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}>
                        🎶 Kể chuyện vui
                      </button>
                      <button onClick={() => handleLiveEvent('CALL_TO_ACTION', { prompt: 'Kêu gọi thả tim để mở khóa quà tặng!' })} className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}>
                        🙏 Kêu gọi thả tim
                      </button>
                    </div>

                    <div className={`mt-2 flex gap-1.5`}>
                      <input 
                        type="text" value={assistantPrompt} onChange={(e) => setAssistantPrompt(e.target.value)}
                        placeholder="VD: Nhắc idol giới thiệu..."
                        className={`flex-1 rounded-lg px-2 py-1 text-xs outline-none border ${isDarkMode ? 'bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500'}`}
                        onKeyDown={(e) => { if (e.key === 'Enter' && assistantPrompt.trim()) { handleLiveEvent('ASSISTANT_PROMPT', { prompt: assistantPrompt.trim() }); setAssistantPrompt(''); } }}
                      />
                      <button onClick={() => { if (assistantPrompt.trim()) { handleLiveEvent('ASSISTANT_PROMPT', { prompt: assistantPrompt.trim() }); setAssistantPrompt(''); } }} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                        <Send size={11} /> Gửi
                      </button>
                    </div>
                  </div>

                  {/* Lựa chọn Voice ưa dùng */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 mt-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Volume2 size={11} className="text-cyan-500" /> Chọn nhanh Voice Ưa Dùng:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button onClick={() => handleAudioTest('idol')} className={`p-1.5 rounded-lg text-[11px] font-medium text-left border flex items-center justify-between ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}>
                        <span className="flex items-center gap-1.5">🎤 Voice Idol (Bình luận & Chốt đơn)</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-blue-500/20 text-white' : 'bg-blue-200 text-blue-900'}`}>Test</span>
                      </button>
                      <button onClick={() => handleAudioTest('manager')} className={`p-1.5 rounded-lg text-[11px] font-medium text-left border flex items-center justify-between ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200'}`}>
                        <span className="flex items-center gap-1.5">💬 Voice Trợ Lý AI</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-red-500/20 text-white' : 'bg-red-200 text-red-900'}`}>Test</span>
                      </button>
                      <button onClick={() => handleAudioTest('game')} className={`p-1.5 rounded-lg text-[11px] font-medium text-left border flex items-center justify-between ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}>
                        <span className="flex items-center gap-1.5">🎮 Voice Đạo Diễn / Game</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/20 text-white' : 'bg-purple-200 text-purple-900'}`}>Test</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status processing indicator */}
              {isProcessingEvent && (
                <div className="flex items-center justify-center gap-2 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-500 text-[11px] font-semibold animate-pulse">
                  <Sparkles size={12} className="text-purple-500 animate-spin" /> AI đang suy nghĩ & chuẩn bị phản hồi...
                </div>
              )}
            </div>
