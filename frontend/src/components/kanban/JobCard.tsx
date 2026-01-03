import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job } from "@/hooks/useJobs";

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: job._id, data: { ...job } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2 touch-none">
      <Card 
        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        onClick={() => onClick?.(job)}
      >
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">{job.position}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
          {job.companyName}
        </CardContent>
      </Card>
    </div>
  );
}
