import { useEffect, useState } from 'react'
import { Routes, Route,useNavigate,useLocation,useParams } from "react-router-dom"; 
import PublishedJobDetail from '../components/PublishedJobDetail'
import PublishedJobList from '../components/PublishedJobList';
export default function PublishedJobs() {
    const navigator = useNavigate()
    const {id} = useParams()
    const [publishedId,setPublishedId] = useState(0)
    const handleIdChange = (id) => {
        setPublishedId(id)
    }
    useEffect(() => {
        if(id) {
            setPublishedId(id)
            return
        }
        setPublishedId(0) 
        // getAppliesList().then((res) => {
        //     if(res.status) {
        //     console.log(res.data.Applys,'111')
        //     let list = handleTime(res.data.Applys)
        //     setAppliedList(list)
        // }
        // }
        // )
    },[id])
    return (
        <>
        {
            publishedId ? 
                <PublishedJobDetail></PublishedJobDetail>
                :
        <>
        <PublishedJobList onIdChange={handleIdChange}></PublishedJobList>
        {/* <div style={{display: 'flex',flexDirection: 'column', width:"100%"}}>
            <Flex justify='center' align='center'>
                <Input></Input>
                <Button style={{}} >搜索</Button>
            </Flex>
             
              <Table dataSource={appliedList} columns={appliedJobsCols} 
             rowKey={(record) => record.id}
             style={{flex: '1'}}
             onRow={(record) => {
                return {
                  onClick: (event) => {
                    
                    const id = record.id
                    console.log(id,'nn')
                    navigator(`/appliedJobList/${id}`)
                    setAppliedId(id)
                  }, // 点击行
                  
                }
            }}
            />     
            </div> */}
             </>
        }
        </>
    )
}