import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { AddJobDialog } from "@/components/jobs/AddJobDialog";
import { useTranslation } from "react-i18next";

export function KanbanPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto py-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('nav.kanban')}</h1>
        <AddJobDialog />
      </div>
      <KanbanBoard />
    </div>
  );
}
