// 使用 unocss 编写的自定义导航组件
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/userStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from 'antd';
import './Navbar.css'; // 引入样式文件

const Navbar1 = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('确定退出？')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-menu">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">首页</Link>
        </li>
        <li
          className={
            location.pathname.startsWith('/categories') ? 'active' : ''
          }
        >
          <Link to="/categories">分类</Link>
        </li>
        <li className={location.pathname.startsWith('/notes') ? 'active' : ''}>
          <Link to="/notes">笔记</Link>
        </li>
      </ul>
      <div className="user-info">
        {user ? (
          <div onClick={handleLogout}>
            {user.avatar_url ? (
              <Avatar src={user.avatar_url} />
            ) : (
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: '#87d068' }}
              />
            )}
          </div>
        ) : (
          <Link to="/login" className="login-link">
            登录
          </Link>
        )}
        <span className="nickname">{user.nickname || user.username}</span>
      </div>
    </nav>
  );
};

export default Navbar1;
