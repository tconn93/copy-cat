import { useRef } from 'react';
import { DiagramProvider } from './store/DiagramContext';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { DiagramCanvas } from './components/Canvas/DiagramCanvas';
import { AutoSave } from './components/AutoSave/AutoSave';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

function AppContent() {
  const stageRef = useRef(null);
  useKeyboardShortcuts();

  return (
    <>
      <AutoSave />
      <div className="app">
        <Toolbar stageRef={stageRef} />
        <Sidebar />
        <div className="canvas-container">
          <DiagramCanvas stageRef={stageRef} />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <DiagramProvider>
      <AppContent />
    </DiagramProvider>
  );
}

export default App;
