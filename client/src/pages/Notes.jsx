import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Modal, message, Pagination } from 'antd';
import { getNotes, moveToTrash } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const fetchNotes = async (
    page = pagination.current,
    pageSize = pagination.pageSize,
  ) => {
    try {
      const fetchNotesData = await getNotes(user.id, page, pageSize);
      setNotes(fetchNotesData.data.notes || []);
      setPagination({
        ...pagination,
        current: page,
        total: fetchNotesData.data.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      message.error('获取笔记失败');
    }
  };

  useEffect(() => {
    fetchNotes(1);
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await moveToTrash(selectedNoteId);
      message.success('笔记已移至回收站');
      fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
      message.error('删除笔记失败');
    } finally {
      setLoading(false);
      setModalVisible(false);
      setSelectedNoteId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>笔记列表</h1>
        <Button type="primary" onClick={() => navigate('/create-note')}>
          创建笔记
        </Button>
      </div>

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={notes}
        className="p-4"
        renderItem={(item) => (
          <Card
            className="bg-white m-2"
            hoverable
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <Card.Meta
              title={item.title}
              description={item.content.substring(0, 100) + '...'}
            />
            <div className="my-4">
              {item.tags.map((tag) => (
                <Tag color="cyan" key={tag}>
                  {tag}
                </Tag>
              ))}
            </div>
            <a href={`/notes/${item.id}`}>点击查看详情</a>
            <Button
              type="primary"
              onClick={() => navigate(`/notes/edit/${item.id}`)}
              style={{ marginRight: '8px' }}
            >
              编辑
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSelectedNoteId(item.id);
                setModalVisible(true);
              }}
            >
              删除
            </Button>
          </Card>
        )}
      />

      <Modal
        title="确认删除"
        open={modalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setModalVisible(false);
          setSelectedNoteId(null);
        }}
        confirmLoading={loading}
      >
        <p>确定要将这条笔记移至回收站吗？</p>
      </Modal>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => {
            fetchNotes(page, pageSize);
          }}
          showSizeChanger={false}
          showTotal={(total) => `共 ${total} 条笔记`}
        />
      </div>
    </>
  );
};

export default Notes;
