import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Layout, Avatar } from 'antd';
import {
  UploadOutlined,
  ArrowLeftOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { updateUserInfo, getUser, uploadAvatar } from '@/api/userApi';
import { useStore } from '../store/userStore';

const { Content } = Layout;

const UserCenter = () => {
  const { user, setUser } = useStore();
  const [nickname, setNickname] = useState('');
  const [mobile, setMobile] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUser(user.id);
        if (response && response.data) {
          setNickname(response.data.nickname || '');
          setMobile(response.data.mobile || '');
          setAvatarUrl(response.data.avatar_url || '');
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
      setLoading(true);
      let newAvatarUrl = avatarUrl;

      // 如果有新上传的头像，先处理头像上传
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);

        const uploadResponse = await uploadAvatar(user.id, formData);
        if (
          uploadResponse &&
          uploadResponse.data &&
          uploadResponse.data.avatar_url
        ) {
          newAvatarUrl = uploadResponse.data.avatar_url;
        }
      }

      // 更新用户基本信息
      const userData = {
        nickname,
        mobile,
        avatar_url: newAvatarUrl,
      };

      const response = await updateUserInfo(user.id, userData);
      if (response && response.status === 200) {
        message.success('信息已保存');
        // 更新本地存储的用户信息
        const updatedUser = {
          ...user,
          nickname,
          mobile,
          avatar_url: newAvatarUrl,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser); // 更新全局状态
        setAvatarUrl(newAvatarUrl);
      } else {
        message.error('保存失败');
      }
    } catch (error) {
      console.error('保存用户信息失败:', error);
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 退出登录功能已移至导航栏头像悬浮卡片中

  const handleBack = () => {
    navigate(-1); // 返回上一页
  };

  return (
    <Content style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}
      >
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              {avatarUrl ? (
                <Avatar
                  src={avatarUrl}
                  size={100}
                  style={{ marginBottom: '10px' }}
                />
              ) : avatar ? (
                <Avatar
                  src={URL.createObjectURL(avatar)}
                  size={100}
                  style={{ marginBottom: '10px' }}
                />
              ) : (
                <Avatar
                  icon={<UserOutlined />}
                  size={100}
                  style={{ marginBottom: '10px' }}
                />
              )}
            </div>
            <Upload
              beforeUpload={(file) => {
                // 验证文件类型
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('只能上传图片文件!');
                  return Upload.LIST_IGNORE;
                }

                // 验证文件大小（限制为5MB）
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('图片必须小于5MB!');
                  return Upload.LIST_IGNORE;
                }

                setAvatar(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={loading}>
                选择头像
              </Button>
            </Upload>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
              支持JPG、PNG格式，文件大小不超过5MB
            </div>
          </div>
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%' }}
          loading={loading}
        >
          保存
        </Button>
      </Form>
      {/* 退出登录按钮已移至导航栏头像悬浮卡片中 */}
    </Content>
  );
};

export default UserCenter;
