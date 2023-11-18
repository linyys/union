import { useEffect, useState } from 'react'
import { Button, Popover } from '@arco-design/web-react'
import { IconUp } from '@arco-design/web-react/icon'
import './index.css'
import NewsList from './components/newsList'
import UserInfo from './components/userInfo'
import Tag from '@renderer/components/tag'
interface configProps {
  game_path: string
}
interface config_props {
  config: configProps
  set_config: React.Dispatch<React.SetStateAction<configProps>>
}

const ButtonGroup = Button.Group

const TagGroup = (): JSX.Element => {
  const update_time = window.genshin.get_update_time()
  return (
    <div style={{ display: 'flex', marginTop: '5%' }}>
      <Tag color="#57A9FB" label="版本更新">
        {`${update_time}day`}
      </Tag>
      <Tag color="#57A9FB" label="游戏时长">
        0hour
      </Tag>
      <Tag color="#00B42A" label="游戏资源">
        完整
      </Tag>
    </div>
  )
}

const ExtraBtn = (props: config_props): JSX.Element => {
  const select_file = (el, config, set_config): void => {
    const file_path = el.target.files[0].path
    config.game_path = file_path
    set_config({ ...config })
    window.genshin.up_config('game_path', file_path)
  }
  return (
    <Popover
      content={
        <>
          <input
            type="file"
            id="input_file"
            onChange={(el): void => select_file(el, props.config, props.set_config)}
          />
          <Button
            onClick={(): void => {
              document.getElementById('input_file')?.click()
            }}
            style={{ overflow: 'hidden' }}
            long
            type="text"
          >
            定位游戏文件
          </Button>
          <Button
            long
            type="text"
            onClick={(): void => window.genshin.start_launcher(props.config.game_path)}
          >
            拉起启动器
          </Button>
        </>
      }
    >
      <Button type="primary" icon={<IconUp />} size="large" />
    </Popover>
  )
}

const Genshin = (): JSX.Element => {
  const [configProps, setConfigProps] = useState({
    game_path: ''
  })
  const [is_loading, setLoading] = useState(false)
  useEffect(() => {
    window.genshin.read_config().then((res) => {
      setConfigProps(JSON.parse(res))
    })
  }, [])
  const is_disabled = configProps.game_path.length < 10
  return (
    <>
      <div className="head">
        <UserInfo />
        <NewsList />
      </div>
      <div className="footer">
        <TagGroup />
        <ButtonGroup className={'btn_group'}>
          <Button
            type="primary"
            disabled={is_disabled}
            onClick={(): void => {
              setLoading(true)
              window.api.start_exe(configProps.game_path)
              setTimeout(() => {
                setLoading(false)
              }, 10000)
            }}
            size="large"
            loading={is_loading}
          >
            start
          </Button>
          <ExtraBtn config={configProps} set_config={setConfigProps} />
        </ButtonGroup>
      </div>
    </>
  )
}

export default Genshin
