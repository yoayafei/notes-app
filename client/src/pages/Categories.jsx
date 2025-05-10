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
import { List, Card } from 'antd';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Categories = () => {
  const navigate = useNavigate();
  const user = useStore();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        alert('获取分类失败');
      }
    };
    fetchCategoriesData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>分类列表</h1>
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
      </div>
    </>
  );
};

export default Categories;
