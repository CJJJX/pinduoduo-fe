import { useState, useEffect } from "react";
import { Button, Table, Space, Modal, Form, Input, message } from "antd";
import {
  createApply,
  getAppliesList,
  editApply,
  deleteApply,
} from "../../../api/apply";
import { getUserInfo } from "../../../api/user";
import { handleTime } from "../../../utils/time";
const { TextArea } = Input;
const modalTitleMap = {
  'create': "新增求职信息",
  'showDetail': "求职信息详情",
  'edit': "编辑求职信息",
  'del' : "删除求职信息",
};
export default function MyAppliedList() {
  const [appliedList, setAppliedList] = useState([]);
  const [curModal, setCurModal] = useState<string>(""); // '新增' '详情' '编辑' '删除'
  const [record, setRecord] = useState<Object>(null);
  const [id,setId] = useState(0)
  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [curPage,setCurPage] = useState(1)
    const [pageSize,setPageSize] = useState(10)
    const [total,setTotal] = useState(0)
  const [form] = Form.useForm();

  // 求职信息表格列
  const appliedJobsCols = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "发布时间",
      dataIndex: "createdAt",
      key: "createdAt",
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
              setTitle(record.title)
              setContent(record.content)
              setId(record.id)
              setCurModal('showDetail')
              setRecord({...record})
              
              //showModal("showDetail");
            }}
          >
            详情
          </Button>
          <Button
            color="default"
            variant="solid"
            onClick={() => {
                console.log(record,'record--')
                console.log(record,'record--')
              setRecord(record)
        console.log('render函数的record',record)
        form.setFieldsValue(record)
                setTitle(record.title)
              setContent(record.content)
              setId(record.id)
              showModal("edit");
                setRecord({...record})
              
            }}
          >
            编辑
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
  const handleShowApply = () => {
    form.validateFields()
    // eslint-disable-next-line @typescript-eslint/no-shadow
    .then(values => {
    form.setFieldsValue({title: '',content: ''}); // 离开时清除表单数据
    })
    setTitle(''); setContent('');setId(0);setRecord(null);setCurModal(""); 
  }
  const handleDel = async () => {
    console.log(record?.id, "del--");
    const id = record?.id;
    const res = await deleteApply(id);
    console.log(res);
    if (res.status) {
      message.success(res.message);
    }
    setCurModal("");
  };
  const handleEdit = async () => {
    const id = record?.id;
    const newRecord = {title,content}
    console.log(newRecord,'newRecord--')
    const res = await editApply(id,newRecord);
    console.log(res);
    //message.success(res)
    setTitle('')
      setContent('')
      setId(0)
      setRecord(null)
    setCurModal("");
  };
  // 获取求职申请列表
  const getApplies = async (obj) => {
    const account = window?.account;
    console.log("接口拿到的account", account);
    const res = await getAppliesList({ account });
    console.log(res, "res--");
    return res;
  };
  // 创建求职申请
  const handleCreateApply = async () => {
    try {
      const values = await form.validateFields();
      console.log(values, "values--");
      const rsp = await getUserInfo();
      if (!rsp.status) {
        console.log("创建失败");
        return;
      }
      const { account } = rsp.data;
      const res = await createApply({ ...values, account });
      console.log(res, "创建apply的结果");
      setTitle('')
      setContent('')
      setRecord(null)
      setCurModal("");
    } catch (err) {
      console.log(err, "err--");
    }
  };
  const showModal = (item) => {
    setCurModal(item);
  };
  const okOpretionMap = {
    'create': handleCreateApply,
    'showDetail': handleShowApply,
    'edit': handleEdit,
    'del': handleDel,
  };

  useEffect(() => {
    if(curModal !== '')
    return
    getAppliesList({currentPage: curPage,account: window?.account}).then((res) => {
      if(res.status) {
      console.log(res.data.Applys,'111')
      const { paginations } = res.data
      let list = handleTime(res.data.Applys)
      //setCurPage(paginations.currentPage)
      setPageSize(paginations.pageSize)
      setTotal(paginations.total)
      setAppliedList(list)
  }
})
  }, [curModal,curPage,pageSize]);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "75%" }}>
        <Button
          style={{ width: "15%", marginBottom: "10px" }}
          onClick={() => setCurModal("create")}
        >
          新增求职
        </Button>
        <Table
          dataSource={appliedList}
          columns={appliedJobsCols}
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
      </Modal>
    </>
  );
}
