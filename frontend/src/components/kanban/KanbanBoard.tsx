import { DndContext, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { useJobs, useUpdateJobStatus, type Job } from "@/hooks/useJobs";
import { useState } from "react";
import { createPortal } from "react-dom";
import { JobCard } from "./JobCard";
import { useTranslation } from "react-i18next";
import { JobDetailSheet } from "../jobs/JobDetailSheet";

export function KanbanBoard() {
  const { t } = useTranslation();
  const { data: jobs = [], isLoading } = useJobs();
  const updateStatus = useUpdateJobStatus();
  
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: "applied", title: t('status.applied') },
    { id: "interviewing", title: t('status.interviewing') },
    { id: "offer", title: t('status.offer') },
    { id: "rejected", title: t('status.rejected') },
  ];

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current) {
      setActiveJob(event.active.data.current as Job);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveJob(null);
    const { active, over } = event;
    
    if (!over) return;

    const jobId = active.id as string;
    let newStatus = over.id as string;

    const isContainer = columns.map(c => c.id).includes(newStatus);
    
    if (!isContainer) {
        // Dropped on a card, find its status
        const overJob = jobs.find(j => j._id === over.id);
        if (overJob) {
            newStatus = overJob.status;
        } else {
            // Should not happen if data is consistent
            return; 
        }
    }

    const currentJob = jobs.find(j => j._id === jobId);
    
    // Only update if status changed
    if (currentJob && currentJob.status !== newStatus && columns.map(c => c.id).includes(newStatus)) {
        updateStatus.mutate({ id: jobId, status: newStatus });
    }
  }

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <DndContext 
        sensors={sensors} 
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[600px]">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            jobs={jobs.filter((j) => j.status === col.id)}
            onJobClick={setSelectedJob}
          />
        ))}
      </div>
       {createPortal(
        <DragOverlay>
          {activeJob ? <JobCard job={activeJob} /> : null}
        </DragOverlay>,
        document.body
      )}
      <JobDetailSheet job={selectedJob} onClose={() => setSelectedJob(null)} />
    </DndContext>
  );
}
