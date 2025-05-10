import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Layout } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { updateUserInfo, getUser } from '@/api/userApi';
import { useStore } from '../store/userStore';

const { Content } = Layout;

const UserCenter = () => {
  const { user } = useStore();
  const [nickname, setNickname] = useState('');
  const [mobile, setMobile] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUser(user.id);
        if (response && response.data) {
          setNickname(response.data.nickname || '');
          setMobile(response.data.mobile || '');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
      }
    };

    if (user && user.id) {
      fetchUserInfo();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const userData = {
        nickname,
        mobile,
      };
      const response = await updateUserInfo(user.id, userData);
      if (response && response.status === 200) {
        message.success('信息已保存');
        // 更新本地存储的用户信息
        const updatedUser = {...user, nickname, mobile};
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        message.error('保存失败');
      }
    } catch (error) {
      console.error('保存用户信息失败:', error);
      message.error('保存失败');
    }
  };

  const handleLogout = () => {
    // 清除用户状态
    localStorage.removeItem('user');
    message.success('已退出登录');
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1); // 返回上一页
  };

  return (
    <Content style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ marginRight: '10px' }}
        />
        <h1 style={{ textAlign: 'center', margin: '0 auto' }}>用户中心</h1>
      </div>
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
