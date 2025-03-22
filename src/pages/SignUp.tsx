
import { Form,Input, Select,Button,Flex,message } from "antd";
import { LockOutlined, UserOutlined,LinuxOutlined } from '@ant-design/icons';
import {signUp} from '../api/user'
import { createUserCenterInfo } from "../api/userInfo";
const { Option } = Select;
export default function SignUp() {
    const onFinish = async (values:any) => {
        const {account,password,role} = values
        const user = {
            account,
            password,
            role:parseInt(role)
        }
        console.log('Received values of form: ', values);
        const res = await signUp(user)
        // 创建新账号后同时初始化个人中心的个人信息

        if(res.status === 500)
        message.error('创建用户失败')
        if(res?.message === '创建用户成功') {
          message.success('创建用户成功')
          const rsp = await createUserCenterInfo({account,status: 0})
          console.log(rsp,'初始化个人中心的个人信息的结果-')
        }
        
        console.log(res,'注册结果--')
      };
    return (
        <>
        <h2 style={{color: "black"}}>注册</h2>
        <Flex justify="center" align="center">
 <Form
      //name="login"
      initialValues={{ remember: true }}
      style={{ width:"50vw" }}
      onFinish={onFinish}
    >
      <Form.Item
        name="account"
        rules={[{ required: true, message: '请输入您的手机号!' },
        { type: 'string', len: 11, message: '注册账号必须为11位手机号!' },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入有效的手机号！',
          },
    ]}
      >
        <Input prefix={<UserOutlined />} placeholder="账号" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入您的密码!' },{ type: 'string', min: 6 ,message: '密码要求6位以上'}]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
      </Form.Item>
      <Form.Item
      name="role"
      rules={[{ required: true, message: '请选择你的角色!' }]}
      >
      <Select
      placeholder="角色"
      prefix={<LinuxOutlined />}>
      <Option value="0">管理员</Option>
        <Option value="1">求职者</Option>
      </Select>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
    </Form>
        </Flex>
       
        </>
    )
}