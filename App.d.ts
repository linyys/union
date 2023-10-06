declare interface Window {
  api: api_fun
  genshin: genshin_fun
  webview: webview_fun
}

interface api_fun {
  is_initial
  initialize
  start_exe
  file_path
}
interface genshin_fun {
  read_config
  up_config
  start_launcher
  get_update_time
  get_act
  predownload
  get_version
  open_genshin_login
}
interface webview_fun {
  open_genshin_login
}
