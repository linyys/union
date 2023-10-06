import fs from 'fs'
import { write_json, path_start } from '../public/index'
import {
  create_config,
  read_config,
  up_config,
  start_launcher,
  get_update_time,
  get_act,
  predownload,
  get_version
} from './genshin'
// 'D:\\demo\\electron\\union\\app_data\\config.json'
const is_initial = (): boolean => {
  return fs.existsSync('./app_data')
}

const initialize = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir('./app_data/', (err) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      write_json('./app_data/config.json', '{}').catch((err) => {
        console.log(err)
        reject(err)
      })
      create_config()
        .catch((err) => {
          reject(err)
        })
        .then(() => {
          resolve()
        })
    })
  })
}

const start_exe = (path: string): void => {
  path_start(path)
}

const api = {
  is_initial,
  initialize,
  start_exe
}

const genshin_api = {
  read_config,
  up_config,
  start_launcher,
  get_update_time,
  get_act,
  predownload,
  get_version
}

export { api, genshin_api }
