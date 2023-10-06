import fs from 'fs'
import { shell } from 'electron'
import https from 'https'
const write_json = (path: string, context: string): Promise<void> => {
  return new Promise((resolve, reason) => {
    fs.writeFile(path, context, (err) => {
      reason(err)
    })
    resolve()
  })
}

const read_json = (path: string): Promise<string> => {
  return new Promise((resolve, reason) => {
    fs.readFile(path, (err, data) => {
      resolve(String(data))
      reason(err)
    })
  })
}
const path_start = (path: string): void => {
  shell
    .openPath(path)
    .then((re) => {
      console.log(re)
    })
    .catch((err) => {
      console.log(err)
    })
}

interface config {
  url: string
  encoding: BufferEncoding | undefined
}

const http_get = (config: config): Promise<readonly Uint8Array[]> => {
  return new Promise((resolve, reject) => {
    https
      .get(config.url, (req) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Array<any> = []
        if (config.encoding !== undefined) {
          req.setEncoding(config.encoding)
        }
        req.on('data', (chunk) => {
          data.push(chunk)
        })
        req.on('end', () => {
          resolve(data)
        })
      })
      .on('error', (err) => {
        reject(err)
        console.log(err)
      })
  })
}

export { write_json, read_json, path_start, http_get }
