import { useState } from 'react';
import { Plus, Calendar, Mail, MessageSquare, Instagram, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Connection {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  lastSync?: string;
  enabled: boolean;
}

const mockConnections: Connection[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    icon: Calendar,
    status: 'connected',
    description: 'Sync all your calendar events and meetings',
    lastSync: '2 minutes ago',
    enabled: true
  },
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    status: 'connected',
    description: 'Extract events and reminders from emails',
    lastSync: '5 minutes ago',
    enabled: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageSquare,
    status: 'disconnected',
    description: 'Get reminders from chat messages',
    enabled: false
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    status: 'error',
    description: 'Track social events and meetups',
    lastSync: 'Failed 1 hour ago',
    enabled: false
  },
  {
    id: 'sms',
    name: 'SMS Messages',
    icon: Smartphone,
    status: 'disconnected',
    description: 'Parse appointments from text messages',
    enabled: false
  }
];

export const ConnectionsScreen = () => {
  const [connections, setConnections] = useState(mockConnections);
  const { toast } = useToast();

  const getStatusIcon = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-muted-foreground" />;
    }
  };

  const getStatusText = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Not connected';
    }
  };

  const getStatusStyle = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const toggleConnection = (connectionId: string) => {
    setConnections(connections.map(conn =>
      conn.id === connectionId
        ? { ...conn, enabled: !conn.enabled, status: !conn.enabled ? 'connected' : 'disconnected' }
        : conn
    ));
    
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      toast({
        title: connection.enabled ? "Disconnected" : "Connected",
        description: `${connection.name} ${connection.enabled ? 'disabled' : 'enabled'}`,
      });
    }
  };

  const handleAddConnection = () => {
    toast({
      title: "Add Connection",
      description: "New service integration coming soon!",
    });
  };

  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const totalCount = connections.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold">Connections</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your connected services
        </p>
        
        {/* Stats */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>{connectedCount} connected</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-muted-foreground rounded-full" />
            <span>{totalCount - connectedCount} available</span>
          </div>
        </div>
      </div>

      {/* Connections list */}
      <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-24">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={cn(
                  "p-2 rounded-lg",
                  connection.status === 'connected' ? 'bg-success/10' :
                  connection.status === 'error' ? 'bg-destructive/10' :
                  'bg-muted/50'
                )}>
                  <connection.icon className={cn(
                    "w-5 h-5",
                    connection.status === 'connected' ? 'text-success' :
                    connection.status === 'error' ? 'text-destructive' :
                    'text-muted-foreground'
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{connection.name}</h3>
                    {getStatusIcon(connection.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {connection.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn(
                      "text-xs",
                      getStatusStyle(connection.status)
                    )}>
                      {getStatusText(connection.status)}
                    </span>
                    
                    {connection.lastSync && (
                      <span className="text-xs text-muted-foreground">
                        Last sync: {connection.lastSync}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <Switch
                checked={connection.enabled}
                onCheckedChange={() => toggleConnection(connection.id)}
                className="ml-4"
              />
            </div>

            {/* Error message */}
            {connection.status === 'error' && (
              <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive-foreground">
                  Connection failed. Check your account permissions and try again.
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  Reconnect
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add connection button */}
      <div className="p-6 pt-2">
        <Button 
          className="w-full" 
          onClick={handleAddConnection}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new connection
        </Button>
      </div>
    </div>
  );
};