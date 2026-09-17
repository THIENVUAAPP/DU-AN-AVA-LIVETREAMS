const { contextBridge, webUtils } = require('electron');

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    getPathForFile: (file) => {
      try {
        if (webUtils && typeof webUtils.getPathForFile === 'function') {
          return webUtils.getPathForFile(file);
        }
      } catch (e) {}
      return file?.path || null;
    }
  });
} catch (err) {}
