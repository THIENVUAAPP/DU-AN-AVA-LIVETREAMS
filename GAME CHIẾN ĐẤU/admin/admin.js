/**
 * Client logic cho trang Admin: đăng nhập, điều khiển trận đấu, cài đặt
 * runtime, lịch tự động. Token phiên lưu ở sessionStorage (mất khi đóng tab).
 */

const TOKEN_KEY = 'kc_admin_token';
let statusPollTimer = null;

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

async function apiCall(path, method = 'GET', body) {
  const headers = { 'X-Admin-Token': getToken() || '' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`/admin/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    setToken(null);
    showLogin();
    throw new Error('Phiên đăng nhập hết hạn');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Lỗi không xác định');
  return data;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => { toast.hidden = true; }, 2200);
}

function showLogin() {
  document.getElementById('login-screen').hidden = false;
  document.getElementById('dashboard-screen').hidden = true;
  clearInterval(statusPollTimer);
}

function showDashboard() {
  document.getElementById('login-screen').hidden = true;
  document.getElementById('dashboard-screen').hidden = false;
  document.getElementById('overlay-url-display').textContent = window.location.origin;
  loadInitialSettings();
  pollStatus();
  statusPollTimer = setInterval(pollStatus, 4000);
}

function formatStatus(data) {
  const { connectionStatus, isPaused, pauseReason, snapshot } = data;
  const pauseText = isPaused ? ` | TẠM DỪNG (${pauseReason === 'schedule' ? 'lịch' : 'thủ công'})` : '';
  const matchText = snapshot.matchEnded ? ' | Trận đã kết thúc, chờ reset' : '';
  return `${connectionStatus.toUpperCase()}${pauseText}${matchText} — HP xanh: ${snapshot.hp.blue} / đỏ: ${snapshot.hp.red}`;
}

async function pollStatus() {
  try {
    const data = await apiCall('/status');
    document.getElementById('live-status').textContent = formatStatus(data);
  } catch (error) {
    console.error('[admin] Lỗi lấy trạng thái:', error);
  }
}

async function loadInitialSettings() {
  try {
    const theme = await fetch('/config/theme.json').then((r) => r.json());
    document.getElementById('character-scale').value = theme.battle.characterScale || 1;
    document.getElementById('character-scale-value').textContent = `${(theme.battle.characterScale || 1).toFixed(1)}x`;
    document.getElementById('setting-max-hp').value = theme.battle.maxHpPerFaction;
    document.getElementById('setting-comeback').value = theme.battle.comebackHpPercentThreshold;
    document.getElementById('setting-reset-delay').value = Math.round(theme.battle.matchResetDelayMs / 1000);
    document.getElementById('setting-blue-name').value = theme.factions.blue.name.vi;
    document.getElementById('setting-blue-color').value = theme.factions.blue.color;
    document.getElementById('setting-red-name').value = theme.factions.red.name.vi;
    document.getElementById('setting-red-color').value = theme.factions.red.color;
  } catch (error) {
    console.error('[admin] Lỗi tải theme.json:', error);
  }

  try {
    const audio = await fetch('/config/audio.json').then((r) => r.json());
    document.getElementById('setting-music-volume').value = audio.musicVolume;
    document.getElementById('setting-sfx-volume').value = audio.sfxVolume;
  } catch (error) {
    console.error('[admin] Lỗi tải audio.json:', error);
  }

  try {
    const schedule = await apiCall('/schedule');
    document.getElementById('schedule-enabled').checked = schedule.enabled;
    document.getElementById('schedule-start').value = schedule.dailyStartTime;
    document.getElementById('schedule-end').value = schedule.dailyEndTime;
  } catch (error) {
    console.error('[admin] Lỗi tải lịch:', error);
  }

  try {
    const flags = await apiCall('/feature-flags');
    document.getElementById('flag-boss').checked = flags.bossEffectEnabled;
    document.getElementById('flag-aoe').checked = flags.aoeEffectEnabled;
    document.getElementById('flag-confetti').checked = flags.confettiEnabled;
    document.getElementById('flag-dance').checked = flags.danceEnabled;
    document.getElementById('flag-announcer').checked = flags.announcerEnabled;
  } catch (error) {
    console.error('[admin] Lỗi tải feature flags:', error);
  }

  try {
    const status = await apiCall('/status');
    const note = document.getElementById('tts-status-note');
    const announcerCheckbox = document.getElementById('flag-announcer');
    if (status.ttsAvailable) {
      note.textContent = 'Đã cấu hình ElevenLabs — sẵn sàng xướng tên khi có quà lớn.';
    } else {
      note.textContent = 'Chưa cấu hình ELEVENLABS_API_KEY trong .env — tính năng này chưa hoạt động dù bật ở đây.';
      announcerCheckbox.disabled = true;
    }
  } catch (error) {
    console.error('[admin] Lỗi kiểm tra trạng thái ElevenLabs:', error);
  }
}

function wireLoginForm() {
  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';
    try {
      const response = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Sai mật khẩu');
      setToken(data.token);
      showDashboard();
    } catch (error) {
      errorEl.textContent = error.message;
    }
  });
}

function wireMatchControls() {
  document.getElementById('btn-start').addEventListener('click', async () => {
    await apiCall('/start-new-match', 'POST');
    showToast('Đã bắt đầu trận mới');
  });
  document.getElementById('btn-pause').addEventListener('click', async () => {
    await apiCall('/pause', 'POST');
    showToast('Đã tạm dừng');
  });
  document.getElementById('btn-resume').addEventListener('click', async () => {
    await apiCall('/resume', 'POST');
    showToast('Đã tiếp tục');
  });
  document.getElementById('btn-end').addEventListener('click', async () => {
    try {
      await apiCall('/end-match', 'POST');
      showToast('Đã kết thúc trận');
    } catch (error) {
      showToast(error.message);
    }
  });
}

function wireCharacterScale() {
  const slider = document.getElementById('character-scale');
  const valueLabel = document.getElementById('character-scale-value');
  let debounceTimer = null;

  slider.addEventListener('input', () => {
    valueLabel.textContent = `${Number(slider.value).toFixed(1)}x`;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      await apiCall('/character-scale', 'POST', { scale: Number(slider.value) });
    }, 250);
  });
}

function wireMatchSettingsForm() {
  document.getElementById('btn-save-match-settings').addEventListener('click', async () => {
    const maxHp = Number(document.getElementById('setting-max-hp').value);
    const comebackThreshold = Number(document.getElementById('setting-comeback').value);
    const matchResetDelayMs = Number(document.getElementById('setting-reset-delay').value) * 1000;
    await apiCall('/match-settings', 'POST', { maxHp, comebackThreshold, matchResetDelayMs });
    showToast('Đã lưu thông số trận đấu');
  });
}

function wireAudioSettings() {
  const musicSlider = document.getElementById('setting-music-volume');
  const sfxSlider = document.getElementById('setting-sfx-volume');
  const mutedCheckbox = document.getElementById('setting-muted');
  let debounceTimer = null;

  const sendAudioUpdate = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      await apiCall('/audio-settings', 'POST', {
        musicVolume: Number(musicSlider.value),
        sfxVolume: Number(sfxSlider.value),
        muted: mutedCheckbox.checked,
      });
    }, 250);
  };

  musicSlider.addEventListener('input', sendAudioUpdate);
  sfxSlider.addEventListener('input', sendAudioUpdate);
  mutedCheckbox.addEventListener('change', sendAudioUpdate);
}

function wireFactionAppearanceForm() {
  document.getElementById('btn-save-faction-blue').addEventListener('click', async () => {
    const name = document.getElementById('setting-blue-name').value;
    const color = document.getElementById('setting-blue-color').value;
    await apiCall('/faction-appearance', 'POST', { factionId: 'blue', name, color });
    showToast('Đã lưu phe Xanh');
  });
  document.getElementById('btn-save-faction-red').addEventListener('click', async () => {
    const name = document.getElementById('setting-red-name').value;
    const color = document.getElementById('setting-red-color').value;
    await apiCall('/faction-appearance', 'POST', { factionId: 'red', name, color });
    showToast('Đã lưu phe Đỏ');
  });
}

function wireFeatureFlags() {
  const flags = ['flag-boss', 'flag-aoe', 'flag-confetti', 'flag-dance', 'flag-announcer'];
  const keys = {
    'flag-boss': 'bossEffectEnabled',
    'flag-aoe': 'aoeEffectEnabled',
    'flag-confetti': 'confettiEnabled',
    'flag-dance': 'danceEnabled',
    'flag-announcer': 'announcerEnabled',
  };
  for (const id of flags) {
    document.getElementById(id).addEventListener('change', async (event) => {
      await apiCall('/feature-flags', 'POST', { [keys[id]]: event.target.checked });
      showToast('Đã cập nhật hiệu ứng');
    });
  }
}

function wireScheduleForm() {
  document.getElementById('btn-save-schedule').addEventListener('click', async () => {
    const enabled = document.getElementById('schedule-enabled').checked;
    const dailyStartTime = document.getElementById('schedule-start').value;
    const dailyEndTime = document.getElementById('schedule-end').value;
    try {
      await apiCall('/schedule', 'POST', { enabled, dailyStartTime, dailyEndTime });
      showToast('Đã lưu lịch tự động');
    } catch (error) {
      showToast(error.message);
    }
  });
}

function wireLogout() {
  document.getElementById('logout-btn').addEventListener('click', () => {
    setToken(null);
    showLogin();
  });
}

async function init() {
  wireLoginForm();
  wireMatchControls();
  wireCharacterScale();
  wireMatchSettingsForm();
  wireAudioSettings();
  wireFactionAppearanceForm();
  wireFeatureFlags();
  wireScheduleForm();
  wireLogout();

  if (getToken()) {
    try {
      await apiCall('/status');
      showDashboard();
      return;
    } catch {
      setToken(null);
    }
  }
  showLogin();
}

init();
