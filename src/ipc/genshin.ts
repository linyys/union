import fs from 'fs'
import { write_json, read_json, path_start, http_get } from '../public/index'
import https from 'https'
import path from 'path'
let config = {
  game_path: '',
  version_time: new Date('2023-9-27').getTime(),
  card_time: '',
  version: ''
}
const one_day = (num: number = 1): number => {
  return 86400000 * num
}
// config相关
const config_sync = async (): Promise<void> => {
  const data = await read_json('./app_data/genshin/config.json')
  config = JSON.parse(data)
}

const create_config = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir('./app_data/genshin', (err) => {
      if (err) {
        reject(err)
        return
      }
      write_json('./app_data/genshin/config.json', JSON.stringify(config))
        .catch((err) => {
          reject(err)
        })
        .then(() => {
          resolve()
        })
    })
  })
}

const up_config = (key: string, val: string | number): void => {
  config_sync().then(() => {
    config[key] = val
    write_json('./app_data/genshin/config.json', JSON.stringify(config))
  })
}

const read_config = async (): Promise<string> => {
  const data = await read_json('./app_data/genshin/config.json')
  await sync_version()
  config = JSON.parse(data)
  return data
}

const start_launcher = (game_path: string): void => {
  let path_arr = game_path.split('\\')
  path_arr = path_arr.slice(0, path_arr.length - 2)
  let path = ''
  path_arr.map((val) => {
    path += val + '\\'
  })
  path += 'Launcher.exe'
  path_start(path)
}
// 更新时间
const update_time = (): number => {
  const time = new Date().getTime()
  const day = time - config.version_time
  const version_time = Math.floor(day / one_day()) % 42
  return 42 - version_time
}

const up_version_time = (): number => {
  const time = new Date().setHours(0, 0, 0)
  const version_time = one_day(42 - update_time())
  return time - version_time
}

const get_update_time = (): number => {
  up_config('version_time', up_version_time())
  return update_time()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// 活动相关
interface data {
  subject: string
  content: string
  images: string
}
const get_all_activity = async (): Promise<Array<data>> => {
  const res = await http_get({
    url: 'https://bbs-api.miyoushe.com/post/wapi/getNewsList?gids=2&page_size=15&type=1',
    encoding: undefined
  })
  const { data } = JSON.parse(Buffer.concat(res).toString())
  const data_list: Array<data> = []
  data.list.map((item) => {
    data_list.push({
      subject: item.post.subject,
      content: item.post.content,
      images: item.post.images[0]
    })
  })
  return data_list
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const get_act = async (): Promise<any> => {
  const data = await get_all_activity()
  const card_list: Array<{ subject: string; images: string }> = []
  const act_list: Array<{ subject: string; time: Array<string> }> = []
  const reg = /(〓.[0-9]).*([0-9].〓)/
  for (let i = 0, l = data.length; i < l; i++) {
    if (/」活动/.test(data[i].subject)) {
      const text = reg.exec(data[i].content)
      act_list.push({
        subject: data[i].subject,
        time: text ? text : ['~']
      })
    } else if (/」祈愿/.test(data[i].subject)) {
      const src = await get_cardImg(data[i].images)
      card_list.push({
        subject: data[i].subject,
        images: src
      })
    }
  }
  return {
    card_list,
    act_list
  }
}

const get_cardImg = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const name = url.split('/')
    const src = path.resolve('./app_data/genshin/data/') + name[name.length - 1]
    if (fs.existsSync(src)) {
      resolve(src)
      return
    }
    https.get(url, (req) => {
      let imgData = ''
      req.setEncoding('binary')
      req.on('data', (chunk) => {
        imgData += chunk
      })
      req.on('end', function () {
        fs.writeFile(src, imgData, 'binary', function (err) {
          if (err) {
            reject()
            console.log(err)
          } else {
            resolve(src)
          }
        })
      })
    })
  })
}

// 预下载
const predownload = (): number => {
  if (update_time() > one_day(2)) {
    return 1
  } else {
    return 2
  }
}

// 版本信息
const sync_version = async (): Promise<void> => {
  let path_arr = config.game_path.split('\\')
  path_arr = path_arr.slice(0, path_arr.length - 1)
  let path = ''
  path_arr.map((val) => {
    path += val + '\\'
  })
  path += 'config.ini'
  const data = await read_json(path)
  const version = /game_version=(.*)/.exec(data)
  if (version == null) {
    return
  }
  up_config('version', version[1])
}
const get_version = (): string => {
  return config.version
}

// const get_cookie = (): void => {

// }

// // 抽卡进度
// const create_record_url = (): void => {

// }

export {
  create_config,
  read_config,
  up_config,
  start_launcher,
  get_update_time,
  get_act,
  predownload,
  get_version
}
