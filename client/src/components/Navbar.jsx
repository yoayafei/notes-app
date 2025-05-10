import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Space, Typography, Popover, Button } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FileOutlined,
  DeleteOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/userStore';

const { Header } = Layout;
const Text = Typography;

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('确定退出吗？')) {
      logout();
      navigate('/login');
    }
  };

  const selectedKeys = React.useMemo(() => {
    switch (location.pathname) {
      case '/':
        return ['home'];
      case '/categories':
        return ['categories'];
      case '/notes':
        return ['notes'];
      case '/trash':
        return ['trash'];
      default:
        return [];
    }
  }, [location]);

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#408fae',
        padding: '0 20px',
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKeys}
        style={{ backgroundColor: 'transparent' }}
        items={[
          {
            key: 'home',
            label: (
              <Space size="middle">
                <HomeOutlined />
                <span>首页</span>
              </Space>
            ),
            onClick: () => navigate('/'),
          },
          {
            key: 'categories',
            label: (
              <Space size="middle">
                <AppstoreOutlined />
                <span>分类</span>
              </Space>
            ),
            onClick: () => navigate('/categories'),
          },
          {
            key: 'notes',
            label: (
              <Space size="middle">
                <FileOutlined />
                <span>笔记</span>
              </Space>
            ),
            onClick: () => navigate('/notes'),
          },
          {
            key: 'trash',
            label: (
              <Space size="middle">
                <DeleteOutlined />
                <span>回收站</span>
              </Space>
            ),
            onClick: () => navigate('/trash'),
          },
        ]}
      />
      <div>
        {user ? (
          <Popover
            content={
              <div style={{ width: '200px' }}>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => navigate('/user-center')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    marginBottom: '8px',
                  }}
                >
                  修改用户信息
                </Button>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{ width: '100%', textAlign: 'left', color: '#ff4d4f' }}
                >
                  退出登录
                </Button>
              </div>
            }
            title="用户选项"
            trigger="hover"
            placement="bottom"
          >
            <Space>
              {user.avatar_url ? (
                <Avatar src={user.avatar_url} style={{ cursor: 'pointer' }} />
              ) : (
                <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
              )}
              <Text className="ml-2" style={{ color: '#fff' }}>
                {user.nickname || user.username}
              </Text>
            </Space>
          </Popover>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>
            登录
          </Button>
        )}
      </div>
    </Header>
  );
};

export default Navbar;

// // 使用 antd 组件 + unescc 编写的自定义导航组件
// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Layout, Menu, Avatar, Space, Button, Typography } from 'antd';
// import {
//   UserOutlined,
//   HomeOutlined,
//   AppstoreOutlined,
//   FileOutlined,
//   DeleteOutlined,
// } from '@ant-design/icons';
// import { useStore } from '@/store/userStore';

// const { Header } = Layout;
// const Text = Typography;

// const Navbar = () => {
//   const { user, logout } = useStore();
//   const navigate = useNavigate();
//   const location = useLocation(); // 使用 useLocation 获取当前路由的位置

//   const handleLogout = () => {
//     if (window.confirm('确定退出吗？')) {
//       logout();
//       navigate('/login');
//     }
//   };

//   // 根据当前路由的选中的项的需要设置
//   const selectedKeys = React.useMemo(() => {
//     switch (location.pathname) {
//       case '/':
//         return ['home'];
//       case '/categories':
//         return ['categories'];
//       case '/notes':
//         return ['notes'];
//       default:
//         return [];
//     }
//   }, [location]);

//   return (
//     <Header
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}
//     >
//       <Menu
//         theme="dark"
//         mode="horizontal"
//         selectedKeys={selectedKeys}
//         className="w-200"
//         items={[
//           {
//             key: 'home',
//             label: (
//               <Space size="middle">
//                 <HomeOutlined />
//                 <span>首页</span>
//               </Space>
//             ),
//             onClick: () => navigate('/'),
//           },
//           {
//             key: 'categories',
//             label: (
//               <Space size="middle">
//                 <AppstoreOutlined />
//                 <span>分类</span>
//               </Space>
//             ),
//             onClick: () => navigate('/categories'),
//           },
//           {
//             key: 'notes',
//             label: (
//               <Space size="middle">
//                 <FileOutlined />
//                 <span>笔记</span>
//               </Space>
//             ),
//             onClick: () => navigate('/notes'),
//           },
//         ]}
//       />
//       <div>
//         {user ? (
//           <Space onClick={() => navigate('/user-center')}>
//             {user.avatar_url ? (
//               <Avatar src={user.avatar_url} onClick={() => navigate('/user-center')} style={{ cursor: 'pointer' }} />
//             ) : (
//               <Avatar icon={<UserOutlined />} />
//             )}
//             <Text className="ml-2 text-white">
//               {user.nickname || user.username}
//             </Text>
//           </Space>
//         ) : (
//           <Button type="primary" onClick={() => navigate('/login')}>
//             登录
//           </Button>
//         )}
//       </div>
//     </Header>
//   );
// };

// export default Navbar;
