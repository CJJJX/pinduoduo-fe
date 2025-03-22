import { useState, useEffect } from "react";
import { Flex, Form, Input, Button, message } from "antd";
import { editPassword } from "../../../api/user";
export default function EditPassword() {
  const onFinish = async () => {
    const newPassword = form.getFieldValue("newPassword");
    const confirmNewPassword = form.getFieldValue("confirmNewPassword");
    if (newPassword !== confirmNewPassword) {
      message.error("请确认两次输入的新密码一致!!!");
      return;
    }
    const originPassword = form.getFieldValue("originPassword");

    const user = {
      account: window?.account,
      originPassword,
      newPassword,
    };
    const res = await editPassword(user);
    console.log(res, "--res修改mima");
    form.setFieldsValue({
      originPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };
  const [form] = Form.useForm();
  return (
    <>
      <h2 style={{ color: "black", width: "10%" }}>修改密码</h2>
      <Flex justify="center" align="center">
        <Form form={form} style={{ width: "50vw" }} onFinish={onFinish}>
          <Form.Item
            name="originPassword"
            rules={[{ required: true, message: "请输入您的原密码!" }]}
          >
            <Input type="password" placeholder="原密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: "请输入您的新密码!" }]}
          >
            <Input type="password" placeholder="新密码" />
          </Form.Item>
          <Form.Item
            name="confirmNewPassword"
            rules={[{ required: true, message: "请再次输入您的新密码!" }]}
          >
            <Input type="password" placeholder="再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  );
}
