import { useState, useMemo, useEffect } from 'react'
import { Button, Col, Row } from 'antd';
import { Piano } from '@tonejs/piano'
import * as Tone from 'tone'
import './App.css'

const columns = [
  { id: '0', notes: ['F4', 'Eb4', 'C#4'] },
  { id: '1', notes: ['F#4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G3', 'F#3', 'E3', 'D3', 'C3', 'Bb2', 'Gb2'] },
  { id: '2', notes: ['A4', 'G4', 'Bb3', 'G#3', 'F3', 'Eb3', 'C#3', 'B2', 'A2', 'G2', 'F2', 'Eb2', 'C#2'] },
  { id: '3', notes: ['E3', 'D3', 'C3', 'Db2', 'G#2', 'Fb2', 'E2', 'D2', 'C2', 'Db1', 'G#1'] },
  { id: '4', notes: ['Bb4', 'G#4'] },
  { id: '5', notes: ['G2', 'F2', 'Eb2', 'C#2', 'B1', 'A1', 'G1', 'F1', 'Eb1', 'C#1'] }, 
  { id: '6', notes: ['C2', 'Bb1', 'G#1', 'F#1', 'E1', 'D1', 'C1', 'B1', 'A1', 'G1'] }, 
]

function App() {
  const [activeNote, setActiveNote] = useState('') 
  const [isLoaded, setIsLoaded] = useState(false)
  
  const piano = useMemo(() => new Piano({ velocities: 5 }), [])
  
  useEffect(() => {
    piano.toDestination();    
    piano.load().then(() => { 
      setIsLoaded(true)
    })
  }, [piano])

  const playNote = async (note) => {  
    if (!isLoaded) return;

    setActiveNote(note); 
    await Tone.start();  
    piano.keyDown({ note: note });  
    
    setTimeout(() => {
      piano.keyUp({ note: note });
      setActiveNote('');
    }, 100);
  }

  return (
    <main className="yangqin-app" style={{ padding: '20px' }}>
      <header className="header" style={{ textAlign: 'center', marginBottom: '20px', color: '#fffdfd' }}>
        <h1 style={{ color: '#fffdfd' }}  >揚琴</h1>
        <p className="hint">
          {isLoaded ? '點擊可彈奏' : '載入音檔，請稍候...'}
        </p>
        <hr className="line" />
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', paddingBottom: '20px' }}>
        <Row style={{ display: 'flex', flexWrap: 'nowrap' }}>
          <YangqinMainBody className="main0" column={columns[0]} activeNote={activeNote} isLoaded={isLoaded} playNote={playNote} gap="70px" top="0px" />
          <YangqinMainBody className="main1" column={columns[1]} activeNote={activeNote} isLoaded={isLoaded} playNote={playNote} gap="4px" top="0px" />
          <YangqinMainBody className="main2" column={columns[2]} activeNote={activeNote} isLoaded={isLoaded} playNote={playNote} gap="70px" top="0px" />
          <YangqinMainBody className="main3" column={columns[3]} activeNote={activeNote} isLoaded={isLoaded} playNote={playNote} gap="4px" top="50px" />
          <YangqinMainBody className="main4" column={columns[4]} activeNote={activeNote} isLoaded={isLoaded} playNote={playNote} gap="70px" top="0px" />
          <YangqinMainBody className="main4" column={columns[5]} activeNote={activeNote} isLoaded={isLoaded} playNote={playNote} gap="70px" top="60px" />
          <YangqinMainBody className="main5" column={columns[6]} activeNote={activeNote} isLoaded={isLoaded} playNote={playNote} gap="70px" top="70px" />
        </Row>
      </div>
    </main>
  )
}

const YangqinMainBody = ({ column, activeNote, isLoaded, playNote, gap, top }) => {
  if (!column) return null;

  return (
    <Col 
      key={column.id} 
      style={{ 
        marginRight: gap, 
        flexShrink: 0, 
        position: 'relative', 
        top: top 
      }}
    >
      <div className="note-column" style={{ width: '60px', background: '#f5f5f5', padding: '5px', borderRadius: '8px' }}>
        <div className="note-list" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {column.notes.map((note) => (
            <Button 
              key={`${column.id}-${note}`}
              type={activeNote === note ? 'primary' : 'default'}
              onClick={() => playNote(note)} 
              disabled={!isLoaded}
              style={{ width: '100%', padding: '0px' }} 
            >
              {note}
            </Button>
          ))}
        </div>
      </div>
    </Col>
  );
}

export default App