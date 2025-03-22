import { useState, useEffect } from "react";
import { Button, Table, Space, Modal, Form, Input, message } from "antd";
import {
  getSentList,
  //editSend,
  deleteSend,
} from "../../../api/send";
import { getUserInfo } from "../../../api/user";
import { statusTalentMap } from "../../../config/sendMap";
import { handleTime } from "../../../utils/time";
const { TextArea } = Input;
const modalTitleMap = {
  'create': "新增求职信息",
  'showDetail': "求职信息详情",
  'edit': "编辑求职信息",
  'del' : "删除求职信息",
};
export default function MySentList() {
  const [sentList, setSentList] = useState([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [imformation,setImformation] = useState<string>("");
  const [record, setRecord] = useState<Object>(null);
  const [id,setId] = useState(0)
  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [curPage,setCurPage] = useState(1)
    const [pageSize,setPageSize] = useState(10)
    const [total,setTotal] = useState(0)
  const [form] = Form.useForm();

  // 投递记录表格列
  const sentCols = [
    {
      title: "岗位名称",
      dataIndex: "jobName",
      key: "jobName",
    },
    {
        title: "投递的简历",
        dataIndex: "resumeTitle",
        key: "resumeTitle",
    },
    {
        title: "岗位发布人的账号",
        dataIndex: "toAccount",
        key: "toAccount",
    },
    {
      title: "投递时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
        title: "当前状态",
        dataIndex: "status",
        key: "status"
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {

        return (
        <Space size="middle">
          <Button
            color="primary"
            variant="solid"
            onClick={() => {
              console.log(record,'record--')
              setRecord(record)
        console.log('render函数的record',record)
        form.setFieldsValue(record)
              setId(record.id)
              setShowInfo(true)
              setImformation(record.imformation)
              setRecord({...record})
              
              //showModal("showDetail");
            }}
          >
            投递状态详情
          </Button>
          
          <Button
            color="danger"
            variant="solid"
            onClick={() => {
              console.log(record,'record--')
              setRecord({...record})
              showModal("del");
            }}
          >
            删除
          </Button>
        </Space>
      )
      }
    },
  ];
  const onPageChange = (pageNum: number) => {
    setCurPage(pageNum)
} 



  
  const showModal = (item) => {
    setCurModal(item);
  };


  useEffect(() => {
    getSentList({currentPage: curPage,fromAccount: window?.account}).then((res) => {
      if(res.status) {
      console.log(res.data.Send,'111')
      const { paginations } = res.data
      let list = handleTime(res.data.Send)
      list = list.map((item:any) => {
        return {
            ...item,
            resumeTitle: item.Resume.resumeTitle,
            jobName: item.Job.name,
            status: statusTalentMap[item.status]
        }
      })
      //setCurPage(paginations.currentPage)
      setPageSize(paginations.pageSize)
      setTotal(paginations.total)
      setSentList(list)
  }
})
  }, [curPage,pageSize]);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "75%" }}>
        
        <Table
          dataSource={sentList}
          columns={sentCols}
          style={{ flex: "1" }}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 10,
            total,
            position: ['bottomCenter'],
            onChange: onPageChange
        }}         
        />
      </div>
      <Modal
      title={"当前状态详情"}
      open={showInfo !== false}
      onCancel={() => {
        setShowInfo(false)
        setImformation('')
    }}
    cancelText="取消"
        okText="确认"
      >
        <p>{imformation || "暂无"}</p>
      </Modal>
      {/* <Modal
        title={modalTitleMap[curModal]}
        open={curModal !== ""}
        onOk={okOpretionMap[curModal]}
        onCancel={() => {form.validateFields()
          // eslint-disable-next-line @typescript-eslint/no-shadow
          .then(() => {
          form.setFieldsValue({title: '',content: ''}); // 离开时清除表单数据
          });
          setTitle(''); setContent(''); setRecord({});setCurModal(""); }}
        cancelText="取消"
        okText="确认"
      >
        {curModal === "create" && (
          <Form form={form} layout="horizontal">
            <Form.Item label="标题" name="title">
              <Input />
            </Form.Item>
            <Form.Item label="内容" name="content">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        )}

        { curModal === "edit" && (
          record && 
          <Form form={form} layout="horizontal" key={id} initialValues={record}>
            <Form.Item label="标题" name="title">
              <Input   onChange={(e) => {setTitle(e.target.value); form.setFieldValue('title',e.target.value) } }/>
            </Form.Item>
            <Form.Item label="内容" name="content">
              <TextArea rows={4}    onChange={(e) => {setContent(e.target.value); form.setFieldValue('content',e.target.value) } }/>
            </Form.Item>
          </Form>
        )}
        { curModal === "showDetail" && ( 
          record && 
          <Form form={form} layout="horizontal" key={id} initialValues={record}>
            <Form.Item label="标题" name="title">
              <Input  disabled={true} />
            </Form.Item>
            <Form.Item label="内容" name="content">
              <TextArea rows={4}    disabled={true} />
            </Form.Item>
          </Form>
        )}
        {curModal === "del" && `确认删除id为${record?.id}的求职申请记录吗`}
      </Modal> */}
    </>
  );
}
