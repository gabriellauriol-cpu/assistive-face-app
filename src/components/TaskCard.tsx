import { Clock, AlertCircle, CheckCircle2, Phone, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  type: 'reminder' | 'suggestion' | 'conflict' | 'missed';
  time?: string;
  description?: string;
  status?: 'pending' | 'done' | 'missed';
  priority?: 'low' | 'medium' | 'high';
}

interface TaskCardProps {
  task: Task;
  className?: string;
}

export const TaskCard = ({ task, className }: TaskCardProps) => {
  const getIcon = () => {
    switch (task.type) {
      case 'reminder':
        return <Clock className="w-5 h-5 text-primary" />;
      case 'suggestion':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'conflict':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'missed':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Calendar className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getCardStyle = () => {
    switch (task.type) {
      case 'conflict':
        return 'border-warning/30 bg-warning/5';
      case 'missed':
        return 'border-destructive/30 bg-destructive/5';
      case 'suggestion':
        return 'border-success/30 bg-success/5';
      default:
        return 'border-primary/30 bg-primary/5';
    }
  };

  const getTimeIcon = () => {
    if (task.title.toLowerCase().includes('call')) return <Phone className="w-4 h-4" />;
    if (task.title.toLowerCase().includes('meeting')) return <Calendar className="w-4 h-4" />;
    if (task.title.toLowerCase().includes('gym') || task.title.toLowerCase().includes('escalade')) return <MapPin className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className={cn(
      "card-interactive space-y-4",
      getCardStyle(),
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{task.title}</h3>
            {task.time && (
              <div className="flex items-center space-x-1 mt-1 text-sm text-muted-foreground">
                {getTimeIcon()}
                <span>{task.time}</span>
              </div>
            )}
          </div>
        </div>
        
        {task.priority && (
          <div className={cn(
            "w-2 h-2 rounded-full",
            task.priority === 'high' && "bg-destructive",
            task.priority === 'medium' && "bg-warning",
            task.priority === 'low' && "bg-success"
          )} />
        )}
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {task.description}
        </p>
      )}

      {task.type === 'missed' && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-sm text-destructive-foreground">
            Missed your call. Suggest reschedule tomorrow 2–3 PM?
          </p>
        </div>
      )}

      {task.type === 'suggestion' && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-3">
          <p className="text-sm text-success-foreground">
            You have 2h free. Perfect time for this activity!
          </p>
        </div>
      )}

      {task.type === 'conflict' && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <p className="text-sm text-warning-foreground">
            This overlaps with another appointment. Choose one to keep.
          </p>
        </div>
      )}
    </div>
  );
};