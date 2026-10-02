import re
with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace first syncMasterLiveState (playing event video)
target1 = """        // ⚡ Đồng bộ tuyệt đối sang Sân Khấu Chính, Window Capture OBS & Đường Link Online HTTPS
        syncMasterLiveState({
          stage: 'idol',
          mediaUrl: matchedEventVideo.mediaUrl,
          characterName: matchedEventVideo.name || `${evKey} Video`,
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true,
          force: true,
          timestamp: Date.now()
        });"""
replacement1 = """        // ⚡ Đồng bộ tuyệt đối sang Sân Khấu Chính, Window Capture OBS & Đường Link Online HTTPS
        if (localStorage.getItem('avalive_master_sync_active') === 'true') {
          syncMasterLiveState({
            stage: 'idol',
            mediaUrl: matchedEventVideo.mediaUrl,
            characterName: matchedEventVideo.name || `${evKey} Video`,
            isVideo: true,
            videoPlaybackEvent: 'play',
            isPlaying: true,
            force: true,
            timestamp: Date.now()
          });
        }"""
content = content.replace(target1, replacement1)

# Replace second syncMasterLiveState (server media url fallback)
target2 = """            if (srvUrl && srvUrl !== matchedEventVideo.mediaUrl) {
              syncMasterLiveState({
                stage: 'idol',
                mediaUrl: srvUrl,
                eventVideoUrl: srvUrl,
                updatedAt: Date.now()
              });
            }"""
replacement2 = """            if (srvUrl && srvUrl !== matchedEventVideo.mediaUrl) {
              if (localStorage.getItem('avalive_master_sync_active') === 'true') {
                syncMasterLiveState({
                  stage: 'idol',
                  mediaUrl: srvUrl,
                  eventVideoUrl: srvUrl,
                  updatedAt: Date.now()
                });
              }
            }"""
content = content.replace(target2, replacement2)

# Replace third syncMasterLiveState (fallback media url when video ends)
target3 = """    // ⚡ Đồng bộ phục hồi video nền gốc sang Sân Khấu Chính, Window Capture OBS & Đường Link Online
    const fallbackMediaUrl = previousVideoItem?.mediaUrl || (typeof window !== 'undefined' ? (localStorage.getItem('avalive_user_locked_media') || localStorage.getItem('avalive_active_video_src')) : null);
    syncMasterLiveState({
      stage: 'idol',
      mediaUrl: fallbackMediaUrl,
      isVideo: true,
      videoPlaybackEvent: 'play',
      isPlaying: true,
      force: true,
      timestamp: Date.now()
    });"""
replacement3 = """    // ⚡ Đồng bộ phục hồi video nền gốc sang Sân Khấu Chính, Window Capture OBS & Đường Link Online
    const fallbackMediaUrl = previousVideoItem?.mediaUrl || (typeof window !== 'undefined' ? (localStorage.getItem('avalive_user_locked_media') || localStorage.getItem('avalive_active_video_src')) : null);
    if (localStorage.getItem('avalive_master_sync_active') === 'true') {
      syncMasterLiveState({
        stage: 'idol',
        mediaUrl: fallbackMediaUrl,
        isVideo: true,
        videoPlaybackEvent: 'play',
        isPlaying: true,
        force: true,
        timestamp: Date.now()
      });
    }"""
content = content.replace(target3, replacement3)

with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched coordinator video syncs")
