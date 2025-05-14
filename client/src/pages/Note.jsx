// import React, { useState, useEffect } from 'react';
// import { Card, Descriptions, Tag } from 'antd';
// import { getNote } from '@/api/noteApi';
// import { useStore } from '@/store/userStore';
// import { useNavigate, useParams } from 'react-router-dom';
// import Navbar from '@/components/Navbar';

// const Note = () => {
//   const user = useStore();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [note, setNote] = useState(null);

//   useEffect(() => {
//     if (!user) navigate('/login');
//   }, [navigate, user]);

//   useEffect(() => {
//     console.log('Note ID:', id);
//     if (!id) {
//       console.error('Note ID is missing');
//       navigate('/notes');
//     }
//   }, [id, navigate]);

//   useEffect(() => {
//     const fetchNoteDetails = async () => {
//       try {
//         const fetchedNote = await getNote(id);
//         console.log('Fetched note:', fetchedNote);
//         setNote(fetchedNote.data);
//       } catch (error) {
//         console.error('Failed to fetch note details:', error);
//         alert('获取笔记详情失败');
//         navigate('/notes');
//       }
//     };
//     fetchNoteDetails();
//   }, [id, navigate]);

//   if (!note) return <div>Loading...</div>;

//   return (
//     <>
//       <Navbar />
//       <Card className="note-card" hoverable>
//         <Card.Meta title={note.title} description={note.content} />
//         <div className="my-4">
//           {note.tags.map((tag) => (
//             <Tag color="cyan" key={tag}>
//               {tag}
//             </Tag>
//           ))}
//         </div>
//       </Card>
//     </>
//   );
// };

//

// export default Note;

import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, message } from 'antd';
import { getNote, toggleImportant } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { StarOutlined, StarFilled } from '@ant-design/icons';

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isImportant, setIsImportant] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    if (!id) {
      console.error('Note ID is missing');
      navigate('/notes');
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        setNote(fetchedNote.data);
        setIsImportant(fetchedNote.data.important === 1);
      } catch (error) {
        console.error('Failed to fetch note details:', error);
        message.error('获取笔记详情失败');
        navigate('/notes');
      }
    };
    fetchNoteDetails();
  }, [id, navigate]);

  const handleToggleImportant = async () => {
    setLoading(true);
    try {
      await toggleImportant(id, !isImportant);
      setIsImportant(!isImportant);
      message.success(isImportant ? '已取消收藏' : '已收藏');
    } catch (error) {
      console.error('Failed to toggle important status:', error);
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Card
        className="note-card"
        hoverable
        style={{
          margin: '50px auto',
          maxWidth: '800px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        extra={
          <Button
            type="text"
            icon={
              isImportant ? (
                <StarFilled style={{ color: '#1890ff' }} />
              ) : (
                <StarOutlined />
              )
            }
            onClick={handleToggleImportant}
            loading={loading}
          >
            {isImportant ? '取消收藏' : '收藏'}
          </Button>
        }
      >
        <Descriptions title={note.title} column={1}>
          <Descriptions.Item label="内容">{note.content}</Descriptions.Item>
          <Descriptions.Item label="标签">
            {note.tags.map((tag) => (
              <Tag color="cyan" key={tag}>
                {tag}
              </Tag>
            ))}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default Note;
