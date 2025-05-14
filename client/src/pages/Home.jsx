// import { Layout, Typography } from 'antd';
// import Navbar from '@/components/Navbar';
// import { useStore } from '@/store/userStore';

// const { Content } = Layout;
// const { Title } = Typography;

// const Home = () => {
//   const { user } = useStore();

//   return (
//     <Layout>
//       <Navbar />
//       <Content className="p-6">
//         {user ? (
//           <Title level={2}>欢迎，{user.nickname || user.username}</Title>
//         ) : (
//           <Title level={2}>欢迎来到笔记应用</Title>
//         )}
//         <p>这是主页。</p>
//       </Content>
//     </Layout>
//   );
// };

// export default Home;

import { Layout, Typography, Button, Card, Tag, Modal, message } from 'antd';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import { getImportantNotes, moveToTrash } from '@/api/noteApi';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [importantNotes, setImportantNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    const fetchImportantNotes = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await getImportantNotes(user.id);
        const notesData = response.data.notes || response.data || [];
        setImportantNotes(notesData);
      } catch (error) {
        console.error('Failed to fetch important notes:', error);
        setImportantNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImportantNotes();
  }, [user]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await moveToTrash(selectedNoteId);
      message.success('笔记已移至回收站');
      // 重新获取笔记列表
      const fetchImportantNotes = async () => {
        if (!user) return;
        try {
          const response = await getImportantNotes(user.id);
          const notesData = response.data.notes || response.data || [];
          setImportantNotes(notesData);
        } catch (error) {
          console.error('Failed to fetch important notes:', error);
          setImportantNotes([]);
        }
      };
      fetchImportantNotes();
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
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navbar />
      <Content style={{ padding: '50px 20px', textAlign: 'center' }}>
        <Card
          style={{
            width: '600px',
            margin: '0 auto',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {user ? (
            <Title level={2} style={{ color: '#333' }}>
              欢迎，{user.nickname || user.username}
            </Title>
          ) : (
            <Title level={2} style={{ color: '#333' }}>
              欢迎来到笔记应用
            </Title>
          )}
          <p style={{ color: '#666' }}>在这里，你可以记录和管理你的笔记。</p>
          {!user && (
            <Button
              type="primary"
              onClick={() => (window.location.href = '/login')}
            >
              登录
            </Button>
          )}
        </Card>

        <div style={{ marginTop: '30px' }}>
          <Title level={3} style={{ color: '#333' }}>
            重要笔记
          </Title>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              width: '66%',
              margin: '0 auto',
            }}
          >
            {loading ? (
              <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
                <Text>加载中...</Text>
              </div>
            ) : Array.isArray(importantNotes) && importantNotes.length > 0 ? (
              importantNotes.map((note) => (
                <Card
                  key={note.id}
                  className="bg-white m-1"
                  hoverable
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderTop: '3px solid #1890ff',
                    marginBottom: '8px',
                  }}
                >
                  <Card.Meta
                    title={note.title}
                    description={
                      <div
                        style={{
                          height: '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          marginBottom: '10px',
                        }}
                      >
                        {note.content.substring(0, 100) + '...'}
                      </div>
                    }
                  />
                  <div className="my-2">
                    {note.tags &&
                      note.tags.map((tag) => (
                        <Tag color="cyan" key={tag}>
                          {tag}
                        </Tag>
                      ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                    }}
                  >
                    <a href={`/notes/${note.id}`}>点击查看详情</a>
                    <div>
                      <Button
                        type="primary"
                        size="small"
                        style={{ marginRight: '8px' }}
                        onClick={() => navigate(`/notes/edit/${note.id}`)}
                      >
                        编辑
                      </Button>
                      <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => {
                          setSelectedNoteId(note.id);
                          setModalVisible(true);
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
                <Card>
                  <Text>暂无重要笔记，请在笔记详情页收藏笔记</Text>
                </Card>
              </div>
            )}
          </div>
        </div>

        <Modal
          title="确认删除"
          open={modalVisible}
          onOk={handleDelete}
          confirmLoading={loading}
          onCancel={() => {
            setModalVisible(false);
            setSelectedNoteId(null);
          }}
        >
          <p>确定要将此笔记移至回收站吗？</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Home;
