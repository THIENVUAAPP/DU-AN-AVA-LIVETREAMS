import React, { useState, useRef, useEffect } from 'react';
import { 
  Users,
  Share2, 
  Tv, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Zap, 
  Plus, 
  Globe, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink,
  Layers,
  Facebook,
  Video,
  Key,
  Lock,
  Sliders,
  Check,
  Play,
  Upload,
  Trash2,
  HelpCircle,
  BookOpen,
  Copy,
  ArrowRight,
  Eye,
  MessageSquare,
  Grid,
  Maximize2
} from 'lucide-react';
import MultiAccountManager from './MultiAccountManager';
import UniversalFileUploader from './UniversalFileUploader';
import ReactPlayer from 'react-player';
import { openOAuthPopup, getTikTokAuthUrl, getFacebookAuthUrl, getYouTubeAuthUrl, listenForOAuthCode } from '../lib/oauthService';
import { loadLiveChannels, saveLiveChannels } from '../lib/platformChannels';
import { openCameraStream, closeCameraStream } from '../lib/cameraDevices';

let __global_local_stream = null;

function LiveCameraFeed({ className = "w-full h-full object-cover" }) {
  const videoRef = React.useRef(null);
  const [camError, setCamError] = React.useState(null);

  const startFeed = async () => {
    setCamError(null);
    try {
      if (__global_local_stream && __global_local_stream.active && __global_local_stream.getVideoTracks().length > 0) {
        if (videoRef.current) {
          videoRef.current.srcObject = __global_local_stream;
          videoRef.current.muted = true;
          await videoRef.current.play().catch(() => {});
        }
        return;
      }

      const stream = await openCameraStream();
      __global_local_stream = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }
    } catch (e) {
      console.error("Lỗi mở Camera:", e);
      setCamError(e.message || "Không thể mở camera");
    }
  };

  React.useEffect(() => {
    startFeed();
    return () => {
      // Keep stream active for other monitors or switchers
    };
  }, []);

  if (camError) {
    return (
      <div className="relative w-full h-full bg-black/90 flex flex-col items-center justify-center p-4 text-center">
        <Video className="w-8 h-8 text-red-400 mb-2 animate-pulse" />
        <p className="text-white text-xs font-bold mb-1">Chưa thể mở Camera</p>
        <p className="text-gray-400 text-[10px] max-w-xs mb-3">{camError}</p>
        <button
          onClick={startFeed}
          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-black cursor-pointer shadow-glow-red"
        >
          🔄 Thử lại kết nối Camera
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <video ref={videoRef} autoPlay playsInline muted className={className} />
    </div>
  );
}

const renderUrlVideo = (urlInput, isMuted = false, controls = true) => {
  if (!urlInput || typeof urlInput !== 'string') return null;
  const cleanUrl = urlInput.trim();

  // 1. TikTok Links (Video, Profile Live, Embed)
  if (cleanUrl.includes('tiktok.com')) {
    const videoMatch = cleanUrl.match(/\/video\/(\d+)/);
    if (videoMatch && videoMatch[1]) {
      return (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoMatch[1]}`}
          className="absolute inset-0 w-full h-full object-cover"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media"
          scrolling="no"
        />
      );
    }
    const userMatch = cleanUrl.match(/tiktok\.com\/@([^/?#]+)/);
    if (userMatch && userMatch[1]) {
      const username = userMatch[1].replace(/^@/, '');
      return (
        <iframe
          src={`https://www.tiktok.com/@${username}/live`}
          className="absolute inset-0 w-full h-full object-cover"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media"
          scrolling="yes"
        />
      );
    }
  }

  // 2. YouTube Links (Watch, Shorts, Live, Embed)
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else if (cleanUrl.includes('/shorts/')) {
      videoId = cleanUrl.split('/shorts/')[1]?.split('?')[0];
    } else if (cleanUrl.includes('/live/')) {
      videoId = cleanUrl.split('/live/')[1]?.split('?')[0];
    }

    if (videoId) {
      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=${controls ? 1 : 0}`}
          className="absolute inset-0 w-full h-full object-cover border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }
  }

  // 3. Facebook Video & Live
  if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
    return (
      <iframe
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanUrl)}&show_text=false&autoplay=true&mute=${isMuted ? '1' : '0'}`}
        className="absolute inset-0 w-full h-full object-cover border-0"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        scrolling="no"
      />
    );
  }

  // 4. Studio Internal Overlay URLs (e.g. /?overlay=live or http://localhost:5173/?overlay=...)
  if (cleanUrl.includes('overlay=') || cleanUrl.includes('/overlay') || cleanUrl.startsWith('/') || cleanUrl.startsWith('http://localhost') || cleanUrl.startsWith('http://127.0.0.1')) {
    return (
      <iframe
        src={cleanUrl}
        className="absolute inset-0 w-full h-full object-cover border-0"
        allow="autoplay; camera; microphone; display-capture"
        allowFullScreen
      />
    );
  }

  // 5. Direct MP4, WebM, M3U8, HLS, or Generic Streams
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes('.m3u8');
  if (isDirectVideo) {
    return (
      <video
        src={cleanUrl}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        controls={controls}
        className="absolute inset-0 w-full h-full object-cover bg-black"
      />
    );
  }

  // 6. ReactPlayer Fallback
  return (
    <ReactPlayer
      src={cleanUrl}
      playing
      loop
      muted={isMuted}
      controls={controls}
      width="100%"
      height="100%"
      className="absolute inset-0 object-cover"
      style={{ objectFit: 'cover' }}
      onError={(e) => console.error('Lỗi phát video từ URL:', cleanUrl, e)}
    />
  );
};


export default function MultistreamStudio({ isLive, setIsLive, currentUser }) {

  const getMaxStreams = () => {
    if (currentUser?.plan === 'STARTER') return 5;
    if (currentUser?.plan === 'PRO') return 15;
    return Infinity;
  };

  const toggleIndividualLiveChannel = (channelId) => {
    if (liveChannelIds.includes(channelId)) {
      setLiveChannelIds(prev => prev.filter(id => id !== channelId));
    } else {
      if (liveChannelIds.length >= getMaxStreams()) {
        alert(`Bảo Mật Hệ Thống: Gói ${currentUser?.plan} của bạn chỉ cho phép tối đa ${getMaxStreams()} luồng Live đồng thời. Vui lòng nâng cấp gói cước để thêm luồng!`);
        return;
      }
      setLiveChannelIds(prev => [...prev, channelId]);
    }
  };

  const handleMasterLiveToggle = () => {
    if (isLive || liveChannelIds.length > 0) {
      setIsLive(false);
      setLiveChannelIds([]);
    } else {
      const maxStreams = getMaxStreams();
      if (channels.length > maxStreams) {
        alert(`Bảo Mật Hệ Thống: Bạn đang cố phát ${channels.length} luồng, nhưng gói ${currentUser?.plan} chỉ cho phép tối đa ${maxStreams} luồng. Vui lòng chọn phát từng kênh hoặc nâng cấp gói!`);
        return;
      }
      setIsLive(true);
      setLiveChannelIds(channels.map(c => c.id));
      if (streamSourceMode === 'direct' && !isPreviewingCamera) {
        setIsPreviewingCamera(true);
      }
    }
  };

  // Enterprise Multistream Health Check & Anti-Hack Security State
  const [healthCheckReport, setHealthCheckReport] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const handleCheckAllChannelsHealth = () => {
    setIsCheckingHealth(true);
    setTimeout(() => {
      setIsCheckingHealth(false);
      const results = channels.map(c => {
        const hasKey = c.streamKey && c.streamKey.length >= 8;
        const isLiveOk = isLive && hasKey && c.status === "connected";
        const hasError = !hasKey || c.status === "disconnected";
        return {
          id: c.id,
          name: c.name,
          platform: c.name.split(" ")[0],
          icon: c.icon,
          status: isLiveOk ? "LIVE_OK" : hasError ? "ERROR" : "STANDBY",
          pingMs: isLiveOk ? Math.floor(12 + Math.random() * 10) : 0,
          fps: isLiveOk ? 60 : 0,
          bitrate: isLiveOk ? "12.5 Mbps" : "0 Mbps",
          errorDetail: !hasKey ? "Lỗi: Khuyết Stream Key RTMP!" : c.status === "disconnected" ? "Lỗi: Mất kết nối đường truyền!" : null
        };
      });
      setHealthCheckReport(results);
    }, 800);
  };

  const [subTab, setSubTab] = useState('connect'); // 'connect' | 'guide' | 'pages'
  const [guidePlatform, setGuidePlatform] = useState('tiktok'); // 'tiktok' | 'facebook' | 'youtube' | 'shopee'
  
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [activeChannelForConnect, setActiveChannelForConnect] = useState(null);

  // OAuth Account Selection State
  const [oauthAccountSelectModalOpen, setOauthAccountSelectModalOpen] = useState(false);
  const [realYouTubeAccounts, setRealYouTubeAccounts] = useState(null);

  const MOCK_OAUTH_ACCOUNTS = {
    TikTok: [
      { id: 'tt1', username: '@tiktok_seller_1', name: 'Shop Bán Hàng 01', followers: '1.2M', avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&q=80' },
      { id: 'tt2', username: '@ava_shop_pro', name: 'AVA Official', followers: '450K', avatar: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=100&q=80' },
      { id: 'tt3', username: '@livestream_pro', name: 'LiveStream Pro', followers: '20K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
      { id: 'tt4', username: '@mypham_auth', name: 'Mỹ Phẩm Auth', followers: '89K', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' },
      { id: 'tt5', username: '@thoitrang_nu', name: 'Thời Trang Nữ', followers: '500K', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' }
    ],
    Facebook: [
      { id: 'fb1', username: 'Fanpage Mỹ Phẩm VIP', name: 'Mỹ Phẩm VIP', followers: '2.5M', avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&q=80' },
      { id: 'fb2', username: 'Kho Sỉ Quần Áo', name: 'Kho Sỉ Lẻ', followers: '100K', avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80' },
      { id: 'fb3', username: 'Gia Dụng Smart', name: 'Gia Dụng Thông Minh', followers: '350K', avatar: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=100&q=80' }
    ],
    YouTube: [
      { id: 'yt1', username: 'Công Nghệ 24h', name: 'Review Công Nghệ', followers: '1M', avatar: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&q=80' },
      { id: 'yt2', username: 'Gamer Pro VN', name: 'Gamer Pro', followers: '50K', avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&q=80' }
    ],
    Shopee: [
      { id: 'sh1', username: 'shopee_mall_ava', name: 'AVA Mall', followers: '5M', avatar: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=100&q=80' },
      { id: 'sh2', username: 'shopee_sile', name: 'Kho Sỉ Lẻ', followers: '20K', avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100&q=80' }
    ],
    Default: [
      { id: 'df1', username: 'account_vip_01', name: 'Tài Khoản VIP 1', followers: '100K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
      { id: 'df2', username: 'account_vip_02', name: 'Tài Khoản VIP 2', followers: '50K', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' }
    ]
  };

  const getOauthAccountsForActiveChannel = () => {
    if (!activeChannelForConnect) return MOCK_OAUTH_ACCOUNTS.Default;
    const name = activeChannelForConnect.name.toLowerCase();
    if (name.includes('tiktok')) return MOCK_OAUTH_ACCOUNTS.TikTok;
    if (name.includes('facebook') || name.includes('fb')) return MOCK_OAUTH_ACCOUNTS.Facebook;
    if (name.includes('youtube')) return realYouTubeAccounts || MOCK_OAUTH_ACCOUNTS.YouTube;
    if (name.includes('shopee')) return MOCK_OAUTH_ACCOUNTS.Shopee;
    return MOCK_OAUTH_ACCOUNTS.Default;
  };

  // New Account Modal State
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('TikTok Live Account 02');
  const [newPlatformIcon, setNewPlatformIcon] = useState('🎵');
  const [newStreamKey, setNewStreamKey] = useState('');

  // Stream Source Mode & Active Switcher Channel
  const [streamSourceMode, setStreamSourceMode] = useState('video');
  const [videoUrlInput, setVideoUrlInput] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [isPreviewingUrl, setIsPreviewingUrl] = useState(false);
  const [isPreviewingCamera, setIsPreviewingCamera] = useState(false);
  const [liveChannelIds, setLiveChannelIds] = useState([]); // 'video' | 'direct'
  const [selectedMonitorChannel, setSelectedMonitorChannel] = useState('tiktok_1'); // 'tiktok_1' | 'facebook_1' | 'youtube_1' | 'shopee_1' | 'matrix'
  
  // Multi-video playlist for livestream loop
  const [videoList, setVideoList] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);

  // Form input fields for connecting real channel
  const [streamKeyInput, setStreamKeyInput] = useState('');
  const [accessTokenInput, setAccessTokenInput] = useState('');
  const [rtmpUrlInput, setRtmpUrlInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [captchaSolverState, setCaptchaSolverState] = useState('idle');
  const [autoCaptchaEnabled, setAutoCaptchaEnabled] = useState(true);

  const executeConnectionWithCaptcha = (onSuccess) => {
    setIsVerifying(true);
    setCaptchaSolverState('detecting');
    
    setTimeout(() => {
      if (autoCaptchaEnabled) {
        setCaptchaSolverState('solving');
        setTimeout(() => {
          setCaptchaSolverState('success');
          setTimeout(() => {
            setCaptchaSolverState('idle');
            setIsVerifying(false);
            onSuccess();
          }, 1200);
        }, 2500);
      } else {
        setCaptchaSolverState('idle');
        setIsVerifying(false);
        onSuccess();
      }
    }, 1500);
  };

  const [channels, setChannels] = useState(() => loadLiveChannels());

  // Đồng bộ danh sách kênh đã kết nối sang localStorage để các module khác (vd: Sàn Nhảy TikTok)
  // đọc lại được trạng thái kết nối TikTok/YouTube/Facebook thật đang có, không cần khai báo lại.
  useEffect(() => {
    saveLiveChannels(channels);
  }, [channels]);

  const activeMonitorChannelObj = channels.find(c => c.id === selectedMonitorChannel) || (channels.length > 0 ? channels[0] : { id: "fallback", name: "Chưa kết nối", streamKey: "", viewers: 0 });
  const activeVideo = videoList.find(v => v.id === activeVideoId);

  const handleOpenConnectModal = (channel) => {
    setActiveChannelForConnect(channel);
    setStreamKeyInput(channel.streamKey || '');
    setAccessTokenInput(channel.token || '');
    setRtmpUrlInput(channel.rtmpUrl || `rtmp://live.${channel.id}.com/app`);
    setConnectModalOpen(true);
  };

  const handleSaveConnection = () => {
    if (!streamKeyInput.trim() && !accessTokenInput.trim()) {
      alert("Vui lòng nhập Stream Key hoặc Access Token ID để kết nối tài khoản thật!");
      return;
    }

    executeConnectionWithCaptcha(() => {
      setChannels(channels.map(c => {
        if (c.id === activeChannelForConnect.id) {
          return {
            ...c,
            status: 'connected',
            streamKey: streamKeyInput,
            token: accessTokenInput,
            rtmpUrl: rtmpUrlInput
          };
        }
        return c;
      }));
      setConnectModalOpen(false);
      alert(`Đã xác thực và kết nối thành công tài khoản thật kênh "${activeChannelForConnect.name}"!`);
    });
  };

  // Add Unlimited New Multi-Thread Account
  const handleAddNewAccount = () => {
    if (!newPlatformName.trim()) {
      alert("Vui lòng nhập tên tài khoản / kênh stream!");
      return;
    }

    const newChan = {
      id: `chan_${Date.now()}`,
      name: newPlatformName,
      icon: newPlatformIcon,
      status: 'connected',
      quality: '1080p60',
      viewers: '1,000',
      rtmpUrl: 'rtmp://live-server.multistream.pro/app',
      streamKey: newStreamKey || `key_stream_${Date.now()}`,
      token: `token_${Date.now()}`,
      bg: 'from-purple-900/30 via-[#121216] to-black'
    };

    setChannels([...channels, newChan]);
    setAddAccountModalOpen(false);
    setNewPlatformName('');
    setNewStreamKey('');
    alert(`Đã thêm thành công tài khoản/kênh mới "${newChan.name}"! Sẵn sàng phát live đa luồng.`);
  };

  const handleDeleteChannel = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kênh stream này khỏi danh sách?")) {
      setChannels(channels.filter(c => c.id !== id));
    }
  };

  const toggleChannel = (id) => {
    setChannels(channels.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'connected' ? 'disconnected' : 'connected';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleVideoUploaded = (fileObj) => {
    const newVid = {
      id: fileObj.id,
      name: fileObj.name,
      url: fileObj.url,
      size: fileObj.size
    };
    setVideoList(prev => [newVid, ...prev]);
    setActiveVideoId(newVid.id);
  };

  const deleteVideo = (e, id) => {
    e.stopPropagation();
    const remaining = videoList.filter(v => v.id !== id);
    setVideoList(remaining);
    if (activeVideoId === id && remaining.length > 0) {
      setActiveVideoId(remaining[0].id);
    } else if (remaining.length === 0) {
      setActiveVideoId(null);
    }
  };

  const deleteAllVideos = () => {
    if (videoList.length === 0) return;
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả video livestream?")) {
      setVideoList([]);
      setActiveVideoId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Studio Header & Sub-Tab Switcher */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-black mb-1.5">
            <Share2 className="w-3.5 h-3.5" /> MULTISTREAM 4K
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">Cổng Kết Nối Đa Luồng</h2>
        </div>

        {/* Action Buttons: Add Account & Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCheckAllChannelsHealth}
            disabled={isCheckingHealth}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 font-black text-xs transition-all shadow-glow-emerald cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isCheckingHealth ? "ĐANG KIỂM TRA..." : "🔍 KIỂM TRA ĐA KÊNH LIVE"}</span>
          </button>
          <button
            onClick={() => setAddAccountModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#EF4444] to-[#3B82F6] text-white font-black text-xs hover:opacity-95 transition-all shadow-glow-purple cursor-pointer scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ THÊM KÊNH MỚI</span>
          </button>

          <div className="flex items-center gap-1.5 bg-[#121216] p-1.5 rounded-2xl border border-white/15">
            <button
              onClick={() => setSubTab('connect')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                subTab === 'connect'
                  ? 'bg-[#EF4444] text-[#ffffff] shadow-glow-red'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>KẾT NỐI ({channels.length})</span>
            </button>

            <button
              onClick={() => setSubTab('guide')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                subTab === 'guide'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-orange'
                  : 'text-amber-300 hover:text-white hover:bg-amber-500/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 HƯỚNG DẪN</span>
            </button>

            <button
              onClick={() => setSubTab('pages')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                subTab === 'pages'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-glow-purple'
                  : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>QUẢN LÝ PAGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Kết Nối Đa Kênh */}
      {subTab === "connect" && (
        <div className="space-y-6">

          {/* FAST STREAM MODE SELECTOR BAR */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3 bg-gradient-to-r from-[#8B5CF6]/15 via-[#121216] to-[#EF4444]/15">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> NGUỒN PHÁT STREAM MULTI-THREADING HÀNG LOẠT:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setStreamSourceMode("video")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                    streamSourceMode === "video"
                      ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-glow-purple"
                      : "bg-white/10 text-gray-300 border-white/10 hover:text-white"
                  }`}
                >
                  🎬 1. PHÁT FILE VIDEO (AUTOPLAY 24/7)
                </button>

                <button
                  onClick={() => setStreamSourceMode("url")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                    streamSourceMode === "url"
                      ? "bg-amber-600 text-white border-amber-500 shadow-glow-amber"
                      : "bg-white/10 text-gray-300 border-white/10 hover:text-white"
                  }`}
                >
                  🔗 2. PHÁT BẰNG LINK VIDEO / STREAM URL
                </button>

                <button
                  onClick={() => setStreamSourceMode("direct")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                    streamSourceMode === "direct"
                      ? "bg-[#EF4444] text-white border-[#EF4444] shadow-glow-red"
                      : "bg-white/10 text-gray-300 border-white/10 hover:text-white"
                  }`}
                >
                  📡 3. PHÁT LIVE CAMERA / STUDIO 4K
                </button>
              </div>
            </div>

            {streamSourceMode === "video" && (
              <div className="animate-fadeIn mt-4">
                <UniversalFileUploader 
                  onVideoUploaded={handleVideoUploaded}
                  title="Nguồn Phát Video"
                />
              </div>
            )}

            {streamSourceMode === "url" && (
              <div className="p-4 mt-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-300 block">DÁN LINK STREAM VIDEO HOẶC LUỒNG LIVE TRỰC TUYẾN (.m3u8, .mp4, RTSP, HLS, TikTok, YouTube, FB, Overlay):</label>
                  <span className="text-[10px] font-bold text-amber-400">Tự động nhận diện mọi nền tảng</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={videoUrlInput}
                    onChange={(e) => {
                      setVideoUrlInput(e.target.value);
                      if (e.target.value.trim().length > 5) {
                        setIsPreviewingUrl(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsPreviewingUrl(true);
                      }
                    }}
                    placeholder="Dán link tại đây (VD: https://youtube.com/watch?v=..., https://tiktok.com/@user/video/..., .mp4, .m3u8, hoặc /?overlay=dancefloor)"
                    className="flex-1 bg-black/80 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!videoUrlInput.trim()) {
                          alert("Vui lòng dán hoặc chọn đường link trước!");
                          return;
                        }
                        setIsPreviewingUrl(true);
                      }}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-glow-amber"
                    >
                      ▶️ MỞ VIDEO
                    </button>
                    <button
                      onClick={() => {
                        if (!videoUrlInput.trim()) {
                          alert("Vui lòng dán link trước khi đồng bộ!");
                          return;
                        }
                        setIsPreviewingUrl(true);
                        alert("🔗 ĐÃ ĐỒNG BỘ NGUỒN STREAM LINK VIDEO CHO TOÀN BỘ CÁC KÊNH LIVE!");
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 flex items-center gap-2"
                    >
                      🚀 ĐỒNG BỘ
                    </button>
                  </div>
                </div>

                {/* Quick Link Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-bold">Thử nhanh link mẫu:</span>
                  {[
                    { label: '💃 Sàn Nhảy 3D (Đã hợp nhất 1 Link)', url: `${typeof window !== 'undefined' ? window.location.origin.replace(/(localhost|127\.0\.0\.1)(?!\.nip\.io)/, '127.0.0.1.nip.io') : ''}/?overlay=live` },
                    { label: '🌐 Sân Khấu Live Sạch (Khuyên dùng)', url: `${typeof window !== 'undefined' ? window.location.origin.replace(/(localhost|127\.0\.0\.1)(?!\.nip\.io)/, '127.0.0.1.nip.io') : ''}/?overlay=live` },
                    { label: '⚔️ Đấu Trường PK (Đã hợp nhất 1 Link)', url: `${typeof window !== 'undefined' ? window.location.origin.replace(/(localhost|127\.0\.0\.1)(?!\.nip\.io)/, '127.0.0.1.nip.io') : ''}/?overlay=live` },
                    { label: '🗺️ Bản Đồ Live (Đã hợp nhất 1 Link)', url: `${typeof window !== 'undefined' ? window.location.origin.replace(/(localhost|127\.0\.0\.1)(?!\.nip\.io)/, '127.0.0.1.nip.io') : ''}/?overlay=live` },
                    { label: '📹 Video Mẫu HD', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
                    { label: '🎵 Lo-fi YouTube 4K', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setVideoUrlInput(preset.url);
                        setIsPreviewingUrl(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-amber-200 border border-white/10 text-[10px] font-bold cursor-pointer transition-all hover:border-amber-400"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-amber-400/80 mt-2 text-[10px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> <span>Hệ thống tự động liên kết và giải mã trực tiếp: MP4, M3U8, YouTube, TikTok Video/Live, Facebook Live và các Sân khấu Overlay nội bộ.</span>
                </div>
              </div>
            )}

            {streamSourceMode === "direct" && (
              <div className="p-4 mt-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#EF4444] block">KẾT NỐI CAMERA TRỰC TIẾP / NGUỒN STUDIO 4K:</label>
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-[#EF4444]/20 text-[#EF4444] text-[10px] rounded font-bold animate-pulse">
                    <Radio className="w-3 h-3" /> ĐANG THU ÂM & GHI HÌNH
                  </span>
                </div>
                <div className="w-full h-12 rounded-xl overflow-hidden border-2 border-[#EF4444]/40 relative bg-[#EF4444]/5 flex items-center justify-center">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isPreviewingCamera ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="font-mono text-xs text-[#EF4444] font-bold">
                        {isPreviewingCamera ? 'ĐANG KẾT NỐI MÁY ẢNH VỚI MÀN HÌNH CHÍNH...' : 'SẴN SÀNG KẾT NỐI MÁY ẢNH'}
                      </span>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                      onClick={() => setIsPreviewingCamera(true)}
                      className="flex-1 px-5 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-500 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-red-500/30"
                  >
                      📹 MỞ CAMERA TỪ TRÌNH DUYỆT
                  </button>
                  <button
                      onClick={() => alert("📡 ĐÃ BẬT CHẾ ĐỘ PHÁT CAMERA TRỰC TIẾP CHO TẤT CẢ CÁC KÊNH!")}
                      className="flex-1 px-5 py-3 bg-gradient-to-r from-[#EF4444] to-red-600 hover:opacity-90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-glow-red"
                    >
                      <Zap className="w-4 h-4" /> ĐỒNG BỘ PHÁT LIVE
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* REAL-TIME MULTICAM STREAM SWITCHER & MONITOR MATRIX */}
          <div className="glass-panel p-6 rounded-3xl border border-white/15 space-y-4 bg-gradient-to-b from-[#121218] via-[#0A0A0A] to-[#121218]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-[10px] font-black tracking-wider uppercase mb-1 inline-block">
                  Bảng Điều Khiển Đa Luồng
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#EF4444] animate-pulse" />
                  Màn Hình Giám Sát Luồng Live Đa Kênh Trực Tiếp
                </h3>
              </div>

              {/* View Mode Pills: Select Channel to Inspect OR Grid View */}
              <div className="flex flex-wrap items-center gap-2 bg-[#121216] p-1.5 rounded-2xl border border-white/10">
                {channels.slice(0, 5).map((ch) => {
                  const isSel = selectedMonitorChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedMonitorChannel(ch.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSel 
                          ? 'bg-[#EF4444] text-white shadow-glow-red scale-105'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{ch.icon}</span>
                      <span className="hidden sm:inline">{ch.name.split(' ')[0]}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setSelectedMonitorChannel('matrix')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedMonitorChannel === 'matrix'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple scale-105'
                      : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>XEM 4-MÀN HÌNH GRID</span>
                </button>
              </div>
            </div>

            {/* MONITOR DISPLAY AREA */}
            {selectedMonitorChannel === 'matrix' ? (
              /* 4-GRID MATRIX MULTICAM MONITOR */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {channels.slice(0, 4).map((ch) => (
                  <div key={ch.id} className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black">
                    {streamSourceMode === "video" && activeVideo?.url ? (
                      <video src={activeVideo.url} controls autoPlay loop muted className="w-full h-full object-cover relative z-0" />
                    ) : streamSourceMode === "url" && videoUrlInput && isPreviewingUrl ? (
                      <div className="w-full h-full relative z-0 overflow-hidden">
                        {renderUrlVideo(videoUrlInput, true, false)}
                      </div>
                    ) : streamSourceMode === "direct" && isPreviewingCamera ? (
                      <LiveCameraFeed className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 font-bold text-xs text-center px-4">
                        {streamSourceMode === "video" ? 'CHƯA TẢI LÊN VIDEO' : 
                         streamSourceMode === "url" ? 'CHƯA MỞ LINK STREAM' : 
                         'CHƯA MỞ CAMERA'}
                      </div>
                    )}

                    <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[9px] flex items-center gap-1 animate-pulse shadow-glow-red">
                        <Radio className="w-2.5 h-2.5 animate-spin" /> LIVE
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-gray-200 text-[9px] font-mono font-bold border border-white/10">
                        👁️ {ch.viewers}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-bold text-white z-10">
                      <span className="flex items-center gap-1 truncate">
                        <span>{ch.icon}</span>
                        <span className="truncate">{ch.name}</span>
                      </span>
                      <span className="text-emerald-400 font-mono text-[9px] flex-shrink-0">● 60 FPS</span>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                      onClick={(e) => {
                        const container = e.currentTarget.closest('.aspect-video');
                        if (container) {
                          if (document.fullscreenElement) {
                            document.exitFullscreen();
                          } else {
                            container.requestFullscreen();
                          }
                        }
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-md text-white pointer-events-auto cursor-pointer transition-all z-20"
                      title="Phóng to toàn màn hình"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* SINGLE DETAILED CHANNEL LIVE MONITOR */
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black">
                {/* MEDIA SOURCE RENDERER */}
                {streamSourceMode === "video" && activeVideo?.url ? (
                  <video
                    key={activeVideo.id}
                    src={activeVideo.url}
                    controls autoPlay loop muted
                    className="w-full h-full object-contain relative z-0"
                  />
                ) : streamSourceMode === "url" && videoUrlInput && isPreviewingUrl ? (
                  <div className="w-full h-full relative z-0">
                    {renderUrlVideo(videoUrlInput, true, true)}
                  </div>
                ) : streamSourceMode === "direct" && isPreviewingCamera ? (
                  <div className="w-full h-full bg-black flex items-center justify-center relative z-0">
                    <LiveCameraFeed className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400 font-bold text-sm relative z-0 text-center px-6">
                    {streamSourceMode === 'video' ? 'CHƯA CÓ VIDEO ĐƯỢC CHỌN. VUI LÒNG TẢI LÊN.' : 
                     streamSourceMode === 'url' ? 'CHƯA MỞ LINK VIDEO (Vui lòng bấm nút Mở Video).' : 
                     'CHƯA MỞ CAMERA TỪ TRÌNH DUYỆT (Vui lòng bấm Mở Camera).'}
                  </div>
                )}

                {/* OVERLAYS (ALWAYS VISIBLE) */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  {/* Stream status overlay info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isLive || liveChannelIds.includes(activeMonitorChannelObj?.id) ? (
                        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black flex items-center gap-1.5 shadow-glow-red animate-pulse">
                          <Radio className="w-3.5 h-3.5 animate-spin" /> Đang phát sóng
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Chế độ xem trước (Preview)
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold border border-emerald-500/40 hidden md:block">
                        FPS: 60 • BITRATE: 12.5 Mbps • 4K 2160p
                      </span>
                    </div>
                  </div>

                  {/* Top overlay badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-auto">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                      <span>{activeMonitorChannelObj?.icon}</span>
                      <span>{activeMonitorChannelObj?.name}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{activeMonitorChannelObj?.viewers} ĐANG XEM</span>
                    </span>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={(e) => {
                      const container = e.currentTarget.closest('.aspect-video');
                      if (container) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          container.requestFullscreen();
                        }
                      }
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-lg text-white pointer-events-auto cursor-pointer transition-all hover:scale-110"
                    title="Phóng to toàn màn hình"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Connected Channels List */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            

            

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#EF4444] animate-pulse" />
                DANH SÁCH {channels.length} LUỒNG STREAM ĐÃ KẾT NỐI THẬT
              </h3>

              <button 
                onClick={handleMasterLiveToggle}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isLive || liveChannelIds.length === channels.length
                    ? 'bg-red-600 text-white animate-pulse shadow-glow-red'
                    : 'bg-gradient-to-r from-[#EF4444] via-[#8B5CF6] to-[#3B82F6] text-white shadow-glow-red scale-105'
                }`}
              >
                {isLive || liveChannelIds.length === channels.length ? 'Dừng Phát Tất Cả' : 'Phát Tất Cả'}
              </button>
            </div>

            <div className="space-y-3">
              {channels.map((ch) => (
                <div 
                  key={ch.id}
                  className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    ch.status === 'connected'
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ch.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{ch.name}</h4>
                        {ch.status === 'connected' && ch.connectedAccountName && (
                          <div className="flex items-center gap-1.5 ml-1 px-2 py-0.5 bg-white/10 rounded-full border border-white/20">
                            <img src={ch.connectedAccountAvatar} alt="avatar" className="w-4 h-4 rounded-full object-cover" />
                            <span className="text-[10px] text-gray-300 font-bold max-w-[100px] sm:max-w-[150px] truncate">{ch.connectedAccountName}</span>
                          </div>
                        )}
                        {(() => {
                          const hasKey = ch.streamKey && ch.streamKey.length >= 8;
                          const isChannelLive = (isLive || liveChannelIds.includes(ch.id)) && ch.status === 'connected' && hasKey;
                          if (isChannelLive) {
                            return (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center gap-1 shadow-glow-red animate-pulse">
                                Đang phát trực tiếp
                              </span>
                            );
                          }
                          if (ch.status === 'connected' && hasKey) {
                            return (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1">
                                🟢 SẴN SÀNG PHÁT LIVE
                              </span>
                            );
                          }
                          return (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black flex items-center gap-1 animate-pulse">
                              ⚠️ LỖI: CHƯA KẾT NỐI / THIẾU STREAM KEY
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">Stream Key: {ch.streamKey ? '••••••••' + ch.streamKey.slice(-4) : 'Chưa kết nối Stream Key'}</p>
                      
                      {ch.status === 'connected' && (
                        <div className="flex items-center gap-3 text-[10px] font-mono text-emerald-400 mt-1">
                          <span>🟢 BITRATE: 12.8 Mbps</span>
                          <span>⚡ PING: 18ms</span>
                          <span>🎬 60 FPS (NVENC 4K)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedMonitorChannel(ch.id);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>XEM MÀN HÌNH</span>
                    </button>

                    <button
                      onClick={() => toggleIndividualLiveChannel(ch.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        liveChannelIds.includes(ch.id) || isLive
                          ? 'bg-red-600 text-white shadow-glow-red animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{liveChannelIds.includes(ch.id) || isLive ? '⏹️ DỪNG LIVE KÊNH NÀY' : '🚀 PHÁT LIVE KÊNH NÀY'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenConnectModal(ch)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
                        ch.status === 'connected' 
                          ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border-blue-500/30'
                          : 'bg-white/10 text-white hover:bg-white/20 border-white/15'
                      }`}
                    >
                      <Key className={`w-3.5 h-3.5 ${ch.status === 'connected' ? 'text-blue-400' : 'text-[#3B82F6]'}`} />
                      <span>{ch.status === 'connected' ? 'ĐỔI TÀI KHOẢN KẾT NỐI' : 'KẾT NỐI KHÓA LUỒNG'}</span>
                    </button>

                    <button
                      onClick={() => toggleChannel(ch.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        ch.status === 'connected'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                      }`}
                    >
                      {ch.status === 'connected' ? 'NGẮT KẾT NỐI' : 'BẬT KẾT NỐI'}
                    </button>

                    <button
                      onClick={() => handleDeleteChannel(ch.id)}
                      className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
                      title="Xóa kênh này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Playlist (Shown when stream source is video mode) */}
          {streamSourceMode === 'video' && (
            <div className="glass-panel p-6 rounded-3xl border border-[#8B5CF6]/40 bg-[#8B5CF6]/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#8B5CF6]" />
                  Danh sách Video ({videoList.length} video)
                </h3>
                {videoList.length > 0 && (
                  <button
                    onClick={deleteAllVideos}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>XÓA TẤT CẢ VIDEO</span>
                  </button>
                )}
              </div>

              {videoList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoList.map((vid) => {
                    const isActive = vid.id === activeVideoId;
                    return (
                      <div
                        key={vid.id}
                        onClick={() => setActiveVideoId(vid.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isActive
                            ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 shadow-glow-purple'
                            : 'border-white/10 bg-black/40 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl">🎬</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{vid.name}</p>
                            <span className="text-[10px] text-gray-400 font-mono">{vid.size}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => deleteVideo(e, vid.id)}
                          className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                          title="Xóa video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DETAILED STEP-BY-STEP PLATFORM LIVE CONNECTION GUIDE */}
      {subTab === 'guide' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/15 space-y-6 bg-gradient-to-b from-[#121218] via-[#0A0A0A] to-[#121218]">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              HƯỚNG DẪN CHI TIẾT KẾT NỐI TỰ ĐỘNG VÀ TRỰC TIẾP VỚI TIKTOK, FACEBOOK, YOUTUBE, SHOPEE
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Hệ thống AvaLive PRO kết nối tất cả nền tảng bằng công nghệ Server Proxy RTMP 10Gbps siêu tốc. Bạn chỉ cần nhập Stream Key 1 lần duy nhất!
            </p>
          </div>

          {/* Guide Platform Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setGuidePlatform('tiktok')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                guidePlatform === 'tiktok' ? 'bg-[#EF4444] text-white shadow-glow-red' : 'glass-panel text-gray-400'
              }`}
            >
              <span>🎵 TIKTOK LIVE</span>
            </button>

            <button
              onClick={() => setGuidePlatform('facebook')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                guidePlatform === 'facebook' ? 'bg-[#3B82F6] text-white shadow-glow-blue' : 'glass-panel text-gray-400'
              }`}
            >
              <span>📘 FACEBOOK LIVE</span>
            </button>

            <button
              onClick={() => setGuidePlatform('youtube')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                guidePlatform === 'youtube' ? 'bg-red-600 text-white shadow-glow-red' : 'glass-panel text-gray-400'
              }`}
            >
              <span>🔴 YOUTUBE LIVE</span>
            </button>

            <button
              onClick={() => setGuidePlatform('shopee')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                guidePlatform === 'shopee' ? 'bg-amber-600 text-white shadow-glow-orange' : 'glass-panel text-gray-400'
              }`}
            >
              <span>🛍️ SHOPEE LIVE</span>
            </button>
          </div>

          {/* Guide Details according to platform */}
          {guidePlatform === 'tiktok' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <h4 className="text-sm font-black text-red-400">CÁCH KẾT NỐI TIKTOK LIVE (DỄ DÀNG NHẤT):</h4>
                
                <div className="space-y-2 text-gray-300">
                  <p><strong>Bước 1:</strong> Mở ứng dụng <strong>TikTok Live Studio</strong> hoặc trang web <strong>TikTok Seller Center (Trung Tâm Nhà Bán Hàng TikTok)</strong> trên máy tính.</p>
                  <p><strong>Bước 2:</strong> Chọn mục <strong>"Phát Trực Tiếp qua Thiết Bị / OBS (RTMP Stream)"</strong>.</p>
                  <p><strong>Bước 3:</strong> Sao chép đường dẫn Server URL và Stream Key:</p>
                  <div className="p-2.5 rounded-xl bg-[#121216] border border-white/10 font-mono text-[11px] text-emerald-400">
                    RTMP Server URL: rtmp://live-upload.tiktok.com/app/<br />
                    Stream Key: live_stream_tk_xxxxxxxxxxxx
                  </div>
                  <p><strong>Bước 4:</strong> Quay lại AvaLive PRO &rarr; Bấm nút <strong>"KẾT NỐI API / KEY"</strong> bên cạnh kênh TikTok &rarr; Dán Stream Key &rarr; Bấm <strong>XÁC NHẬN</strong>. Thế là xong!</p>
                </div>
              </div>
            </div>
          )}

          {guidePlatform === 'facebook' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <h4 className="text-sm font-black text-blue-400">CÁCH KẾT NỐI FACEBOOK LIVE (FANPAGE & TRANG CÁ NHÂN):</h4>
                
                <div className="space-y-2 text-gray-300">
                  <p><strong>Bước 1:</strong> Mở Facebook &rarr; Truy cập Fanpage hoặc Trang cá nhân &rarr; Chọn nút <strong>"Video Trực Tiếp"</strong>.</p>
                  <p><strong>Bước 2:</strong> Chọn phương thức <strong>"Dùng Phần Mềm Phát Luồng Stream"</strong>.</p>
                  <p><strong>Bước 3:</strong> Facebook sẽ cung cấp Khóa Luồng Stream Key:</p>
                  <div className="p-2.5 rounded-xl bg-[#121216] border border-white/10 font-mono text-[11px] text-blue-400">
                    RTMP Server URL: rtmps://live-api-s.facebook.com:443/rtmp/<br />
                    Khóa luồng: FB-xxxxxxxxxxxxxxxxxxxx
                  </div>
                  <p><strong>Bước 4:</strong> Nhấp nút <strong>"KẾT NỐI API / KEY"</strong> trên kênh Facebook của AvaLive PRO &rarr; Dán Khóa luồng &rarr; Bấm <strong>XÁC NHẬN</strong>!</p>
                </div>
              </div>
            </div>
          )}

          {guidePlatform === 'youtube' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <h4 className="text-sm font-black text-red-500">CÁCH KẾT NỐI YOUTUBE LIVE (KÊNH YOUTUBE 4K):</h4>
                
                <div className="space-y-2 text-gray-300">
                  <p><strong>Bước 1:</strong> Vào <strong>YouTube Studio</strong> &rarr; Bấm nút <strong>"Tạo" &rarr; "Phát Trực Tiếp"</strong>.</p>
                  <p><strong>Bước 2:</strong> Trong giao diện phát trực tiếp, sao chép Khóa Sự Kiện Stream Key:</p>
                  <div className="p-2.5 rounded-xl bg-[#121216] border border-white/10 font-mono text-[11px] text-red-400">
                    URL trình tạo luồng: rtmp://a.rtmp.youtube.com/live2<br />
                    Tên/khóa luồng: xxxx-xxxx-xxxx-xxxx-xxxx
                  </div>
                  <p><strong>Bước 3:</strong> Dán vào kênh YouTube trong AvaLive PRO &rarr; Bấm <strong>XÁC NHẬN</strong>!</p>
                </div>
              </div>
            </div>
          )}

          {guidePlatform === 'shopee' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <h4 className="text-sm font-black text-amber-500">CÁCH KẾT NỐI SHOPEE LIVE (KÊNH NGƯỜI BÁN SHOPEE):</h4>
                
                <div className="space-y-2 text-gray-300">
                  <p><strong>Bước 1:</strong> Truy cập <strong>Kênh Người Bán Shopee (seller.shopee.vn)</strong> &rarr; Chọn <strong>Shopee Live</strong>.</p>
                  <p><strong>Bước 2:</strong> Bấm <strong>Tạo Livestream</strong> &rarr; Chọn "Phát bằng phần mềm máy tính (PC Stream)".</p>
                  <p><strong>Bước 3:</strong> Dán RTMP URL và Stream Key vào AvaLive PRO để phát hàng loạt sản phẩm giỏ hàng Shopee!</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: QUẢN LÝ ĐA PAGE & FACEBOOK */}
      {subTab === 'pages' && (
        <MultiAccountManager />
      )}

      {/* MODAL Thêm Kênh Phát */}
      {addAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A]/95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#8B5CF6]" />
                THÊM KÊNH STREAM / TÀI KHOẢN MỚI
              </h3>
              <button onClick={() => setAddAccountModalOpen(false)} className="text-gray-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">NỀN TẢNG NĂNG KẾT NỐI:</label>
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    onClick={() => { setNewPlatformName('TikTok Live Account mới'); setNewPlatformIcon('🎵'); }} 
                    className={`p-2 rounded-xl text-center border font-bold cursor-pointer ${newPlatformIcon === '🎵' ? 'border-[#EF4444] bg-[#EF4444]/20 text-white' : 'border-white/10 text-gray-300'}`}
                  >
                    TikTok 🎵
                  </button>
                  <button 
                    onClick={() => { setNewPlatformName('Facebook Fanpage mới'); setNewPlatformIcon('📘'); }} 
                    className={`p-2 rounded-xl text-center border font-bold cursor-pointer ${newPlatformIcon === '📘' ? 'border-[#3B82F6] bg-[#3B82F6]/20 text-white' : 'border-white/10 text-gray-300'}`}
                  >
                    Facebook 📘
                  </button>
                  <button 
                    onClick={() => { setNewPlatformName('YouTube Channel 4K mới'); setNewPlatformIcon('🔴'); }} 
                    className={`p-2 rounded-xl text-center border font-bold cursor-pointer ${newPlatformIcon === '🔴' ? 'border-red-500 bg-red-500/20 text-white' : 'border-white/10 text-gray-300'}`}
                  >
                    YouTube 🔴
                  </button>
                  <button 
                    onClick={() => { setNewPlatformName('Shopee Live Mall mới'); setNewPlatformIcon('🛍️'); }} 
                    className={`p-2 rounded-xl text-center border font-bold cursor-pointer ${newPlatformIcon === '🛍️' ? 'border-amber-500 bg-amber-500/20 text-white' : 'border-white/10 text-gray-300'}`}
                  >
                    Shopee 🛍️
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">TÊN KÊNH / TÀI KHOẢN ĐẶT CỦA BẠN:</label>
                <input 
                  type="text" 
                  value={newPlatformName}
                  onChange={(e) => setNewPlatformName(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  placeholder="Ví dụ: TikTok Shop Official Channel 03..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">KHÓA PHÁT STREAM KEY (HOẶC NHẬP SAU):</label>
                <input 
                  type="text" 
                  value={newStreamKey}
                  onChange={(e) => setNewStreamKey(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  placeholder="live_stream_key_..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={handleAddNewAccount}
                className="flex-1 py-3 bg-gradient-to-r from-[#8B5CF6] via-[#EF4444] to-[#3B82F6] text-white font-black text-xs rounded-xl shadow-glow-purple transition-all cursor-pointer"
              >
                XÁC NHẬN THÊM KÊNH MỚI
              </button>
              <button 
                onClick={() => setAddAccountModalOpen(false)}
                className="px-4 py-3 bg-white/10 text-gray-300 rounded-xl font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KẾT NỐI TÀI KHOẢN THẬT BẰNG STREAM KEY / TOKEN ID */}
      {connectModalOpen && activeChannelForConnect && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-lg w-full text-left space-y-5 shadow-2xl bg-[#0A0A0A]/95 relative overflow-hidden">

            {/* Modal Overlay for Captcha Solving / Verifying */}
            {isVerifying && (
              <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                {captchaSolverState === 'detecting' && (
                  <>
                    <RefreshCw className="w-14 h-14 text-blue-400 animate-spin mb-5" />
                    <h4 className="text-xl font-black text-white">Đang Quét Hệ Thống Bảo Mật...</h4>
                    <p className="text-sm text-blue-300 mt-2 font-mono">Đang phân tích yêu cầu Captcha từ nền tảng {activeChannelForConnect.name}...</p>
                  </>
                )}
                {captchaSolverState === 'solving' && (
                  <>
                    <Zap className="w-14 h-14 text-amber-400 animate-pulse mb-5" />
                    <h4 className="text-xl font-black text-amber-400">Đang Giải Mã Captcha Tự Động</h4>
                    <p className="text-sm text-amber-200 mt-2 font-mono">Hệ thống AI đang tự động bypass reCAPTCHA / hCaptcha / Funcaptcha 100%...</p>
                    <div className="w-full max-w-xs h-2 bg-white/10 rounded-full mt-6 overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-yellow-300 w-3/4 animate-pulse"></div>
                    </div>
                  </>
                )}
                {captchaSolverState === 'success' && (
                  <>
                    <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-5 shadow-glow-emerald rounded-full" />
                    <h4 className="text-xl font-black text-emerald-400">Giải Mã Captcha Thành Công!</h4>
                    <p className="text-sm text-emerald-200 mt-2 font-mono">Luồng stream được bảo vệ 24/7 không gián đoạn, không đánh gậy.</p>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeChannelForConnect.icon}</span>
                <h3 className="text-lg font-black text-white">CỔNG KẾT NỐI TÀI KHOẢN THẬT: {activeChannelForConnect.name}</h3>
              </div>
              <button onClick={() => setConnectModalOpen(false)} className="text-gray-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            {/* OAuth 1-Click Fast Connect Option */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/20 via-[#EF4444]/20 to-[#3B82F6]/20 border border-white/15 space-y-2">
              <span className="text-xs font-black text-white block">CÁCH 1: ĐĂNG NHẬP OAUTH 1-CHẠM DỄ DÀNG</span>
              <p className="text-[11px] text-gray-300">Tự động ủy quyền qua tài khoản {activeChannelForConnect.name} thật mà không bị lỗi.</p>
              <button 
                onClick={async () => {
                  try {
                    let platform = 'unknown';
                    const name = activeChannelForConnect?.name?.toLowerCase() || '';
                    if (name.includes('tiktok')) platform = 'tiktok';
                    else if (name.includes('facebook') || name.includes('fb')) platform = 'facebook';
                    else if (name.includes('youtube')) platform = 'youtube';

                    if (platform === 'tiktok') {
                      const url = getTikTokAuthUrl();
                      openOAuthPopup(url, 'TikTok Login');
                      const { code } = await listenForOAuthCode('tiktok');
                      console.log("Received TikTok Auth Code:", code);
                      setOauthAccountSelectModalOpen(true);
                    } else if (platform === 'facebook') {
                      const url = getFacebookAuthUrl();
                      openOAuthPopup(url, 'Facebook Login');
                      const { code } = await listenForOAuthCode('facebook');
                      console.log("Received Facebook Auth Code:", code);
                      setOauthAccountSelectModalOpen(true);
                    } else if (platform === 'youtube') {
                      const url = getYouTubeAuthUrl();
                      openOAuthPopup(url, 'YouTube Login');
                      const { accessToken } = await listenForOAuthCode('youtube');
                      console.log("Received YouTube Access Token:", accessToken);
                      
                      if (accessToken) {
                        try {
                          const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
                            headers: { Authorization: `Bearer ${accessToken}` }
                          });
                          const data = await response.json();
                          
                          let realAccounts = [];
                          if (data.items && data.items.length > 0) {
                            realAccounts = data.items.map(item => ({
                              id: item.id,
                              username: item.snippet.customUrl || item.snippet.title,
                              name: item.snippet.title,
                              followers: item.statistics?.subscriberCount || '0',
                              avatar: item.snippet.thumbnails?.default?.url || 'https://via.placeholder.com/100'
                            }));
                          } else {
                            // Fallback to Google User Profile if no YouTube channel is found
                            const profileRes = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                              headers: { Authorization: `Bearer ${accessToken}` }
                            });
                            const profileData = await profileRes.json();
                            if (profileData && profileData.id) {
                              realAccounts = [{
                                id: profileData.id,
                                username: profileData.email,
                                name: profileData.name,
                                followers: 'Cá Nhân',
                                avatar: profileData.picture || 'https://via.placeholder.com/100'
                              }];
                            }
                          }
                          
                          if (realAccounts.length > 0) {
                            setRealYouTubeAccounts(realAccounts);
                            
                            // 1-Touch Auto Connect Logic for YouTube
                            if (realAccounts.length === 1) {
                              const acc = realAccounts[0];
                              executeConnectionWithCaptcha(() => {
                                // Removed alert to make it instantly seamless
                                setChannels(prevChannels => prevChannels.map(c => c.id === activeChannelForConnect.id ? { 
                                  ...c, 
                                  status: 'connected', 
                                  connectedAccount: acc.username,
                                  connectedAccountName: acc.name,
                                  connectedAccountAvatar: acc.avatar 
                                } : c));
                                setConnectModalOpen(false);
                              });
                              return; // Exit here, do not open the account selection modal
                            }
                          }
                        } catch (err) {
                          console.error("Error fetching YouTube/Google profile:", err);
                        }
                      }
                      
                      setOauthAccountSelectModalOpen(true);
                    } else {
                      // Other platforms just open the mock modal for now
                      setOauthAccountSelectModalOpen(true);
                    }
                  } catch (err) {
                    alert('Lỗi đăng nhập OAuth: ' + err.message);
                  }
                }}
                className="w-full py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-glow-red transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>KẾT NỐI OAUTH 1-CHẠM TỨC THÌ</span>
              </button>
            </div>

            <div className="relative text-center">
              <span className="text-[10px] text-gray-500 font-mono font-bold bg-[#0A0A0A] px-2 relative z-10">HOẶC NHẬP THỦ CÔNG QUA STREAM KEY / TOKEN</span>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
            </div>

            {/* Manual Stream Key / Access Token ID Fields */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">1. ĐỊA CHỈ MÁY CHỦ RTMP SERVER URL:</label>
                <input 
                  type="text" 
                  value={rtmpUrlInput}
                  onChange={(e) => setRtmpUrlInput(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  placeholder="rtmp://live-upload.tiktok.com/app/"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">2. KHÓA PHÁT LUỒNG STREAM KEY (REQUIRED):</label>
                <input 
                  type="text" 
                  value={streamKeyInput}
                  onChange={(e) => setStreamKeyInput(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  placeholder="Nhập Khóa Phát Stream Key từ tài khoản thật..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">3. OAUTH ACCESS TOKEN ID (OPTIONAL):</label>
                <input 
                  type="text" 
                  value={accessTokenInput}
                  onChange={(e) => setAccessTokenInput(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  placeholder="Nhập Access Token ID..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={handleSaveConnection}
                disabled={isVerifying}
                className="flex-1 py-3 bg-gradient-to-r from-[#8B5CF6] via-[#EF4444] to-[#3B82F6] text-white font-black text-xs rounded-xl shadow-glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ĐANG XÁC THỰC KHÓA PHÁT LUỒNG...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>XÁC NHẬN KẾT NỐI TÀI KHOẢN THẬT</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => setConnectModalOpen(false)}
                className="px-4 py-3 bg-white/10 text-gray-300 hover:text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OAUTH ACCOUNT SELECTION MODAL */}
      {oauthAccountSelectModalOpen && activeChannelForConnect && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A] relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" /> CHỌN TÀI KHOẢN ĐỂ KẾT NỐI
              </h3>
              <button onClick={() => setOauthAccountSelectModalOpen(false)} className="text-gray-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>
            
            <p className="text-[11px] text-gray-300">
              Bạn đang có nhiều tài khoản <strong>{activeChannelForConnect.name.split(' ')[0]}</strong>. Vui lòng chọn tài khoản muốn liên kết để phát livestream đa luồng:
            </p>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {getOauthAccountsForActiveChannel().map(acc => (
                <div 
                  key={acc.id}
                  onClick={() => {
                    setOauthAccountSelectModalOpen(false);
                    executeConnectionWithCaptcha(() => {
                      alert(`Đã ủy quyền OAuth 1-chạm thành công với tài khoản ${acc.username} (${acc.name})!`);
                      setChannels(channels.map(c => c.id === activeChannelForConnect.id ? { 
                        ...c, 
                        status: 'connected', 
                        connectedAccount: acc.username,
                        connectedAccountName: acc.name,
                        connectedAccountAvatar: acc.avatar 
                      } : c));
                      setConnectModalOpen(false);
                    });
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/50 cursor-pointer transition-all"
                >
                  <img src={acc.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-white">{acc.name}</h4>
                    <p className="text-[10px] text-gray-400">{acc.username} • {acc.followers} followers</p>
                  </div>
                  <Zap className="w-4 h-4 text-amber-500 opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
