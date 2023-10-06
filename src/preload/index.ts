import { contextBridge, ipcRenderer } from 'electron'
import { api, genshin_api } from '../ipc'
// Custom APIs for renderer

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('genshin', genshin_api)
    contextBridge.exposeInMainWorld('webview', {
      open_genshin_login: () => ipcRenderer.send('open_genshin_login')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.genshin = genshin_api
}
