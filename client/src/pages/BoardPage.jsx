import Navbar from '../components/Layout/Navbar';
import KanbanBoard from '../components/Board/KanbanBoard';
import StatsPanel from '../components/Board/StatsPanel';

export default function BoardPage() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <StatsPanel />
        <KanbanBoard />
      </main>
    </div>
  );
}

