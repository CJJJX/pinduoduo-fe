//import cryptoJS from 'crypto-js'
import { Form,Input, Flex,Button, message } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Routes, Route,useNavigate,useLocation } from "react-router-dom";
import {signIn} from '../api/user'
export default function Login() {
    const navigator = useNavigate();
    const onFinish = async (values:any) => {
        try {
            const {account,password} = values
            //const hashedPassword = cryptoJS.SHA256(password).toString()
        const user = {
            account,
            password
        }
        console.log('Received values of form: ', values);
        const res = await signIn(user)
        console.log(res,'登录结果--')
        message.success('登录成功,即将为您跳转到首页...')
        // todo: 这里直接跳转到userenter，node接口getUserInfo(adminAuth中间件)会报错
        navigator('/')

        }catch(err) {
          message.error('登录失败')
            console.log(err,'err')
        }
        
      };
    return (
        <>
        <h2 style={{color: "black"}}>登录</h2>
        <Flex justify="center" align="center">
 <Form
      //name="login"
      initialValues={{ remember: true }}
      style={{ width:"50vw" }}
      onFinish={onFinish}
    >
      <Form.Item
        name="account"
        rules={[{ required: true, message: '请输入您的手机号!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="账号" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入您的密码!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
        </Flex>
        </>
    )
}