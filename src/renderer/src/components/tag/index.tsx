import { ReactNode } from 'react'
import './index.css'
const Tag = (props: { children: ReactNode; color: string; label: string }): JSX.Element => {
  return (
    <div className="tag">
      <div className="tag_dot">
        <div className="tag_core" style={{ backgroundColor: props.color }}></div>
      </div>
      <div className="tag_label">
        <p className="label_small">{props.label}</p>
        <p className="label_main">{props.children}</p>
      </div>
    </div>
  )
}

export default Tag
