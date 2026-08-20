import { useState, useMemo, useEffect } from 'react'
import { Button, Col, Row } from 'antd';
import { Piano } from '@tonejs/piano'
import * as Tone from 'tone'
import './App.css'

const columns = [
  { id: '0', notes: ['F5', 'Eb5', 'C#5'] },
  { id: '1', notes: ['F#5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F#4', 'E4', 'D4', 'C4', 'Bb3', 'Gb3'] },
  { id: '2', notes: ['A5', 'G5', 'Bb4', 'G#4', 'F4', 'Eb4', 'C#4', 'B3', 'A3', 'G3', 'F3', 'Eb3', 'C#3'] },
  { id: '3', notes: ['E4', 'D4', 'C4', 'Bb3', 'G#3', 'F#3', 'E3', 'D3', 'C3', 'Bb2', 'G#2'] },
  { id: '4', notes: ['Bb5', 'G#5'] },
  { id: '5', notes: ['G3', 'F3', 'Eb3', 'C#3', 'B2', 'A2', 'G2', 'F2', 'Eb2', 'C#2'] }, 
  { id: '6', notes: ['C3', 'Bb2', 'G#2', 'F#2', 'E2', 'D2', 'C2', 'B1', 'A1', 'G1'] }, 
]

function App() {
  // 1. 改為陣列來記錄多個發聲中的音符
  const [activeNotes, setActiveNotes] = useState([]) 
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

    // 2. 將新音符加入 activeNotes 陣列中（使用 Set 避免重複）
    setActiveNotes(prev => [...new Set([...prev, note])]); 
    await Tone.start();  
    piano.keyDown({ note: note });  
    
    setTimeout(() => {
      piano.keyUp({ note: note });
      // 3. 結束時僅從陣列中移除該特定音符，不影響其他正在按的音
      setActiveNotes(prev => prev.filter(n => n !== note));
    }, 60);
  }

  return (
    <main className="yangqin-app" style={{ padding: '20px' }}>
      <header className="header" style={{ textAlign: 'center', marginBottom: '20px', color: '#fffdfd' }}>
        <h1 style={{ color: '#fffdfd' }}>揚琴</h1>
        <h2 style={{ color: '#fffdfd' }}>402</h2>
        <p className="hint">
          {isLoaded ? '點擊可彈奏' : '載入音檔，請稍候...'}
        </p>
        <hr className="line" />
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', paddingBottom: '20px' }}>
        <Row style={{ display: 'flex', flexWrap: 'nowrap' }}>
          <YangqinMainBody column={columns[0]} activeNotes={activeNotes} isLoaded={isLoaded} playNote={playNote} gap="70px" top="0px" />
          <YangqinMainBody column={columns[1]} activeNotes={activeNotes} isLoaded={isLoaded} playNote={playNote} gap="4px" top="0px" />
          <YangqinMainBody column={columns[2]} activeNotes={activeNotes} isLoaded={isLoaded} playNote={playNote} gap="80px" top="0px" />
          <YangqinMainBody column={columns[3]} activeNotes={activeNotes} isLoaded={isLoaded} playNote={playNote} gap="4px" top="50px" />
          <YangqinMainBody column={columns[4]} activeNotes={activeNotes} isLoaded={isLoaded} playNote={playNote} gap="0px" top="0px" />
          <YangqinMainBody column={columns[5]} activeNotes={activeNotes} isLoaded={isLoaded} playNote={playNote} gap="70px" top="95px" />
          <YangqinMainBody column={columns[6]} activeNotes={activeNotes} isLoaded={isLoaded} playNote={playNote} gap="70px" top="95px" />
        </Row>
      </div>
    </main>
  )
}

const YangqinMainBody = ({ column, activeNotes, isLoaded, playNote, gap, top }) => {
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
      <div className="note-column" style={{ width: '90px', background: '#f5f5f5', padding: '5px', borderRadius: '8px' }}>
        <div className="note-list" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {column.notes.map((note) => (
            <Button 
              key={`${column.id}-${note}`}
              type={activeNotes.includes(note) ? 'primary' : 'default'}
              loading={!isLoaded}
              // 統一用 onPointerDown 處理滑鼠點擊與平板多點觸控，按下時立即觸發，放開時不會重複觸發
              onPointerDown={(e) => {
                e.preventDefault(); // 防止手機/平板預設的縮放或滾動
                playNote(note);
              }}
              disabled={!isLoaded}
              style={{ width: '100%', height: '40px', padding: '0px', touchAction: 'none' }} 
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