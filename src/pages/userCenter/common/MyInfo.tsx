import { useState,useEffect } from "react";
import { Flex, Form, Input, Button, Select, Upload, message } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getUserCenterInfo,editUserCenterInfo } from "../../../api/userInfo";
import {jsonToArr} from "../../../utils/handleJson"
const sexOptions = [
  {label: "男",value: 0},
  {label: "女",value: 1},
]
const tipsMap = {
  0: "管理员需要上传工作证等证明材料",
  1: "求职者需要上传毕业证书，学位证书等证明材料"
}
export default function MyInfo() {
  const [imgUrls,setImgUrls] = useState<[string]>([]);
  const [userInfo,setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm()
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </button>
  );
  const beforeUpload = (file:any) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = () => {
        setLoading(true);
      };
      reader.onload = () => {
        const base64Str = reader.result;
        setImgUrls([...imgUrls,base64Str]);
        setLoading(false);
        resolve(false); // 后续表单提交才处理上传到数据库的操作，否则控制台打印post错误
      };
      reader.onerror = (error) => reject(error);
    });
  }
    const onFinish = async () => {
      const newInfo = {
        account: window?.account,
        userName: form.getFieldValue("userName"),
        realName: form.getFieldValue("realName"),
        sex: form.getFieldValue("sex"),
        phoneNumber: form.getFieldValue("phoneNumber"),
        email: form.getFieldValue("email"),
        school: form.getFieldValue("school"),
        certification: imgUrls,
        status: 1
      }
      // 注册业务同时完成初始化个人中心的个人信息，所以在个人信息页面统一使用edit接口
      const res = await editUserCenterInfo(newInfo)
      if(res.status) {
        message.success("更新个人信息成功~")
      }
      else {
        message.error("更新个人信息失败!!")
      }
    } 
    const handleRemove = (file: any) => {
      console.log(file.thumbUrl.length,"base64长度")
      const newImgUrls = imgUrls.filter((url) => url.length !== file.thumbUrl.length);
      setImgUrls(newImgUrls);
    }

    const handleChooseSex = (value,item) => {
      console.log(typeof value,item)
      console.log(form.getFieldValue("sex"),"sex")
    }
    useEffect(() => {
      getUserCenterInfo({account: window?.account}).then(res => {
        console.log(res,'--个人中心信息的res')
        if(res.status) {
          let userInfo = res.data.UserInfo[0]
          userInfo = {
            ...userInfo,
            certification: jsonToArr(userInfo.certification)
          }
          setUserInfo(userInfo)
          form.setFieldValue("userName",userInfo.userName)
          form.setFieldValue("realName",userInfo.realName)
          form.setFieldValue("sex",userInfo.sex)
          form.setFieldValue("phoneNumber",userInfo.phoneNumber)
          form.setFieldValue("school",userInfo.school)
        }
      })
    },[])
    return (
       <>
       
        <h2 style={{ color: "black", width: "10%" }}>个人信息</h2>
        
      <Flex justify="center" align="center">
        <Form form={form} style={{ width: "50vw" }} onFinish={onFinish} key={userInfo?.id}>
          <Form.Item
            name="userName"
            label="用户名"
            rules={[{ required: true, message: "请输入您的用户名!" }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="realName"
            label="姓名"
            rules={[{ required: true, message: "请输入您的真实姓名!" }]}
          >
            <Input placeholder="真实姓名" />
          </Form.Item>
          {/* 性别 */}
          <Form.Item
            name="sex"
            label="性别"
            rules={[{ required: true, message: "请选择您的性别!" }]}
          >
            <Select
                defaultValue={0}
                onChange={handleChooseSex}
                options={sexOptions}
          
              />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="手机号"
            rules={[{ required: true, message: "请输入您的手机号!" }]}
          >
            <Input placeholder="手机号" />
          </Form.Item>
          <Form.Item
            name="fixedEmail"
            label="邮箱"
            rules={[{ required: true, message: "请输入您的邮箱!" }]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="school"
            label="毕业院校"
            rules={[{ required: true, message: "请输入您的毕业院校!" }]}
          >
            <Input placeholder="毕业院校" />
          </Form.Item>
          <Form.Item
            name="certificate"
            label="证明材料"
            rules={[{ required: true, message: "请上传您的相关证明材料!" }]}
          >
            
            <Upload
                listType="picture-card"
                className="avatar-uploader"
                accept="image/*"
                beforeUpload={beforeUpload}
                onRemove={handleRemove}
              >
                {imgUrls.length >= 8 ? null : uploadButton}
              </Upload>
              
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
          <span style={{color: "black"}}>备注：{tipsMap[window?.role]}</span>
        </Form>
      </Flex>
       </> 
    )
    
}