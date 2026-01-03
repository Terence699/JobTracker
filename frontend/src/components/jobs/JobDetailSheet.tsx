import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Job } from "@/hooks/useJobs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { api } from "@/services/api";
import { Trash2 } from "lucide-react";

interface JobDetailSheetProps {
  job: Job | null;
  onClose: () => void;
}

export function JobDetailSheet({ job, onClose }: JobDetailSheetProps) {
    const { t } = useTranslation();
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
    
    const [position, setPosition] = useState(job?.position || "");
    const [companyName, setCompanyName] = useState(job?.companyName || "");
    const [jobUrl, setJobUrl] = useState(job?.jobUrl || "");
    const [notes, setNotes] = useState(job?.notes || "");
    
    useEffect(() => {
        if (job) {
            setPosition(job.position || "");
            setCompanyName(job.companyName || "");
            setJobUrl(job.jobUrl || "");
            setNotes(job.notes || "");
        }
    }, [job]);

    const updateJob = useMutation({
        mutationFn: async (data: Partial<Job>) => {
            const token = await getToken();
            return api.put(`/api/jobs/${job?._id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
    });

    const deleteJob = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return api.delete(`/api/jobs/${job?._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            onClose();
        }
    });

    if (!job) return null;

    const handleSave = () => {
        updateJob.mutate({ position, companyName, jobUrl, notes });
    };

    const handleDelete = () => {
        deleteJob.mutate();
    };

    return (
        <Sheet open={!!job} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{job.position}</SheetTitle>
                    <SheetDescription>{job.companyName}</SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="position">{t('job.position')}</Label>
                        <Input 
                            id="position" 
                            value={position} 
                            onChange={(e) => setPosition(e.target.value)}
                            placeholder="Frontend Engineer"
                        />
                    </div>

                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="companyName">{t('job.company')}</Label>
                        <Input 
                            id="companyName" 
                            value={companyName} 
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Acme Inc."
                        />
                    </div>

                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="jobUrl">{t('job.jobUrl')}</Label>
                        <Input 
                            id="jobUrl" 
                            value={jobUrl} 
                            onChange={(e) => setJobUrl(e.target.value)}
                            placeholder="https://..."
                            type="url"
                        />
                    </div>

                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="notes">{t('job.notes')}</Label>
                        <Textarea 
                            id="notes" 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            rows={10}
                            placeholder="Add your notes here..."
                        />
                    </div>
                    
                    <div className="flex justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('common.delete')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('job.deleteConfirmTitle')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('job.deleteConfirmDesc')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} disabled={deleteJob.isPending}>
                                        {deleteJob.isPending ? t('common.loading') : t('common.delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button onClick={handleSave} disabled={updateJob.isPending}>
                            {updateJob.isPending ? t('common.loading') : t('common.save')}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
