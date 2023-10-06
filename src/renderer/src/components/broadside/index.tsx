import { Outlet } from 'react-router-dom'
import './index.css'
const broadside = (): JSX.Element => {
  return (
    <div className="broadside">
      <div className="broadside_menu"></div>
      <div className="broadside_main">
        <Outlet />
      </div>
    </div>
  )
}

export default broadside
