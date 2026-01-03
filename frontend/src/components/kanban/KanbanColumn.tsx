import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { JobCard } from "./JobCard";
import type { Job } from "@/hooks/useJobs";

interface KanbanColumnProps {
  id: string;
  title: string;
  jobs: Job[];
  onJobClick?: (job: Job) => void;
}

export function KanbanColumn({ id, title, jobs, onJobClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col bg-secondary/30 rounded-lg p-4 min-h-[500px] w-80 shrink-0">
      <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground">{title} ({jobs.length})</h3>
      
      <SortableContext id={id} items={jobs.map(j => j._id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex-1 space-y-2 min-h-[100px]">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onClick={onJobClick} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
