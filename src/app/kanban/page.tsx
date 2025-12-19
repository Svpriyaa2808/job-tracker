import { KanbanBoard } from '@/components/kanban/KanbanBoard';

export default function KanbanPage() {
  return (
    <div className="h-[calc(100vh-4rem)] p-6">
      <KanbanBoard />
    </div>
  );
}