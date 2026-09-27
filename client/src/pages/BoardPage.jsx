import Navbar from '../components/Layout/Navbar';
import KanbanBoard from '../components/Board/KanbanBoard';

export default function BoardPage() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <KanbanBoard />
      </main>
    </div>
  );
}
