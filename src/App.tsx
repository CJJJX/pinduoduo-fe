import { useState, useEffect } from "react";
import {OpenAIOutlined,ReadOutlined} from "@ant-design/icons"
import { Layout, Menu, Affix, Modal,FloatButton } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import PublishedJobs from "./pages/PublishedJobs";
import AppliedJobs from "./pages/AppliedJobs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserCenter from "./pages/userCenter/UserCenter";
import ChatList from "./components/chatList";
import HelpList from "./components/helpList";
import { getUserInfo, logout } from "./api/user";
const { Header, Sider, Content } = Layout;

const layoutStyle = {
  borderRadius: 8,
  //overflow: 'hidden',
  width: "100vw",
  maxWidth: "100vw",
};
const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  //backgroundColor: '#fef',
};
const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  //paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
  display: "flex",
  justifyContent: "space-between",
};
const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  //backgroundColor: '#1677ff',
};
// 点击用户中心才展示sider
const isUserCenter = false;
const navItemsLogin = [
  { key: 0, label: "招聘信息" },
  { key: 1, label: "求职信息" },
  { key: 2, label: "个人中心" },
  { key: 3, label: "注册" },
  { key: 4, label: "登录" },
];
type MenuItem = {
  key: string; // 定义 key 的类型为 string
};
function App() {
  const [curItemKey, setCurItemKey] = useState<string[]>([]);
  const [navItems, setNavItems] = useState<object[]>(navItemsLogin);
  const [hasLogin, setHasLogin] = useState<boolean>(false); // 登录态存储至localStorage，以免用户刷新后状态失效
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showChatModal,setShowChatModal] = useState<boolean>(false);
  const [showHelpModal,setShowHelpModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = async (item: MenuItem) => {
    console.log(item, "curItem");
    const { key } = item;
    setCurItemKey([key]);
    switch (key) {
      case "0":
        navigate("/publishedJobList");
        break;
      case "1":
        navigate("/appliedJobList");
        break;
      case "2":
        navigate("/userCenter");
        break;
      case "3":
        navigate("/signUp");
        break;
      case "4":
        console.log(hasLogin, "hasLogin");
        //navigate("/login");
        if (!hasLogin) navigate("/login");
        //else setShowLogoutModal(true);
        break;
        case "5":
          setShowLogoutModal(true);
    }
  };
  const goToHome = () => {
    navigate("/", { replace: true });
    setCurItemKey([]);
  };
  const handleLogout = () => {
    logout().then((res) => {
      if (res.status) {
        setNavItems([...navItemsLogin]);
        setHasLogin(false); 
        setShowLogoutModal(false);
        navigate("/login");
      }
    });
  };
  const handleCloseChat = () => {
    setShowChatModal(false)
  }
  const handleCloseHelp = () => {
    setShowHelpModal(false)
  }
  useEffect(() => {
    getUserInfo().then((res:any) => {
      console.log(res, "res---");
      if (res.status === true) {
        // 将account 和 role 挂载在window对象上
          window.account = res?.data.account
          window.role = res?.data.role
        setHasLogin(true);
      } else setHasLogin(false);
    });
  }, []);
  useEffect(() => {
    if (hasLogin) {
      const NavItemsLogout = navItemsLogin;
      NavItemsLogout[4] = { key: 5, label: "退出" };
      setNavItems([...NavItemsLogout]);
    } else {
      setNavItems([...navItemsLogin]);
    }
  }, [hasLogin]);

  useEffect(() => {
    const curPath = location.pathname;
    // 需要根据当前路由选中导航的下划线
    switch (curPath) {
      // case '/publishedJobList':
      //   setCurItemKey(['0']);
      //   break;
      // case '/appliedJobList':
      //   setCurItemKey(['1']);
      //   break;
      // case '/userCenter':
      //   setCurItemKey(['2']);
      //   break;
      // case '/signUp':
      //   setCurItemKey(['3']);
      //   break;
      case "/login":
        setCurItemKey(["4"]);
        break;
    }
  }, [location.pathname]);
  return (
    <>
      <Layout style={layoutStyle}>
        <Affix offsetTop={0}>
          <Header style={headerStyle}>
            {/* <div style={{ width: '100%',display: 'flex',justifyContent: 'space-between'}}> */}
            <span style={{ fontSize: 20, fontWeight: 600 }} onClick={goToHome}>
              高校招聘系统
            </span>

            <div style={{ display: "flex", flex: "1" }}>
              <Menu
                theme="light"
                mode="horizontal"
                //defaultSelectedKeys={['2']}
                items={navItems}
                selectedKeys={curItemKey}
                style={{ flex: 1, justifyContent: "space-around" }}
                onClick={handleClick}
              />
            </div>

            {/* </div> */}
          </Header>
        </Affix>

        <Layout style={{ height: "80vh" }}>
          {isUserCenter && (
            <Sider width="25%" style={siderStyle}>
              Sider
            </Sider>
          )}

          <Content style={contentStyle}>
            <Routes>
              <Route path="/publishedJobList" element={<PublishedJobs />} />
              <Route path="/publishedJobList/:id" element={<PublishedJobs />} />
              <Route path="/appliedJobList" element={<AppliedJobs />} />
              <Route path="/appliedJobList/:id" element={<AppliedJobs />} />
              <Route path="/userCenter" element={<UserCenter />} />
              <Route path="/signUp" element={<SignUp />}></Route>
              <Route path="/login" element={<Login />} />
              {/* home组件放一张大bg图 */}
              <Route path="/" element={<Home />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
      <Modal
        title={"确认退出登录吗？"}
        open={showLogoutModal && hasLogin}
        onOk={() => handleLogout()}
        onCancel={() => {
          setShowLogoutModal(false);
        }}
        cancelText="取消"
        okText="确认"
      ></Modal>
      <FloatButton.Group shape="square">
        <FloatButton description="帮助"
      icon={<ReadOutlined/>}
      onClick={()=> {setShowHelpModal(true)}
    }
      />
      {
        window?.account && <FloatButton description="对话"
      icon={<OpenAIOutlined />}
      onClick={()=> {setShowChatModal(true)}
    }
      ></FloatButton>
      } 
      </FloatButton.Group>
      <HelpList isShow={showHelpModal} handleClose={handleCloseHelp}></HelpList>
      <ChatList isShow={showChatModal} handleClose={handleCloseChat}></ChatList>
      
    </>
  );
}

export default App;
