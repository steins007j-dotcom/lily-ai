const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('lily', {
  loadSettings: () => ipcRenderer.invoke('lily:load-settings'),
    saveSettings: (config) => ipcRenderer.invoke('lily:save-settings', config),
      chat: (messages) => ipcRenderer.invoke('lily:chat', { messages })
      })
      
