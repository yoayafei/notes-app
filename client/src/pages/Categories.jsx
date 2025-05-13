// import React, { useState, useEffect } from 'react';
// import { List, Card } from 'antd';
// import { getCategories } from '@/api/categoryApi';
// import { useStore } from '@/store/userStore';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '@/components/Navbar';

// const Categories = () => {
//   const navigate = useNavigate();
//   const user = useStore();

//   useEffect(() => {
//     if (!user) navigate('/login');
//   }, [navigate, user]);

//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategoriesData = async () => {
//       try {
//         const fetchedCategories = await getCategories();
//         setCategories(fetchedCategories.data);
//       } catch (error) {
//         console.error('Failed to fetch categories:', error);
//         alert('获取分类失败');
//       }
//     };
//     fetchCategoriesData();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div>
//         <h1>分类列表</h1>
//         <List
//           grid={{ gutter: 16, column: 4 }}
//           dataSource={categories}
//           renderItem={(item) => (
//             <List.Item>
//               <Card hoverable className="m-2">
//                 <Card.Meta title={item.name} />
//                 <a href={`/notes/categories/${item.id}`}>查看分类笔记</a>
//               </Card>
//             </List.Item>
//           )}
//         />
//       </div>
//     </>
//   );
// };

// export default Categories;

import React, { useState, useEffect } from 'react';
import { List, Card, Button, Modal, Form, Input, message } from 'antd';
import { getCategories, createCategory } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { PlusOutlined } from '@ant-design/icons';

const Categories = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCategoriesData = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('获取分类失败');
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreateCategory = async (values) => {
    try {
      await createCategory({
        name: values.name,
        userId: user.id,
      });
      message.success('分类创建成功');
      fetchCategoriesData(); // 刷新分类列表
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create category:', error);
      message.error('创建分类失败');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h1>分类列表</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            添加分类
          </Button>
        </div>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={categories}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                className="m-2"
                style={{
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Card.Meta title={item.name} />
                <a href={`/notes/categories/${item.id}`}>查看分类笔记</a>
              </Card>
            </List.Item>
          )}
        />

        <Modal
          title="添加分类"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateCategory}>
            <Form.Item
              name="name"
              label="分类名称"
              rules={[{ required: true, message: '请输入分类名称' }]}
            >
              <Input placeholder="请输入分类名称" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                创建分类
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Categories;
