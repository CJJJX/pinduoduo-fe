import { useEffect, useState } from 'react'
import {Flex,Input,Button,Table,Pagination } from 'antd'
import {getAppliesList} from '../api/apply'
import {handleTime} from '../utils/time'
import { Routes, Route,useNavigate,useLocation,useParams } from "react-router-dom";
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
  ]
  
export default function AppliedJobList({ onIdChange }) {
    const navigator = useNavigate()
    const [appliedList,setAppliedList] = useState([])
    const [curPage,setCurPage] = useState(1)
    const [pageSize,setPageSize] = useState(10)
    const [total,setTotal] = useState(0)
    const handleItemClick = (id) => {
         onIdChange(id)
    }
    const onPageChange = (pageNum: number) => {
        setCurPage(pageNum)
    } 
    useEffect(() => {
        // if(id) {
        //     setAppliedId(id)
        //     return
        // }
        // setAppliedId(0) 
        getAppliesList({currentPage: curPage}).then((res) => {
            if(res.status) {
            console.log(res.data.Applys,'111')
            const { paginations } = res.data
            let list = handleTime(res.data.Applys)
            //setCurPage(paginations.currentPage)
            setPageSize(paginations.pageSize)
            setTotal(paginations.total)
            setAppliedList(list)
        }
        }
        )
    },[curPage,pageSize])
    return (
        <>
         <div style={{display: 'flex',flexDirection: 'column', width:"100%"}}>
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
                    handleItemClick(id)
                  }, // 点击行
                  
                }
            }}
            pagination={{
                pageSize: 10,
                total,
                position: ['bottomCenter'],
                onChange: onPageChange
            }}           
            />     
            </div>
        </>
    )
}