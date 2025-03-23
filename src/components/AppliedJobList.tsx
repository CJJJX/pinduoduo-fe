import { useEffect, useState } from 'react'
import {Input,Button,Table,Form } from 'antd'
import {getAppliesList} from '../api/apply'
import {handleTime} from '../utils/time'
import { useNavigate } from "react-router-dom";
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
    const [form] = Form.useForm()
    const handleItemClick = (id: number) => {
         onIdChange(id)
    }
    const onPageChange = (pageNum: number) => {
        setCurPage(pageNum)
    }
    const handleSearch = async () => {
        const values = await form.validateFields();
        console.log(values,'搜索框的values..')
        getAppliesList({currentPage: curPage,...values}).then((res: any) => {
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
    } 
    useEffect(() => {
        // if(id) {
        //     setAppliedId(id)
        //     return
        // }
        // setAppliedId(0) 
        getAppliesList({currentPage: curPage}).then((res: any) => {
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
         <Form form={form} layout='inline'>
         <Form.Item label="求职标题" name="title">
                <Input/>
            </Form.Item>
         <Button onClick={handleSearch}>搜索</Button>
             <Button onClick={() => form.resetFields()}>重置</Button>    
            </Form>
              <Table dataSource={appliedList} columns={appliedJobsCols} 
             rowKey={(record) => record.id}
             style={{flex: '1'}}
             onRow={(record) => {
                return {
                  onClick: () => {
                    
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