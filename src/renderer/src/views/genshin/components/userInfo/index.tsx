import {
  IconClockCircle,
  IconCloudDownload,
  IconDownload,
  IconFolder,
  IconInfoCircle,
  IconMoon,
  IconSubscribed,
  IconSync,
  IconThunderbolt
} from '@arco-design/web-react/icon'
import './index.css'
import { Progress, Switch, Tag, Tooltip } from '@arco-design/web-react'
import { useEffect, useState } from 'react'
const Record = (): JSX.Element => {
  const time = new Date().getDate()
  return (
    <div className="record">
      <div className="record_head">
        <span>祈愿进度</span>
        <span>
          {time} <IconSync style={{ color: '#165DFF' }} />
        </span>
      </div>
      <div style={{ marginTop: '10px' }}>
        <div className="progress_box">
          <p>角色</p>
          <Progress formatText={(): string => '5'} percent={(90 / 100) * 5} />
        </div>
        <div className="progress_box">
          <p>武器</p>
          <Progress formatText={(): string => '11'} percent={(80 / 100) * 11} />
        </div>
        <div className="progress_box">
          <p>常驻</p>
          <Progress formatText={(): string => '45'} percent={(90 / 100) * 45} />
        </div>
      </div>
    </div>
  )
}
const Note = (): JSX.Element => {
  return (
    <div className="note">
      <div>
        <IconMoon />
        <Progress showText={false} percent={30} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <IconSubscribed />
        <Progress steps={4} showText={false} percent={100} />
      </div>
    </div>
  )
}

const Predownload = (): JSX.Element => {
  return (
    <div className="predownload">
      <Progress
        type="circle"
        percent={0}
        formatText={(): JSX.Element => (
          <IconDownload style={{ fontSize: '24px', cursor: 'pointer' }} />
        )}
      />
      <div>
        <div className="icon_group">
          <PredownloadInfo />
        </div>
        <div style={{ float: 'right', marginTop: '20px' }}>
          <Tooltip content="开启多线程可能会造成资源污染">
            <IconThunderbolt />
            <Switch style={{ marginLeft: '5px' }} type="line" size="small" />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

const PredownloadInfo = (): JSX.Element => {
  const [state, setState] = useState(1002)
  const red = 'rgb(var(--red-6))'
  const green = 'rgb(var(--green-6))'
  useEffect(() => {
    window.genshin.predownload().then((res) => {
      setState(res)
    })
  }, [])
  return (
    <>
      <Tooltip mini content={`${state !== 1002 ? 'fine' : '未到时间'}`}>
        <IconClockCircle style={{ color: state !== 1002 ? green : red }} />
      </Tooltip>
      <Tooltip mini content={`云端包体 ${state == 1001 ? '可用' : 'no'}`}>
        <IconCloudDownload style={{ color: state == 1001 ? green : red }} />
      </Tooltip>
      <Tooltip mini content="本地包体：未检出">
        <IconFolder style={{ color: 'rgb(var(--red-6))' }} />
      </Tooltip>
    </>
  )
}

const UserInfo = (): JSX.Element => {
  return (
    <div className="userinfo">
      <div className="tag_group">
        <Tag color="blue" icon={<IconInfoCircle />}>
          {window.genshin.get_version()}
        </Tag>
        <Tag
          onClick={(): void => window.webview.open_genshin_login()}
          color="blue"
          icon={<IconInfoCircle />}
        >
          {'cookie'}
        </Tag>
      </div>
      <Note />
      <Record />
      <Predownload />
    </div>
  )
}

export default UserInfo
