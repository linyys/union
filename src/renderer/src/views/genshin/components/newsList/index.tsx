import { Carousel, Timeline } from '@arco-design/web-react'
import TimelineItem from '@arco-design/web-react/es/Timeline/item'
import { useEffect, useState } from 'react'
import './index.css'

interface act_data {
  card_list: Array<{
    subject: string
    images: string
  }>
  act_list: Array<{
    subject: string
    time: string
  }>
}

const NewsList = (): JSX.Element => {
  const [ActList, setActList] = useState<act_data>({ card_list: [], act_list: [] })
  useEffect(() => {
    window.genshin.get_act().then((res) => {
      setActList(res)
    })
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TimelineItemDom = (): Array<any> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node_arr: Array<any> = []
    const date: number = new Date().getTime()
    ActList.act_list.map((item, index) => {
      const start_time = item.time[0]
      const end_time = item.time[1]
      const time = `${start_time} ~ ${end_time}`
      if (start_time.length > 2) {
        const end_time_c = new Date(end_time).getTime()
        let color
        let dot_color
        if (date > end_time_c) {
          color = '#C9CDD4'
          dot_color = '#C9CDD4'
        } else if (end_time_c - date < 86400000 * 2) {
          dot_color = '#F7BA1E'
        }
        node_arr.push(
          <TimelineItem
            dotColor={dot_color}
            key={index}
            label={<span style={{ color }}>{time}</span>}
          >
            <span style={{ color }}>{item.subject}</span>
          </TimelineItem>
        )
      } else {
        node_arr.push(
          <TimelineItem key={index} label={time}>
            {item.subject}
          </TimelineItem>
        )
      }
    })
    return node_arr
  }
  return (
    <div className="newslist">
      <div className="newslist_card">
        <Carousel autoPlay style={{ height: 140 }}>
          {ActList.card_list.map((item, index) => (
            <div key={index}>
              <img src={item.images} style={{ width: '100%', height: '100%' }} />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="newslist_task">
        <Timeline>{...TimelineItemDom()}</Timeline>
      </div>
    </div>
  )
}

export default NewsList
