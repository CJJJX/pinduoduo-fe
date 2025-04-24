import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown'
import { Bubble,Sender } from "@ant-design/x";
import {OpenAIOutlined,UserOutlined} from  "@ant-design/icons"
import { Avatar, Drawer,List } from "antd";
import { getChatList,createChat } from '../api/chat'
import './css/ChatList.css'
type ChatListProps = {
    isShow: boolean;
    handleClose: () => void;
  };
  const testList = [
    {
      msgType: 1,
      content: 'saasasa,我是你的爸爸，deepseek是我儿子666666，saasasa,我是你的爸爸，deepseek是我儿子666666，',
    },
    {
      msgType: 2,
      content: '主人好，我是智能助理，你的贴心小助手~',
    },
    {
      msgType: 1,
      content: 'saasasa,我是你的爸爸，deepseek是我儿子666666',
    },
    {
      msgType: 2,
      content: '主人好，我是智能助理，你的贴心小助手~',
    },
    {
      msgType: 1,
      content: 'saasasa,我是你的爸爸，deepseek是我儿子666666',
    },
    {
      msgType: 2,
      content: '主人好，我是智能助理，你的贴心小助手~',
    },
  ];

  
  export default function ChatList({isShow,handleClose}) {
    const [messageList,setMessageList] = useState([])
    // 发送回调
    const handleSend = async (val:string) => {
        console.log(val)
        try {
           const rsp = await createChat({account: window?.account,question: val})
           if(rsp.status) {
            const res = await getChatList({account: window?.account})
           if(res.status) {
            setMessageList(res.data.Chats)
          }
           }
           
        }catch(err) {
          console.log(err,'对话接口错误')
        }
       
    }
    
  
  

    useEffect(() => {
        const account = window?.account
        if(isShow && account) {
            getChatList({account}).then((res) => {
                console.log(res)
                if(res.status) {
                  setMessageList(res.data.Chats)
                }
            })
        }
    },[isShow])
    return (
      <Drawer
      open={isShow}
      onClose={handleClose}
      title="智能AI对话助手为您提供帮助~"
      placement="left"
      width="20%"
      >
       <List
       dataSource={messageList}
       itemLayout="horizontal"
       style={{width: "100%"}}
       split={false}
       renderItem={(item) => (
        <List.Item>
          <Bubble content={<ReactMarkdown>{item.content}</ReactMarkdown>}
          header={item.msgType === 2 ? "智能AI助手" : "用户"}
          avatar={item.msgType === 2 ? <OpenAIOutlined/> : <UserOutlined /> }
          placement={item.msgType === 2 ? "end" : "start"}
          />
          {/* <List.Item.Meta
          title={item.msgType === 2 ? "智能AI助手" : "用户"}
          avatar={item.msgType === 2 ? <OpenAIOutlined/> : <UserOutlined/>}
          description={item.content}
          /> */}
        </List.Item>
    )}
       >

       </List>
       <Sender
  className="ant-senderExtra"
       style={{position: 'fixed', bottom: 0,width: "16%"}}
       placeholder="向智能AI助手发起提问吧~"
       onSubmit={handleSend}
       ></Sender>   
      </Drawer>
       
      
      
    );
  }