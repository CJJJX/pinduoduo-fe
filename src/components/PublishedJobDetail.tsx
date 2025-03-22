import { useEffect, useState } from "react";
import { Flex, Row, Tag, Divider, Empty, Button, Modal, Select, message } from "antd";
import { useParams } from "react-router-dom";
import { getPublishDetail } from "../api/job";
import { getResumeList } from "../api/resume";
import { createSend } from "../api/send";
import { getUserInfo } from "../api/user";
import { handleTime } from "../utils/time";
import { collegeMap, jobTypeMap, degreeMap } from "../config/publishMap";
export default function PublishedJobDetail() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [publishedTime, setPublishedTime] = useState<string>("");
  const [publishAccount, setPublishAccount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [requirement, setRequirement] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<string>("");
  const [jobType, setJobType] = useState<string>("");
  const [majorType, setMajorType] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [fromCollege, setFromCollege] = useState<string>("");
  const [haveWrittenExam, setHaveWrittenExam] = useState<boolean>(true);
  const [resumeList,setResumeList] = useState<Array<Object>>([]);
  const [selectedResume,setSelectedResume] = useState<Object>({});
  const [curRole,setCurRole] = useState<number>(-1);
  const [curModal,setCurModal] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  let arr;
  const handleSendResume = async () => {
    const newSend = {
      jobId: Number(id),
      resumeId: selectedResume?.id,
      status: 0,
      fromAccount:  window?.account,
      toAccount: publishAccount,
      imformation: ''
    }
    const res = await createSend(newSend)
    console.log(res,'新增投递记录的结果___')
    if(res.status) {
      message.success("简历投递成功,请前往个人中心-我的投递信息模块查看详情")
    }else {
      message.error("简历投递失败")
    }
    setCurModal("")
  }
  const handleChooseRusume = (resumeId: string) => {
    const selectedItem = resumeList.find(item => item.id === resumeId)
    setSelectedResume(selectedItem as object)
  }
  useEffect(() => {
    if (id) {
      console.log(id, "curId");
      getUserInfo().then((res: any) => {
        if(res.status === true) {
          // 将用户的账号信息和角色信息挂载在window对象上
          window.account = res.data?.account
          window.role = res.data?.role
          setCurRole(res.data?.role)
        }
      })
      getPublishDetail({ id }).then((res:any) => {
        if (res.status) {
          if (res.data.Jobs.length === 0) {
            setIsEmpty(true);
            return;
          }
          arr = handleTime(res.data.Jobs);
          arr = arr.map((item) => ({
            ...item,
            jobType: jobTypeMap[item.jobType],
            degree: degreeMap[item.degree],
            fromCollege: collegeMap[item.fromCollege],
          }));
          setName(arr[0].name);
          setPublishedTime(arr[0].createdAt);
          setPublishAccount(arr[0].publishAccount);
          setDescription(arr[0].description);
          setRequirement(arr[0].requirement);
          setSalaryRange(arr[0].salaryRange);
          setJobType(arr[0].jobType);
          setMajorType(arr[0].majorType);
          setDegree(arr[0].degree);
          setFromCollege(arr[0].fromCollege);
          setHaveWrittenExam(arr[0].haveWrittenExam);
        }
      });
      getResumeList({account: window?.account}).then(res => {
        if(res.status) {
          let resumeList = res.data.Resume
          resumeList = resumeList.map((item:any) => {
            return {
              publishAccount: item.account,
              resumeTitle: item.resumeTitle,
              id: item.id
            }
          })
          console.log(resumeList,'mmm')
          console.log(resumeList.map((item:any) => {
            return {
            label: item.resumeTitle,
            value: item.id
            }
        }))
        setSelectedResume(resumeList[0])
          setResumeList(resumeList)
        }
        console.log(res,'拿到的简历列表--')
      })
    }
  }, [id]);
  // useEffect(() => {
  //   if(curModal === '')
  //   return
  //   getResumeList({account: window?.account}).then(res => {
  //     if(res.status) {
  //       let resumeList = res.data.Resume
  //       resumeList = resumeList.map((item:any) => {
  //         return {
  //           publishAccount: item.publishAccount,
  //           resumeTitle: item.resumeTitle,
  //           id: item.id
  //         }
  //       })
  //       console.log(Object.entries(resumeList).map((item:any) => {
  //         return {
  //         label: item.resumeTitle,
  //         value: item.id
  //         }
  //     }))
  //       setResumeList(resumeList)
  //     }
  //     console.log(res,'拿到的简历列表--')
  //   })
  // },[curModal])
  if (isEmpty) return <Empty />;
  return (
    <>
    <div style={{ color: "black" }}>
      <h2 style={{ textAlign: "left", lineHeight: "1" }}>招聘职位详情</h2>
      <Divider />
      <h2 style={{ lineHeight: "1" }}>{name}</h2>
      <Flex justify="space-between" style={{ width: "66%" }}>
        <h3 style={{ lineHeight: "1", marginLeft: "25%" }}>
          发布时间：{publishedTime}
        </h3>
        {
          curRole === 1 && 
        <Button style={{ lineHeight: "1" }} onClick={() => {setCurModal('open')}}>投递简历</Button>
        }
        
      </Flex>

      <span style={{ marginRight: "10%" }}>所属分类：{jobType}</span>
      <span style={{ marginRight: "10%" }}>要求专业：{majorType}</span>
      <span>发布来源学院: {fromCollege}</span>
      <br />
      <span style={{ marginRight: "10%" }}>薪资范围：{salaryRange}</span>
      <span style={{ marginRight: "10%" }}>
        有无笔试：{haveWrittenExam ? "有" : "无"}
      </span>
      <span>要求最低学历：{degree}</span>
      <br />

      <p>职位描述: {description}</p>
      <p>任职要求: {requirement}</p>
    </div>
    <Modal
    title={"请选择你想要投递的简历"}
    open={curModal !== ""}
    onOk={() => handleSendResume()}
    onCancel={() => {
      setCurModal("")
     }}
    cancelText="取消"
    okText="确认"
    >
      {
        resumeList && 
      <Select
      defaultValue={selectedResume?.resumeTitle}
      style={{ width: 220 }}
      onChange={handleChooseRusume}
      options={resumeList.map((item:any) => {
        return {
        label: item.resumeTitle,
        value: item.id
        }
    })}
    value={selectedResume?.resumeTitle}
      >

      </Select>
      }
      
    </Modal>
    </>
    
  );
}
