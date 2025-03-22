import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
import {
  getSentList,
  editSent,
  deleteSend,
} from "../../../api/send";
import { getResumeDetail } from "../../../api/resume";
import { getUserInfo } from "../../../api/user";
import { statusSchoolMap } from "../../../config/sendMap";
import { jobTypeMap } from "../../../config/publishMap";
import { handleTime } from "../../../utils/time";
const { TextArea } = Input;
export default function MyReceivedList() {
  // 投递处理表格列
  const receivedCols = [
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
      title: "投递人账号",
      dataIndex: "fromAccount",
      key: "fromAccount",
    },
    {
      title: "投递时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "当前状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record: any) => {
        return (
          <Space size="middle">
            <Button
              color="primary"
              variant="solid"
              onClick={() => {
                console.log(record, "record--");
                form.setFieldsValue(record);
                setRecord({ ...record });
                setCurModal("status");
              }}
            >
              更新投递处理状态
            </Button>

            <Button
              color="default"
              variant="solid"
              onClick={() => {
                console.log(record, "record--");
                setRecord({ ...record });
                setCurModal("resume");
              }}
            >
              查看简历
            </Button>
          </Space>
        );
      },
    },
  ];
  const [receivedList, setReceivedList] = useState([]);
  const [record, setRecord] = useState({});
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [curModal, setCurModal] = useState<string>(""); // "status",resume"
  const [resumeRecord, setResumeRecord] = useState({});
  const [form] = Form.useForm();
  const onPageChange = (pageNum: number) => {
    setCurPage(pageNum);
  };
  const handleChooseStatus = (value, item) => {
    console.log(value, item, "--status", typeof value);
    console.log(form.getFieldValue("status"), "form的status");
  };
  const handleUpdateStatus = async () => {
    const status = form.getFieldValue("status")
    const imformation = form.getFieldValue("imformation")
    console.log(status,imformation,"--update-info")
    const res = await editSent(record?.id,{status,imformation})
    if(res.status) {
        message.success("更新投递状态成功")
    }
    else {
        message.error("更新投递状态失败")
    }
    form.setFieldsValue({status: 0,imformation: ""})
    setCurModal("")
  }
  useEffect(() => {
    getSentList({ currentPage: curPage, toAccount: window?.account }).then(
      (res) => {
        if (res.status) {
          console.log(res.data.Send, "111");
          const { paginations } = res.data;
          let list = handleTime(res.data.Send);
          list = list.map((item: any) => {
            return {
              ...item,
              resumeTitle: item.Resume.resumeTitle,
              jobName: item.Job.name,
              status: statusSchoolMap[item.status],
            };
          });
          //setCurPage(paginations.currentPage)
          setPageSize(paginations.pageSize);
          setTotal(paginations.total);
          setReceivedList(list);
        }
      }
    );
  }, [curPage, pageSize]);
  useEffect(() => {
    if (curModal === "resume") {
      getResumeDetail({ id: record?.resumeId }).then((res) => {
        if (res.status) {
          let list = handleTime(res.data.Resume);
          let detail = list[0];
          detail = {
            ...detail,
            likeJobType: jobTypeMap[detail.likeJobType],
          };
          console.log(detail, "--投递的简历详情", list);
          setResumeRecord(detail);
          console.log();
        }
      });
    }
  }, [curModal]);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "75%" }}>
        <Table
          dataSource={receivedList}
          columns={receivedCols}
          style={{ flex: "1" }}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 10,
            total,
            position: ["bottomCenter"],
            onChange: onPageChange,
          }}
        />
      </div>
      <Modal
        title="更新当前状态"
        open={curModal === "status"}
        onCancel={() => {
            form.setFieldsValue({status: 0, imformation: ""})
          setCurModal("");
        }}
        onOk={handleUpdateStatus}
        cancelText="取消"
        okText="提交"
      >
        <Form form={form} layout="horizontal" key={record?.id}>
          <Form.Item label="当前投递状态" name="status">
            <Select
              defaultValue="综合类"
              style={{ width: 120 }}
              onChange={handleChooseStatus}
              options={Object.entries(statusSchoolMap).map(([key, val]) => ({
                label: val,
                value: key,
              }))}
            />
          </Form.Item>
          <Form.Item label="当前状态详情" name="imformation">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="投递者简历详情"
        open={curModal === "resume"}
        footer={null}
        onCancel={() => {
          setCurModal("");
        }}
      >
        <Form
          form={form}
          layout="horizontal"
          key={resumeRecord?.id}
          initialValues={resumeRecord}
        >
          <Form.Item label="简历标题" name="resumeTitle">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="简历作者" name="authorName">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="个人照片" name="pictureUrl">
            {form.getFieldValue("pictureUrl") && (
              <div>
                <img
                  alt="resumePicture"
                  style={{ width: "50%" }}
                  src={form.getFieldValue("pictureUrl")}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label="联系电话" name="tel">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="意向岗位类型" name="likeJobType">
            <Select
              style={{ width: 120 }}
              disabled={true}
              // value={() => form.getFieldValue("likeJobType")}
            />
          </Form.Item>
          <Form.Item label="出生日期" name="birthday">
            <Input disabled={true} value={form.getFieldValue("birthday")} />
          </Form.Item>
          <Form.Item label="个人优势" name="description">
            <TextArea rows={10} disabled={true} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
