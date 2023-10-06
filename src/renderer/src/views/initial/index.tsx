import { useNavigate } from 'react-router'
import './index.css'
import { Button, Spin } from '@arco-design/web-react'
import { useState } from 'react'
const initialize = (navigate, set_loading): void => {
  set_loading(true)
  window.api.initialize().then(() => {
    setTimeout(() => {
      set_loading(false)
      navigate('/home/genshin')
    }, 1000)
  })
}
const initial = (): JSX.Element => {
  const navigate = useNavigate()
  const [is_loading, set_loading] = useState(false)
  return (
    <div className="initial_box">
      <Spin loading={is_loading}>
        <p>{'即将初始化配置...'}</p>
        <Button type="primary" onClick={(): void => initialize(navigate, set_loading)}>
          Go
        </Button>
      </Spin>
    </div>
  )
}

export default initial
