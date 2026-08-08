// src/lib/oauthService.js

/**
 * Open a centered popup for OAuth authentication
 * @param {string} url - The OAuth authorize URL
 * @param {string} title - Title of the popup window
 * @param {number} w - Width of the popup
 * @param {number} h - Height of the popup
 * @returns {Window} The popup window object
 */
export const openOAuthPopup = (url, title = 'OAuth Login', w = 500, h = 600) => {
  const y = window.top.outerHeight / 2 + window.top.screenY - ( h / 2);
  const x = window.top.outerWidth / 2 + window.top.screenX - ( w / 2);
  
  return window.open(
    url,
    title,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
  );
};

/**
 * Generate TikTok OAuth URL
 * Using the Client ID provided by the user
 */
export const getTikTokAuthUrl = () => {
  const clientId = 'awjb3l5ll99c459m';
  // Standard TikTok OAuth v2 authorization endpoint
  const baseUrl = 'https://www.tiktok.com/v2/auth/authorize/';
  
  // We use standard user.info.basic scope. (Live scopes are deprecated for public apps).
  const scopes = ['user.info.basic'];
  
  const params = new URLSearchParams({
    client_key: clientId,
    response_type: 'code',
    scope: scopes.join(','),
    redirect_uri: window.location.origin, // Redirect back to our root, where App.jsx intercepts it
    state: 'tiktok_auth_' + Math.random().toString(36).substring(7)
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate Facebook OAuth URL
 * Using the App ID provided by the user
 */
export const getFacebookAuthUrl = () => {
  const clientId = '4491714814417984';
  const baseUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
  
  const scopes = [
    'public_profile', 
    'pages_show_list', 
    'pages_manage_posts',
    'pages_read_engagement',
    'publish_video'
  ];
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: window.location.origin,
    state: 'facebook_auth_' + Math.random().toString(36).substring(7),
    scope: scopes.join(','),
    response_type: 'code',
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate YouTube (Google) OAuth URL
 * Using the Client ID provided by the user
 */
export const getYouTubeAuthUrl = () => {
  const clientId = '9359802346-f94491f7hmcl2jn9k7e6qvn25po33anc.apps.googleusercontent.com';
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ];
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: scopes.join(' '),
    state: 'youtube_auth_' + Math.random().toString(36).substring(7),
    access_type: 'offline',
    prompt: 'consent'
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Listen for the OAuth code from the popup window
 * @param {string} platform - The platform we expect ('tiktok', 'facebook', etc)
 * @returns {Promise<string>} - Resolves with the authorization code
 */
export const listenForOAuthCode = (platform = 'tiktok') => {
  return new Promise((resolve, reject) => {
    const messageListener = (event) => {
      // In production, we should verify event.origin matches our domain for security.
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'OAUTH_CODE' && event.data?.platform === platform) {
        window.removeEventListener('message', messageListener);
        resolve(event.data.code);
      }
      
      if (event.data?.type === 'OAUTH_ERROR') {
        window.removeEventListener('message', messageListener);
        reject(new Error(event.data.error || 'Authentication failed'));
      }
    };

    window.addEventListener('message', messageListener);

    // Timeout after 5 minutes just in case
    setTimeout(() => {
      window.removeEventListener('message', messageListener);
      reject(new Error('Authentication timeout'));
    }, 5 * 60 * 1000);
  });
};
