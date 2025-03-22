import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Space,
  Form,
  Modal,
  Input,
  Select,
  Upload,
  message,
  DatePicker,
  Icon,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { jobTypeMap,jobTypeMapReverse } from "../../../config/publishMap";
import { getUserInfo } from "../../../api/user";
import { getResumeList, createResume,deleteResume,editResume } from "../../../api/resume";
import dayjs from "dayjs";

//import  DatePicker  from "../../../components/DatePicker";
//import moment from "moment";
// import format from 'moment'
import customParseFormat from "dayjs/plugin/customParseFormat";
import { handleTime } from "../../../utils/time";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

dayjs.extend(customParseFormat);
dayjs.locale("zh-cn");
const dateFormat = "YYYY-MM-DD";
const { TextArea } = Input;
const modalTitleMap = {
    'create': "新增简历",
    'showDetail': "简历信息详情",
    'edit': "编辑简历信息",
    'del' : "删除简历",
  };


export default function MyResumeList() {
  // 简历信息表格列
  const resumeInfoCols = [
    {
      title: "标题",
      dataIndex: "resumeTitle",
      key: "resumeTitle",
    },
    {
      title: "求职意向",
      dataIndex: "likeJobType",
      key: "likeJobType",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_,record) => (
        <Space size="middle">
          <Button
            color="primary"
            variant="solid"
            onClick={() => {
                // 需处理数据库中的字段birthday(string)类型改为dayjs类型,因datePicker组件要求传入dayjs类型，否则渲染时报错
                const newRecord = {
                    ...record,
                    birthday: dayjs(record.birthday)
                }
          form.setFieldsValue(newRecord)
                setImgUrl(record.pictureUrl)
                setLikeJobType(record.likeJobType)
                setDateStr(newRecord.birthday)
                setRecord(newRecord)
                setCurModal('showDetail')
                
            }}
          >
            详情
          </Button>
          <Button
            color="default"
            variant="solid"
            onClick={() => {
                // 需处理数据库中的字段birthday(string)类型改为dayjs类型,因datePicker组件要求传入dayjs类型，否则渲染时报错
                const newRecord = {
                    ...record,
                    birthday: dayjs(record.birthday)
                }
                console.log(likeJobType,'编辑的likeJobType')
                form.setFieldsValue(newRecord)
                setImgUrl(record.pictureUrl)
                setLikeJobType(record.likeJobType)
                setDateStr(newRecord.birthday)
                setRecord(newRecord)
                setCurModal('edit')
        

            }}
          >
            编辑
          </Button>
          <Button
            color="danger"
            variant="solid"
            onClick={() => {
                setRecord({...record})
                setCurModal('del')
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const [resumeList, setResumeList] = useState([]);
  const [curModal, setCurModal] = useState<string>("");
  const [resumeTitle,setResumeTitle] = useState<string>("");
  const [authorName,setAuthorName] = useState<string>("");
  const [tel,setTel] = useState<string>("");
  const [email,setEmail] = useState<string>("");
  const [description,setDescription] = useState<string>("");
  const [likeJobType,setLikeJobType] = useState<number>(0);
  const [dateStr, setDateStr] = useState("");
  const [record, setRecord] = useState<Object>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [curPage,setCurPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  const [total,setTotal] = useState(0)
  const onPageChange = (pageNum: number) => {
    setCurPage(pageNum)
} 
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </button>
  );
  const handleShowDetail = () => {
    form.validateFields()
    // eslint-disable-next-line @typescript-eslint/no-shadow
    .then(() => {
    form.setFieldsValue({ResumeTitle: '',AuthorName: '',pictureUrl: '',tel: '',email: '',likeJobType: 0,birthday: '',description: '',}); // 离开时清除表单数据
    })
    // setTitle(''); 
    // setContent('');
    setImgUrl('');
    setRecord(null);
    setCurModal(""); 
  };
  const handleEdit = async () => {
   const id = record?.id;
   // 数据库字段birthday存储的是string类型，组件库当前使用的是dayjs类型，需转换会string类型!
   // 展示editModal的状态：若不编辑likeJobtype字段，则该字段值为string不为number,新添likeJobTypeMap的反映射map
   const newRecord = {
    ...record,
    resumeTitle,
    authorName,
    tel,
    email,
    description, 
    pictureUrl: imgUrl ? imgUrl : record?.pictureUrl, // edit上传新照片后替换原照片,仅删除原照片未上传新照片下次仍展示原照片
    birthday: dateStr,
    likeJobType: typeof likeJobType !== 'number' ?  jobTypeMapReverse[likeJobType] : likeJobType
   }
   // TODO：现在likejobType为文字--,点开编辑弹窗，不编辑likeJobtype字段，则改字段为文字不为数字
   console.log(newRecord,'00000')
   const res = await editResume(id,newRecord);
    console.log(res);
    if (res.status) {
      message.success(res.message);
    }else {
      message.error(res.message);
    }
    setCurModal("");
  };
  const handleDel = async () => {
    const id = record?.id;
    const res = await deleteResume(id);
    console.log(res);
    if (res.status) {
      message.success(res.message);
    }
    setCurModal("");
  };
  
  const handleCreateResume = async () => {
    const values = await form.validateFields();
    const rsp = await getUserInfo();
    if (!rsp.status) {
      console.log("创建失败");
      message.error("创建失败");
      return;
    }
    const { account } = rsp.data;
    const res = await createResume({ ...values, likeJobType, account,pictureUrl: imgUrl });
    console.log(values, "resumeVal--");
    if (res.status) {
        message.success(res.message);
    }else {
        message.error(res.message);
    }
    setCurModal("");
  };
  const okOpretionMap = {
    'create': handleCreateResume,
    'showDetail': handleShowDetail,
    'edit': handleEdit,
    'del': handleDel,
  }
  const handleChooseLikeJobType = (likeJobTypeKey) => {
    console.log(likeJobTypeKey,'likeJobTypeKey')
    setLikeJobType(Number(likeJobTypeKey));
  };
  // 删除图片
  const handleRemove = () => {
    setImgUrl("");
  };
  
  const beforeUpload = (file: any) => {
     //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //     if (!isJpgOrPng) {
  //       message.error('You can only upload JPG/PNG file!');
  //     }
  //     const isLt2M = file.size / 1024 / 1024 < 2;
  //     if (!isLt2M) {
  //       message.error('Image must smaller than 2MB!');
  //     }
  //     return isJpgOrPng && isLt2M;
    return new Promise((resolve, reject) => {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = () => {
        setLoading(true);
      };
      reader.onload = () => {
        const base64Str = reader.result;
        setImgUrl(base64Str as string);
        setLoading(false);
        resolve(false); // 后续表单提交才处理上传到数据库的操作，否则控制台打印post错误
      };
      reader.onerror = (error) => reject(error);
    });
  };
  useEffect(() => {
    if(curModal !== '')
    return
console.log(dayjs("2000-09-03",dateFormat),typeof dayjs("2000-09-03",dateFormat))
    // console.log(
    //   Object.entries(jobTypeMap).map(([key, val]) => ({
    //     label: val,
    //     value: val,
    //   }))
    // );
    getResumeList({currentPage: curPage,account: window?.account}).then((res) => {
      if (res.status) {
        const { paginations } = res.data
        let resumeList = res.data.Resume;
        resumeList = handleTime(resumeList);
        resumeList = resumeList.map((item) => ({
          ...item,
          likeJobType: jobTypeMap[item.likeJobType],
        }));
        setPageSize(paginations.pageSize)
        setTotal(paginations.total)
        setResumeList(resumeList);
      }
      console.log(res, "简历列表res--");
    });
  }, [curModal,curPage,pageSize]);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "75%" }}>
        <Button
          style={{ width: "15%", marginBottom: "10px" }}
          onClick={() => setCurModal("create")}
        >
          创建简历
        </Button>
        <Table
          dataSource={resumeList}
          columns={resumeInfoCols}
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
          onCancel={() => {
            form.validateFields()
          // eslint-disable-next-line @typescript-eslint/no-shadow
          .then(() => {
          form.setFieldsValue({resumeTitle: '',authorName: '',pictureUrl: '',tel: '',email: '',likeJobType: 0,birthday: '',description: ''}); // 离开时清除表单数据
          });
          setImgUrl('')
            setCurModal("")
          }}
          cancelText="取消"
          okText="提交"
        >
            {curModal === "create" && (
                <Form form={form} layout="horizontal" >
            <Form.Item label="简历标题" name="resumeTitle">
              <Input />
            </Form.Item>
            <Form.Item label="简历作者" name="authorName">
              <Input />
            </Form.Item>
            <Form.Item label="个人照片" name="pictureUrl">
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept="image/*"
                beforeUpload={beforeUpload}
              >
                {imgUrl ? (
                  <div>
                    <img
                      alt="resumePicture"
                      style={{ width: "100%" }}
                      src={imgUrl}
                    />
                    <DeleteOutlined
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        cursor: "pointer",
                        color: "red",
                        fontSize: "16px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "50%",
                        padding: "2px",
                      }}
                      onClick={() => handleRemove()}
                    />
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            
            <Form.Item label="联系电话" name="tel">
              <Input />
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="意向岗位类型" name="likeJobType">
              <Select
                defaultValue="综合类"
                style={{ width: 120 }}
                onChange={handleChooseLikeJobType}
                options={Object.entries(jobTypeMap).map(([key, val]) => ({
                  label: val,
                  value: key,
                }))}
              />
            </Form.Item>
            <Form.Item label="出生日期" name="birthday">
                {
                 //  typeof dayjs("2000-09-03",dateFormat) === 'object' && 
                   <DatePicker
                defaultValue={dayjs("2000-09-03",dateFormat)}
                minDate={dayjs("1949-10-01",dateFormat)}
                maxDate={dayjs("2020-10-31",dateFormat)}
                format={dateFormat}
                onChange={(date, dateStr) => {
                  console.log(date, dateStr);
                  setDateStr(dateStr as string);
                }}
              />
                }
              
              
            </Form.Item>
            <Form.Item label="个人优势" name="description">
              <TextArea rows={10} />
            </Form.Item>

            
          </Form>
            )}
            {(curModal === "edit" || curModal === 'showDetail') && (
                record &&
                <Form form={form} layout="horizontal" key={record?.id} initialValues={record}>
            <Form.Item label="简历标题" name="resumeTitle">
              <Input 
               disabled={curModal === 'showDetail'}
              onChange={(e) => {
                setResumeTitle(e.target.value)
                form.setFieldValue('resumeTitle',e.target.value) } }/>
            </Form.Item>
            <Form.Item label="简历作者" name="authorName">
              <Input  
               disabled={curModal === 'showDetail'}
              onChange={(e) => {
                setAuthorName(e.target.value)
                form.setFieldValue('authorName',e.target.value) } }/>
            </Form.Item>
            <Form.Item label="个人照片" name="pictureUrl">
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept="image/*"
                beforeUpload={beforeUpload}
                disabled={curModal === 'showDetail'} 
              >
                {imgUrl ? (
                  <div>
                    <img
                      alt="resumePicture"
                      style={{ width: "100%" }}
                      src={imgUrl}
                    />
                    {
                      curModal !== 'showDetail' &&  <DeleteOutlined
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        cursor: "pointer",
                        color: "red",
                        fontSize: "16px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "50%",
                        padding: "2px",
                      }}
                      onClick={() => handleRemove()}
                    />
                    }
                    
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item label="联系电话" name="tel">
              <Input disabled={curModal === 'showDetail'} onChange={(e) => { 
                setTel(e.target.value)
                form.setFieldValue('tel',e.target.value) } }/>
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input disabled={curModal === 'showDetail'} onChange={(e) => {
                setEmail(e.target.value)
                form.setFieldValue('email',e.target.value) } }/>
            </Form.Item>
            <Form.Item label="意向岗位类型" name="likeJobType">
           
              <Select
                defaultValue="综合类"
                style={{ width: 120 }}
                onChange={handleChooseLikeJobType}
                options={Object.entries(jobTypeMap).map(([key, val]) => ({
                  label: val,
                  value: key,
                }))}
                disabled={curModal === 'showDetail'}
                value={() => jobTypeMap[likeJobType]}
              />

            
            </Form.Item>
            <Form.Item label="出生日期" name="birthday">
                
              <DatePicker
                //defaultValue={dayjs("2000-09-03")}//, dateFormat
                //defaultValue={moment("2000-09-03")}

                //minDate={dayjs("1949-10-01")} // Todo: 这里用dayjs组件库报错
                minDate={dayjs("1949-10-01")}// , dateFormat
                maxDate={dayjs("2020-10-31")}// , dateFormat
                format={dateFormat}
                onChange={(date, dateStr) => {
                  console.log(date, dateStr);
                  setDateStr(dateStr as string);
                }}
                value={dayjs(dateStr)}
                //value={moment(dateStr)}
                disabled={curModal === 'showDetail'}
              />
              
            </Form.Item>
            <Form.Item label="个人优势" name="description">
              <TextArea rows={10} disabled={curModal === 'showDetail'}  onChange={(e) => {
                setDescription(e.target.value); 
                form.setFieldValue('description',e.target.value) } }
                 />
            </Form.Item>

            
          </Form>
            )}
          {curModal === "del" && `确认删除id为${record?.id}的简历吗`}
        </Modal>
      
    </>
  );
}
