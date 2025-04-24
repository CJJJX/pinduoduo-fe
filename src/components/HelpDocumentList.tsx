import { Drawer, List } from "antd";

const helpList = [
  {
    question: "注册账号的方式只有使用手机号一种吗",
    answer: "是的,注册的账号需为国内11位手机号,账号作为用户的唯一标识",
  },
  {
    question: "如何发布职位",
    answer: "高校HR角色用户登录后进入个人中心页的职位发布模块发布新职位",
  },
  {
    question: "如何查询投递进度",
    answer: "求职者角色用户登录后进入个人中心页的我的投递记录模块查看",
  },
  {
    question: "投递记录状态有哪些",
    answer: "对于高校HR角色用户,投递记录状态有`未发送、笔试中、面试中、录用通知已发放、未通过考核、职位已下架`;对于求职者角色用户,投递记录状态有`待处理、点击查看笔试通知、点击查看面试通知、点击查看录用通知、未通过考核、职位已下架`",
  },
  {
    question: "招聘信息是否提供条件查询功能",
    answer: "招聘信息页提供`意向岗位类型、下属学院、要求最低学历、有无笔试环节、岗位名称`的条件查询功能",
  },
  {
    question: "意向岗位类型分为哪些",
    answer: "意向岗位类型分为`综合类、辅导员类、教师类、后勤（服务）类、科研类、教辅类、管理类`",
  },
];

export default function HelpDocumentList({ isShow, handleClose }) {
  return (
    <Drawer
      open={isShow}
      onClose={handleClose}
      title="帮助文档"
      placement="left"
      width="80%"
    >
      <h2>常见问题列表</h2>
      <List
        dataSource={helpList}
        itemLayout="horizontal"
        style={{ width: "100%" }}
        split={false}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.question} description={
              item.answer} />
          </List.Item>
        )}
      ></List>
    </Drawer>
  );
}
