import { useEffect, useState } from 'react'
import { Flex,Row,Tag,Divider,Empty } from 'antd'
import {useParams} from 'react-router-dom'
import { getApplyDetail } from '../api/apply'
import {handleTime} from '../utils/time'
import '../style/main.css'
export default function AppliedJobDetail() {
    const {id} = useParams()
    const [title,setTitle] = useState('')
    const [publishedTime,setPublishedTime] = useState<string>('')
    const [account,setAccount] = useState<string>('')
    const [content,setContent] = useState<string>('')
    const [isEmpty,setIsEmpty] = useState<string>(false)
    let arr
    useEffect(() => {
      if(id) {
        console.log(id,'curId')
        getApplyDetail({id}).then(res => {
            if(res.status) {
                if(res.data.Applys.length === 0) {
                    setIsEmpty(true)
                    return
                }
                arr = handleTime(res.data.Applys)
                setTitle(arr[0].title)
                setAccount(arr[0].account)
                setContent(arr[0].content)
                setPublishedTime(arr[0].createdAt)
            }
        })
      }
    },[id])
    if(isEmpty) 
    return <Empty/>
    return (
        <div style={{color: 'black'}}>
          <h2 style={{textAlign: 'left',lineHeight: '1' }}>求职信息详情</h2>  
          <Divider/>
          <h2 style={{lineHeight: '1' }}>{title}</h2>
          <Flex justify='space-around'>
<h3 style={{lineHeight: '1' }}>发布时间: {publishedTime}</h3>
<h3 style={{lineHeight: '1' }}>发布人: {account}</h3>
          </Flex>
          
          <p>{content}</p>
        </div>
    )
}