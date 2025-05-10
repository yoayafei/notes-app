import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const { setUser } = useStore(); // 修正：从 store 中获取 setUser
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const response = await loginUser(values);
      setUser(response.data);
      alert('登录成功');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('用户名或密码错误');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <div className="bg-white p-8 rounded-md shadow-lg w-150 mx-auto mt-20">
        <Title level={2} className="text-center mb-6">
          {' '}
          {/* 修正括号语法 */}
          登录
        </Title>
        <Form name="login_form" onFinish={onSubmit} className="space-y-12">
          <Form.Item
            name="username"
            initialValue="yyf" // 修正属性名
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </Form.Item>
          <Form.Item
            name="password"
            initialValue="123456" // 修正属性名
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </Form.Item>
          <Button type="primary" className="w-full py-5" htmlType="submit">
            登录
          </Button>
        </Form>
        <div className="text-center mt-4">
          还没有账号？
          <a href="/register">去注册</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
