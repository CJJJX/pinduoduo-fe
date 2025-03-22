import axios from 'axios'
import { BASE_URL,TIMEOUT } from './config'
import { message } from 'antd'
// import { Routes, Route,useNavigate } from "react-router-dom";
// const navigator = useNavigate()
const service = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    withCredentials: true // 可以允许发送cookie
  });
// http request 拦截器
service.interceptors.request.use(config => {
  const token = document.cookie.split('=')[1]
  console.log(document.cookie.split('=')[1],'lll')
    // 发送网络请求时, 在界面的中间位置显示Loading的组件,使用ant-design插件，这里不再赘述
    //请求携带的信息
      config.headers = {
          'Content-Type':'application/json',
          'Authorization': token,
          //...config.headers,
      };
    return config;
  }, err => {
      //...关闭加载loading的组件，显示消息提示弹窗
      return err;
  });
  
  // http response 拦截器
  service.interceptors.response.use(res => {
    
    // 退出登录接口响应成功，清除 Authorization 请求头
    if (res.config.url === 'users/logout' && res.status) {
      console.log(res,'logout的结果')
      // 清除 Authorization 请求头
      delete api.defaults.headers.common['Authorization'];
      console.log('Token cleared after logout');
    }
    return res.data;
  }, err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log("请求错误");
          break;
        case 401:
          console.log(err)
          
          console.log("未授权访问");
          break;
        default:
          console.log("其他错误信息");
      }
      return err.response
    }
    return err;
  });
  
  export default service;