import { useState } from 'react';
import { CheckCircle2, Circle, AlertTriangle, Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TodayTask {
  id: string;
  title: string;
  time: string;
  status: 'todo' | 'done' | 'missed';
  category?: string;
}

const mockTodayTasks: TodayTask[] = [
  { id: '1', title: 'Morning workout', time: '7:00 AM', status: 'done', category: 'Health' },
  { id: '2', title: 'Team standup meeting', time: '9:30 AM', status: 'done', category: 'Work' },
  { id: '3', title: 'Client call - Project review', time: '11:00 AM', status: 'missed', category: 'Work' },
  { id: '4', title: 'Lunch with Anna', time: '12:30 PM', status: 'todo', category: 'Personal' },
  { id: '5', title: 'Doctor appointment', time: '3:00 PM', status: 'todo', category: 'Health' },
  { id: '6', title: 'Grocery shopping', time: '5:00 PM', status: 'todo', category: 'Personal' },
  { id: '7', title: 'Evening escalade session', time: '7:00 PM', status: 'todo', category: 'Health' },
];

export const TodayScreen = () => {
  const [tasks, setTasks] = useState(mockTodayTasks);
  const { toast } = useToast();

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
        : task
    ));
  };

  const handleReschedule = (taskId: string) => {
    toast({
      title: "Reschedule",
      description: "Suggest tomorrow 2–3 PM?",
    });
  };

  const getStatusIcon = (status: TodayTask['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'missed':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTaskStyle = (status: TodayTask['status']) => {
    switch (status) {
      case 'done':
        return 'opacity-60 line-through';
      case 'missed':
        return 'border-l-4 border-destructive bg-destructive/5';
      default:
        return '';
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const missedTasks = tasks.filter(task => task.status === 'missed').length;
  const totalTasks = tasks.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold">Today</h1>
        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
          <span>{completedTasks}/{totalTasks} completed</span>
          {missedTasks > 0 && (
            <span className="text-destructive">{missedTasks} missed</span>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-muted h-2 rounded-full mt-3">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
        </div>
      </div>

      {/* Tasks list */}
      <div className="flex-1 px-6 space-y-3 overflow-y-auto pb-24">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "bg-card border border-border rounded-xl p-4 transition-all duration-200",
              getTaskStyle(task.status)
            )}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className="flex-shrink-0"
              >
                {getStatusIcon(task.status)}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={cn(
                    "font-medium",
                    task.status === 'done' && "line-through opacity-60"
                  )}>
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{task.time}</span>
                  </div>
                </div>
                
                {task.category && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full inline-block mt-1">
                    {task.category}
                  </span>
                )}
              </div>
            </div>

            {/* Missed task suggestion */}
            {task.status === 'missed' && (
              <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive-foreground mb-2">
                  Missed your {task.title.toLowerCase()}. Suggest reschedule tomorrow 2–3 PM?
                </p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleReschedule(task.id)}
                    className="text-xs"
                  >
                    Reschedule
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add task button */}
      <div className="p-6 pt-2">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => toast({ title: "Add Task", description: "Quick task creation coming soon!" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add quick task
        </Button>
      </div>
    </div>
  );
};