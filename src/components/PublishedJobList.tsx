import { useEffect, useState } from 'react'
import {Flex,Input,Button,Table,Pagination } from 'antd'
import { Routes, Route,useNavigate,useLocation,useParams } from "react-router-dom";
import {handleTime} from '../utils/time'
import {getPublishList} from '../api/job'
import {collegeMap,jobTypeMap,degreeMap} from '../config/publishMap'
// 求职信息表格列
const publishedJobsCols = [
    {
        title: '岗位名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '所属分类',
        dataIndex: 'jobType',
        key: 'jobType'
    },
    {
        title: '下属学院',
        dataIndex: 'fromCollege',
        key: 'fromCollege'
    },
    {
        title: '联系方式',
        dataIndex: 'publishAccount',
        key: 'publishAccount'
    },
    {
        title: '要求最低学历',
        dataIndex: 'degree',
        key: 'degree'
    },
    {
        title: '发布时间',
        dataIndex: 'createdAt',
        key: 'createdAt'
    }
  ]
export default function PublishedJobList({onIdChange}) {
    const navigator = useNavigate()
    const [publishedList,setPublishedList] = useState([])
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
    getPublishList({currentPage: curPage}).then((res) => {
        if(res.status) {
        console.log(res.data.Jobs,'111')
        const { paginations } = res.data
        let list = handleTime(res.data.Jobs)
        list = list.map(item => ({
            ...item,
            jobType: jobTypeMap[item.jobType],
            degree: degreeMap[item.degree],
            fromCollege: collegeMap[item.fromCollege]
        }))
        //setCurPage(paginations.currentPage)
        setPageSize(paginations.pageSize)
        setTotal(paginations.total)
        setPublishedList(list)
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
             
              <Table dataSource={publishedList} columns={publishedJobsCols} 
             rowKey={(record) => record.id}
             style={{flex: '1'}}
             onRow={(record) => {
                return {
                  onClick: (event) => {
                    
                    const id = record.id
                    console.log(id,'nn')
                    navigator(`/publishedJobList/${id}`)
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