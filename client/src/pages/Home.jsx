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

import { Layout, Typography, Button, Card, Input, Row, Col } from 'antd';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import { getNotes } from '@/api/noteApi';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const Home = () => {
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchNotesData = await getNotes(user ? user.id : null);
        const notesData =
          fetchNotesData.data.notes || fetchNotesData.data || [];
        setNotes(notesData);
        setFilteredNotes(notesData);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        setNotes([]);
        setFilteredNotes([]);
      }
    };
    fetchNotes();
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchTerm, notes]);

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
          <Search
            placeholder="搜索笔记"
            allowClear
            enterButton="搜索"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={(value) => setSearchTerm(value)}
            style={{ width: '600px', margin: '0 auto', display: 'block' }}
          />
        </div>

        <div style={{ marginTop: '30px' }}>
          <Title level={3} style={{ color: '#333' }}>
            示例笔记
          </Title>
          <Row gutter={[16, 16]}>
            {Array.isArray(filteredNotes) && filteredNotes.length > 0 ? (
              filteredNotes.slice(0, 4).map((note) => (
                <Col span={12} key={note.id}>
                  <Card
                    hoverable
                    style={{
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Card.Meta
                      title={note.title}
                      description={note.content.substring(0, 100) + '...'}
                    />
                    <a href={`/notes/${note.id}`}>查看详情</a>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card>
                  <Text>暂无笔记</Text>
                </Card>
              </Col>
            )}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
