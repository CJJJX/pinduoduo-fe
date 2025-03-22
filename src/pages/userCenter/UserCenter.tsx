import { Flex, Layout,Menu,Form,Table,Space,Modal,Button,Input,message, Empty } from "antd";
import { useState,useEffect } from "react";
import MyInfo from './common/MyInfo'; // 公共侧: 个人信息
import EditPassword from "./common/EditPassword"; // 公共侧: 修改密码
import MyResumeList from "./user/MyResumeList";   // 用户侧:我的简历信息
import MySentList from './user/MySentList'; // 用户侧:我的投递记录
import MyAppliedList from "./user/MyAppliedList"; // 用户侧:我的求职信息
import MyPublishedJobList from "./manager/MyPublishedJobList"; // 管理员侧:我的职位发布信息
import MyReceivedList  from "./manager/MyReceivedList"; // 管理员侧:我的投递处理信息
import {createApply,getAppliesList} from '../../api/apply'
import { getUserInfo } from "../../api/user";
import { Routes, Route,useNavigate } from "react-router-dom";
import { handleTime } from '../../utils/time'
const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;
const siderStyle: React.CSSProperties = {
    height: '95vh',
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#1677ff',
  };

  // 求职者的侧边栏导航
  const userItems = [
    {
        key: '0',
        label: '个人信息'
    },
    {
        key: '1',
        label: '修改密码'
    },
    {
        key: '2',
        label: '我的简历信息'
    },
    {
        key: '3',
        label: '我的投递信息'
    },
    {
        key: '4',
        label: '我的求职信息'
    },
  ]
  // 管理员的侧边栏导航
  const superItems = [
    {
        key: '0',
        label: '个人信息'
    },
    {
        key: '1',
        label: '修改密码'
    },
    {
        key: '2',
        label: '我的职位发布'
    },
    {
        key: '3',
        label: '我的投递处理'
    }, 
  ]
  type MenuItem = {
    key: string; // 定义 key 的类型为 string
  };

export default function UserCenter() {
    const navigator = useNavigate()
    const [curItemKey,setCurItemKey] = useState<string>('0')
    const [curModal,setCurModal] = useState<string>('')
    const [appliedList,setAppliedList] = useState([])
    const [curRole,setCurRole] = useState(null)
    const [form] = Form.useForm();
    const handleClick = async (item:MenuItem) => {
        console.log(item,'curItem')
        const {key} = item
        setCurItemKey(key)
    }
    // 获取当前用户信息
    const handleGetUserInfo = async () => {
        const res = await getUserInfo()
        console.log(res.status,'curStatus') // 401
        if(res.status === 401) {
            message.error("未授权访问，即将为您跳转至登录页...")
          navigator('/login')
        }
        if(res.status === true) {
            // 将用户的账号信息和角色信息挂载在window对象上
            window.account = res.data?.account
            window.role = res.data?.role
            setCurRole(res.data?.role)
            console.log(window.account,'-account')
            console.log(window.role,'-role')
        }
        
    }
    // 创建求职申请
    const handleCreateApply = async () => {
        try {
            const values = await form.validateFields()
            console.log(values,'values--')
            const rsp = await getUserInfo()
            if(!rsp.status) {
                console.log('创建失败')
                return
            }
            const {account} = rsp.data            
            const res = await createApply({...values,account})
        console.log(res,'创建apply的结果')
        setCurModal('')
        }catch(err) {
            console.log(err,'err--')
        }
        
    }
    // 获取求职申请列表
    const getApplies = async () => {
        const account = window?.account
        console.log('接口拿到的account',account)
        const res = await getAppliesList({account})
        console.log(res,'res--')
        return res
    }
    const showModal = (item) => {
        setCurModal(item)
    }
    useEffect(() => {
        handleGetUserInfo()
    },[])
    // Todo 这里curItemKey如果是之前的数组就不更新，为啥呢
    useEffect(() => {
        console.log(window.account,'window.account')
        if(curItemKey === '4' && window.account) {
            getApplies().then((res) => {
                console.log(res,'useEffect')
                if(res.status) {
                let appliedList = res.data?.Applys
                appliedList = handleTime(appliedList)
                console.log(appliedList,'apply')
                setAppliedList(appliedList)
            }
            })
            
            
        }
    },[curItemKey])
    return (
        <>
        
            {
               typeof window?.role !== 'number' ? 
               <Empty
               description='登录后查看个人中心详细信息'
               />
               : <Layout>
        {
        <Sider width="25%" style={siderStyle}>
           <span>个人中心</span> 
          <Menu
          items={window?.role === 0 ? superItems : userItems}
          selectedKeys={[curItemKey]}
          onClick={handleClick}
          />
        </Sider>
        }
        {/* 公共模块: 个人信息 */}
        {
            curItemKey[0] === '0' && <MyInfo/>
        }
        {/* 公共模块: 修改密码 */}
        {
            curItemKey[0] === '1' && <EditPassword/>
        }
        {/* 用户侧模块：创建简历 */}
        {
            curItemKey[0] === '2' && window.role === 1 && 
            <MyResumeList/>
        }
        {/* 管理员侧模块：职位发布 */}
        {
            curItemKey[0] === '2' && window.role === 0 && 
            <MyPublishedJobList/>
        }
        {/* 管理员侧模块：投递处理 */}
        {
            curItemKey[0] === '3' && window.role === 0 && 
            <MyReceivedList/>
        }
        {/* 用户侧模块: 投递记录 */}
        {
            curItemKey[0] === '3' && window.role === 1 && 
            <MySentList/>
        }
        {/* 用户侧模块：新增求职申请 */}
        {
            curItemKey[0] === '4' && window.role === 1 && 
            <MyAppliedList/>
        }
      </Layout>
            }
           
        </>
    )
}