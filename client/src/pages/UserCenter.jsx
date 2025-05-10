import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Layout } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const UserCenter = () => {
  const [nickname, setNickname] = useState('');
  const [mobile, setMobile] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const userData = {
        nickname,
        mobile,
        avatar: avatar ? avatar.url : null,
      };
      const response = await updateUserInfo(user.id, userData);
      if (response.status === 200) {
        message.success('信息已保存');
      } else {
        message.error('保存失败');
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleLogout = () => {
    // 处理退出登录逻辑
    message.success('已退出登录');
    navigate('/login');
  };

  return (
    <Content style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>用户中心</h1>
      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item label="昵称" style={{ marginBottom: '16px' }}>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="电话" style={{ marginBottom: '16px' }}>
          <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </Form.Item>
        <Form.Item label="头像" style={{ marginBottom: '16px' }}>
          <Upload
            beforeUpload={(file) => {
              setAvatar(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传头像</Button>
          </Upload>
          {avatar && (
            <img
              src={URL.createObjectURL(avatar)}
              alt="avatar"
              style={{ width: '100px', marginTop: '10px' }}
            />
          )}
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          保存
        </Button>
      </Form>
      <Button
        type="danger"
        onClick={handleLogout}
        style={{ marginTop: '20px', width: '100%' }}
      >
        退出登录
      </Button>
    </Content>
  );
};

export default UserCenter;
