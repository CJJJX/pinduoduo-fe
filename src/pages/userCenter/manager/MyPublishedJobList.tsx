import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Space,
  Form,
  Modal,
  Input,
  Select,
  Checkbox,
  message,
} from "antd";
import {
  jobTypeMap,
  jobTypeMapReverse,
  collegeMap,
  collegeMapReverse,
  degreeMap,
  degreeMapReverse,
} from "../../../config/publishMap";
import { getUserInfo } from "../../../api/user";
import {
  getPublishList,
  getPublishDetail,
  createPublish,
  editPublish,
  deletePublish,
} from "../../../api/job";

import { handleTime } from "../../../utils/time";
import dayjs from "dayjs";
const { TextArea } = Input;
const modalTitleMap = {
  create: "新增职位",
  showDetail: "发布的职位详情",
  edit: "编辑发布的职位信息",
  del: "删除发布的职位",
};

export default function MyPublishedJobList() {
  // 管理员-职位发布表格列
  let publishedJobCols = [
    {
      title: "职位名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "所属分类",
      dataIndex: "jobType",
      key: "jobType",
    },
    {
      title: "要求最低学历",
      dataIndex: "degree",
      key: "degree",
    },
    {
      title: "来源学院",
      dataIndex: "fromCollege",
    },
    // {
    //     title: '薪酬范围',
    //     dataIndex: 'range',
    //     key: 'range'
    // },
    {
      title: "发布时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record: object) => {
        return (
          <Space size="middle">
            <Button
              color="primary"
              variant="solid"
              onClick={() => {
                setRecord({ ...record });
                form.setFieldsValue({ ...record });
                setCurModal("showDetail");
              }}
            >
              详情
            </Button>
            <Button
              color="default"
              variant="solid"
              onClick={() => {
                setRecord({ ...record });
                form.setFieldsValue({ ...record });
                setCurModal("edit");
              }}
            >
              编辑
            </Button>
            <Button
              color="danger"
              variant="solid"
              onClick={() => {
                setRecord({ ...record });
                setCurModal("del");
              }}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const [publishedJobList, setPublishedJobList] = useState([]);
  const [name, setName] = useState<string>("");
  const [jobType, setJobType] = useState<number>(0);
  const [degree, setDegree] = useState<number>(0);
  const [fromCollege, setFromCollege] = useState<number>(0);
  const [haveWrittenExam, setHaveWrittenExam] = useState<boolean>(false);
  const [majorType, setMajorType] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [requirement, setRequirement] = useState<string>("");
  const [curModal, setCurModal] = useState<string>("");
  const [record, setRecord] = useState<Object>(null);
  const [form] = Form.useForm();
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const onPageChange = (pageNum: number) => {
    setCurPage(pageNum);
  };

  const handleCreateJobs = async () => {
    const values = await form.validateFields();
    const rsp = await getUserInfo();
    if (!rsp.status) {
      console.log("创建失败");
      return;
    }
    const { account } = rsp.data;
    const res = await createPublish({
      ...values,
      // 参照 MyResumeList组件的解释
      jobType:
        typeof jobType !== "number" ? jobTypeMapReverse[jobType] : jobType,
      fromCollege:
        typeof fromCollege !== "number"
          ? collegeMapReverse[fromCollege]
          : fromCollege,
      degree: typeof degree !== "number" ? degreeMapReverse[degree] : degree,
      publishAccount: account,
      canEditOrDel: false,
    });
    if (res.status) {
      message.success(res.message);
    } else {
      message.error(res.message);
    }
    setCurModal("");
  };
  const handleShowDetail = async () => {
    form
      .validateFields()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then(() => {
        form.setFieldsValue({
          name: "",
          requirement: "",
          salaryRange: "",
          majorType: "",
          haveWrittenExam: false,
          degree: 0,
          jobType: 0,
          fromCollege: 0,
          description: "",
        }); // 离开时清除表单数据
      });
    setRecord(null);
    setCurModal("");
  };
  const handleEdit = async () => {
    const id = record?.id;
    const newRecord = {
      ...record,
      // 参照 MyResumeList组件的解释
      jobType:
        typeof jobType !== "number" ? jobTypeMapReverse[jobType] : jobType,
      fromCollege:
        typeof fromCollege !== "number"
          ? collegeMapReverse[fromCollege]
          : fromCollege,
      degree: typeof degree !== "number" ? degreeMapReverse[degree] : degree,
    };
    const res = await editPublish(id, newRecord);
    console.log(res);
    if (res.status) {
      message.success(res.message);
    } else {
      message.error(res.message);
    }
    setCurModal("");
  };
  const handleDel = async () => {
    const id = record?.id;
    const res = await deletePublish(id);
    console.log(res);
    if (res.status) {
      message.success(res.message);
    }
    setCurModal("");
  };
  const okOpretionMap = {
    create: handleCreateJobs,
    showDetail: handleShowDetail,
    edit: handleEdit,
    del: handleDel,
  };
  // 岗位类型
  const handleChooseJobType = (likeJobTypeKey: string) => {
    setJobType(Number(likeJobTypeKey));
  };
  // 发布来源学院
  const handleChooseFromCollege = (fromCollegeKey: string) => {
    setFromCollege(Number(fromCollegeKey));
  };
  // 要求最低学历
  const handleChooseDegree = (degreeKey: string) => {
    setDegree(Number(degreeKey));
  };
  useEffect(() => {
    if (curModal !== "") return;
    console.log(
      Object.entries(jobTypeMap).map(([key, val]) => ({
        label: val,
        value: val,
      }))
    );
    getPublishList({
      currentPage: curPage,
      publishAccount: window?.account,
    }).then((res) => {
      if (res.status) {
        const { paginations } = res.data;
        let publishedList = res.data.Jobs;
        console.log(publishedList, "publishedList--");
        publishedList = handleTime(publishedList);
        publishedList = publishedList.map((item) => ({
          ...item,
          jobType: jobTypeMap[item.jobType],
          fromCollege: collegeMap[item.fromCollege],
          degree: degreeMap[item.degree],
        }));
        setPageSize(paginations.pageSize);
        setTotal(paginations.total);
        setPublishedJobList(publishedList);
      }
      console.log(res, "我发布的职位列表res--");
    });
  }, [curModal, curPage, pageSize]);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "75%" }}>
        <Button
          style={{ width: "15%", marginBottom: "10px" }}
          onClick={() => setCurModal("create")}
        >
          创建新职位
        </Button>
        <Table
          dataSource={publishedJobList}
          columns={publishedJobCols}
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
      {
        <Modal
          title={modalTitleMap[curModal]}
          open={curModal !== ""}
          onOk={okOpretionMap[curModal]}
          onCancel={() => {
            form
              .validateFields()
              // eslint-disable-next-line @typescript-eslint/no-shadow
              .then(() => {
                // 原先将select框对应的三个字段jobtype等设为0，会导致点击详情取消后点新增，回显显示0，现改为setFieldValue对应字段值为综合类
                form.setFieldsValue({
                  name: "",
                  jobType: "综合类",
                  degree: "不限",
                  fromCollege: "不限",
                  salaryRange: "",
                  majorType: "",
                  description: "",
                  requirement: "",
                  haveWrittenExam: false,
                }); // 离开时清除表单数据
              });
            setCurModal("");
          }}
          cancelText="取消"
          okText="提交"
        >
          {curModal === "create" && (
            <Form layout="horizontal" form={form}>
              <Form.Item label="岗位名称" name="name">
                <Input />
              </Form.Item>

              <Form.Item label="岗位类型" name="jobType">
                <Select
                  defaultValue="综合类"
                  style={{ width: 120 }}
                  onChange={handleChooseJobType}
                  options={Object.entries(jobTypeMap).map(([key, val]) => ({
                    label: val,
                    value: key,
                  }))}
                />
              </Form.Item>
              <Form.Item label="要求最低学历" name="degree">
                <Select
                  defaultValue="不限"
                  style={{ width: 120 }}
                  onChange={handleChooseDegree}
                  options={Object.entries(degreeMap).map(([key, val]) => ({
                    label: val,
                    value: key,
                  }))}
                />
              </Form.Item>
              <Form.Item label="发布来源学院" name="fromCollege">
                <Select
                  defaultValue="不限"
                  style={{ width: 120 }}
                  onChange={handleChooseFromCollege}
                  options={Object.entries(collegeMap).map(([key, val]) => ({
                    label: val,
                    value: key,
                  }))}
                />
              </Form.Item>
              <Form.Item label="薪资范围" name="salaryRange">
                <Input />
              </Form.Item>
              <Form.Item label="要求专业类型" name="majorType">
                <Input />
              </Form.Item>
              <Form.Item label="职位描述" name="description">
                <TextArea rows={6} />
              </Form.Item>
              <Form.Item label="岗位要求" name="requirement">
                <TextArea rows={6} />
              </Form.Item>

              <Form.Item label="是否有笔试环节" name="haveWrittenExam">
                <Checkbox
                  onChange={(e) => {
                    setHaveWrittenExam(e.target.value);
                    form.setFieldValue("haveWrittenExam", e.target.value);
                  }}
                ></Checkbox>
              </Form.Item>
            </Form>
          )}
          {(curModal === "edit" || curModal === "showDetail") && record && (
            <Form
              form={form}
              layout="horizontal"
              key={record?.id}
              initialValues={record}
            >
              <Form.Item label="岗位名称" name="name">
                <Input
                  disabled={curModal === "showDetail"}
                  onChange={(e) => {
                    setName(e.target.value);
                    form.setFieldValue("name", e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="岗位类型" name="jobType">
                <Select
                  defaultValue="综合类"
                  style={{ width: 120 }}
                  onChange={handleChooseJobType}
                  options={Object.entries(jobTypeMap).map(([key, val]) => ({
                    label: val,
                    value: key,
                  }))}
                  disabled={curModal === "showDetail"}
                  value={() => jobTypeMap[form.getFieldValue("jobType")]}
                />
              </Form.Item>
              <Form.Item label="要求最低学历" name="degree">
                <Select
                  defaultValue="不限"
                  style={{ width: 120 }}
                  onChange={handleChooseDegree}
                  options={Object.entries(degreeMap).map(([key, val]) => ({
                    label: val,
                    value: key,
                  }))}
                  disabled={curModal === "showDetail"}
                  value={() => degreeMap[degree]}
                />
              </Form.Item>
              <Form.Item label="发布来源学院" name="fromCollege">
                <Select
                  defaultValue="不限"
                  style={{ width: 120 }}
                  onChange={handleChooseFromCollege}
                  options={Object.entries(collegeMap).map(([key, val]) => ({
                    label: val,
                    value: key,
                  }))}
                  disabled={curModal === "showDetail"}
                  value={() => collegeMap[fromCollege]}
                />
              </Form.Item>
              <Form.Item label="要求专业类型" name="majorType">
                <Input
                  disabled={curModal === "showDetail"}
                  onChange={(e) => {
                    setMajorType(e.target.value);
                    form.setFieldValue("majorType", e.target.value);
                  }}
                />
              </Form.Item>

              <Form.Item label="薪水范围" name="salaryRange">
                <Input
                  disabled={curModal === "showDetail"}
                  onChange={(e) => {
                    setSalaryRange(e.target.value);
                    form.setFieldValue("salaryRange", e.target.value);
                  }}
                />
              </Form.Item>

              <Form.Item label="职位描述" name="description">
                <TextArea
                  rows={10}
                  disabled={curModal === "showDetail"}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    form.setFieldValue("description", e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="岗位要求" name="requirement">
                <TextArea
                  rows={10}
                  disabled={curModal === "showDetail"}
                  onChange={(e) => {
                    setRequirement(e.target.value);
                    form.setFieldValue("requirement", e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="是否有笔试环节" name="haveWrittenExam">
                <Checkbox
                  disabled={curModal === "showDetail"}
                  checked={form.getFieldValue("haveWrittenExam")}
                  onChange={(e) => {
                    setHaveWrittenExam(e.target.value);
                    form.setFieldValue("haveWrittenExam", e.target.value);
                  }}
                ></Checkbox>
              </Form.Item>
            </Form>
          )}
          {curModal === "del" && `确认删除id为${record?.id}的职位吗`}
        </Modal>
      }
    </>
  );
}
