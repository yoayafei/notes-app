import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Button, message, Popconfirm } from 'antd';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import {
  getTrashNotes,
  restoreNote,
  deleteNotePermanently,
} from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import Navbar from '@/components/Navbar';

const { Content } = Layout;

const TrashPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  // 获取已删除的笔记
  const fetchDeletedNotes = async () => {
    try {
      const response = await getTrashNotes(user.id);
      setNotes(response.data);
    } catch (error) {
      message.error('获取回收站笔记失败');
    } finally {
      setLoading(false);
    }
  };

  // 恢复笔记
  const handleRestore = async (noteId) => {
    try {
      await restoreNote(noteId);
      message.success('笔记恢复成功');
      fetchDeletedNotes();
    } catch (error) {
      message.error('恢复笔记失败');
    }
  };

  // 永久删除笔记
  const handlePermanentDelete = async (noteId) => {
    try {
      await deleteNotePermanently(noteId); // 永久删除笔记
      message.success('笔记已永久删除');
      fetchDeletedNotes();
    } catch (error) {
      message.error('永久删除笔记失败');
    }
  };

  useEffect(() => {
    fetchDeletedNotes();
  }, []);

  return (
    <>
      <Navbar />
      <Content className="p-4">
        <h1 style={{ marginBottom: '24px', color: '#000' }}>回收站</h1>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={notes}
          loading={loading}
          renderItem={(note) => (
            <List.Item>
              <Card
                title={note.title}
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                actions={[
                  <Button
                    type="text"
                    icon={<UndoOutlined />}
                    onClick={() => handleRestore(note.id)}
                    style={{ color: '#52c41a' }}
                  >
                    恢复
                  </Button>,
                  <Popconfirm
                    title="确定要永久删除这个笔记吗？"
                    description="此操作不可撤销"
                    onConfirm={() => handlePermanentDelete(note.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      永久删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <p style={{ color: 'rgba(0,0,0,0.65)' }}>
                  {note.content.length > 100
                    ? `${note.content.slice(0, 100)}...`
                    : note.content}
                </p>
              </Card>
            </List.Item>
          )}
        />
      </Content>
    </>
  );
};

export default TrashPage;
