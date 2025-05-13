import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Pagination } from 'antd';
import { getNotesByCategory } from '../api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const CategoryNotes = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const fetchNotesByCategory = async (
    page = pagination.current,
    pageSize = pagination.pageSize,
  ) => {
    try {
      const fetchedNotes = await getNotesByCategory(
        user.id,
        categoryId,
        page,
        pageSize,
      );
      setNotes(fetchedNotes.data.notes || []);
      setPagination({
        ...pagination,
        current: page,
        total: fetchedNotes.data.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch notes by category:', error);
      alert('获取笔记失败');
    }
  };

  useEffect(() => {
    if (user && categoryId) {
      fetchNotesByCategory(1);
    }
  }, [categoryId, user]);

  if (!notes) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <h1>分类笔记列表</h1>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={notes}
        renderItem={(item) => (
          <List.Item>
            <Card className="bg-blue-100 m-2">
              <Card.Meta
                title={item.title}
                description={item.content.substring(0, 60) + '...'}
              />
              {item.tags && item.tags.length > 0 && (
                <div className="tags-container">
                  {item.tags.map((tag) => (
                    <Tag color="cyan" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
              <a href={`/notes/${item.id}`}>查看详情</a>
            </Card>
          </List.Item>
        )}
      />
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => {
            fetchNotesByCategory(page, pageSize);
          }}
          showSizeChanger={false}
          showTotal={(total) => `共 ${total} 条笔记`}
        />
      </div>
    </>
  );
};

export default CategoryNotes;
