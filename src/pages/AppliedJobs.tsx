import { useEffect, useState } from 'react'
import {Space,Button,Table,Flex,Input} from 'antd'
import {getAppliesList} from '../api/apply'
import {handleTime} from '../utils/time'
import { Routes, Route,useNavigate,useLocation,useParams } from "react-router-dom"; 
import AppliedJobDetail from '../components/AppliedJobDetail'
import AppliedJobList from '../components/AppliedJobList';
// 求职信息表格列
const appliedJobsCols = [
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
    },
    {
        title: '发布人',
        dataIndex: 'account',
        key: 'account'
    },
    {
        title: '发布时间',
        dataIndex: 'createdAt',
        key: 'createdAt'
    },
    // {
    //     title: '操作',
    //     dataIndex: 'action',
    //     key: 'action',
    //     render: () => (
    //         <Space size="middle">
    //             <Button color="primary" variant="solid">详情</Button>
    //             <Button color="default" variant="solid">编辑</Button>
    //             <Button color="danger" variant="solid">删除</Button>
    //         </Space>
    //     )
    // }
  ]
export default function AppliedJobs() {
    const navigator = useNavigate()
    const location = useLocation()
    const {id} = useParams()
    const [appliedId,setAppliedId] = useState(0)
    const handleIdChange = (id) => {
        setAppliedId(id)
    }
    useEffect(() => {
        if(id) {
            setAppliedId(id)
            return
        }
        setAppliedId(0) 
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
            appliedId ? 
                <AppliedJobDetail></AppliedJobDetail>
                :
        <>
        <AppliedJobList onIdChange={handleIdChange}></AppliedJobList>
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