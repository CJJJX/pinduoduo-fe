import { useEffect, useState } from 'react'
import {Input,Button,Table,Form,Select } from 'antd'
import { useNavigate } from "react-router-dom";
import {handleTime} from '../utils/time'
import {getPublishList} from '../api/job'
import {collegeMap,jobTypeMap,degreeMap} from '../config/publishMap'

// 有无笔试选择框数组
const haveWrittenExamOptions = [
    {label: "无",value: 0},
    {label: "有",value: 1}
]
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

    const [form] = Form.useForm();

    const handleItemClick = (id: number) => {
        onIdChange(id)
   }
   const onPageChange = (pageNum: number) => {
       setCurPage(pageNum)
   }
   const handleChooseJobType = (JobTypeKey:number) => {
    console.log(JobTypeKey,'JobTypeKey')
    form.setFieldValue('jobType',JobTypeKey)
  };
  const handleChooseCollege = (collegeKey: any) => {
    console.log(collegeKey,'collegeKey')
    form.setFieldValue('fromCollege',collegeKey)
  }
  const handleChooseDegree = (degreeKey: any) => {
    console.log(degreeKey,'degreeKey')
    form.setFieldValue('degree',degreeKey)
  }
  const handleChooseHaveWrittenExam = (haveWrittenExamKey: number) => {
    console.log(typeof haveWrittenExamKey,'haveWrittenExamKey为number类型')
    form.setFieldValue('haveWrittenExam',haveWrittenExamKey)
  }
   const handleSearch = async () => {
    const values = await form.validateFields();
    console.log(values,'搜索框的values..')
    getPublishList({currentPage: curPage,...values}).then((res: any) => {
        if(res.status) {
        console.log(res.data.Jobs,'111')
        const { paginations } = res.data
        let list = handleTime(res.data.Jobs)
        list = list.map((item:any) => ({
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
   } 
   useEffect(() => {
    getPublishList({currentPage: curPage}).then((res:any) => {
        if(res.status) {
        console.log(res.data.Jobs,'111')
        const { paginations } = res.data
        let list = handleTime(res.data.Jobs)
        list = list.map((item:any) => ({
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
            <Form form={form} layout='inline'>
            <Form.Item label="意向岗位类型" name="jobType">
              <Select
                defaultValue={0}
                style={{ width: 120 }}
                onChange={handleChooseJobType}
                options={Object.entries(jobTypeMap).map(([key, val]) => ({
                  label: val,
                  value: Number(key),// 将 key 转换为 number,map的key会默认将数字转为字符串故需要转换回number类型
                }))}
              />
            </Form.Item>
            <Form.Item label="下属学院" name="fromCollege">
              <Select
                defaultValue={0}
                style={{ width: 120 }}
                onChange={handleChooseCollege}
                options={Object.entries(collegeMap).map(([key, val]) => ({
                  label: val,
                  value: Number(key),// 将 key 转换为 number,map的key会默认将数字转为字符串故需要转换回number类型
                }))}
              />
            </Form.Item>
            <Form.Item label="要求最低学历" name="degree">
              <Select
                defaultValue={0}
                style={{ width: 120 }}
                onChange={handleChooseDegree}
                options={Object.entries(degreeMap).map(([key, val]) => ({
                    label: val,
                    value: Number(key),// 将 key 转换为 number,map的key会默认将数字转为字符串故需要转换回number类型
                  }))}
              />
            </Form.Item>
            <Form.Item label="有无笔试环节" name="haveWrittenExam">
              <Select
                defaultValue={0}
                style={{ width: 120 }}
                onChange={handleChooseHaveWrittenExam}
                options={haveWrittenExamOptions}
              />
            </Form.Item>
            <Form.Item label="岗位名称" name="name">
                <Input/>
            </Form.Item>
             <Button onClick={handleSearch}>搜索</Button>
             <Button onClick={() => form.resetFields()}>重置</Button>    
            </Form>
              <Table dataSource={publishedList} columns={publishedJobsCols} 
             rowKey={(record) => record.id}
             style={{flex: '1'}}
             onRow={(record) => {
                return {
                  onClick: () => {
                    
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