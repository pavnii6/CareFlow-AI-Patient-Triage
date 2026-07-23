'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn, formatDateTime } from '@/lib/utils';
import { NOTIFICATIONS } from '@/data/notifications';
import {
  Bell, AlertTriangle, Info, CheckCircle, AlertOctagon,
  Filter, Check, Trash2, X
} from 'lucide-react';
import type { Notification, NotificationType } from '@/types';

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; colors: string; bg: string }> = {
  critical: { icon: AlertOctagon, colors: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' },
  warning:  { icon: AlertTriangle, colors: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30' },
  info:     { icon: Info, colors: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30' },
  success:  { icon: CheckCircle, colors: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  const filtered = notifications.filter(n => filter === 'all' || n.type === filter);
  const unread = notifications.filter(n => !n.read).length;

  function markRead(id: string) {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  }
  function markAllRead() {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  }
  function dismiss(id: string) {
    setNotifications(ns => ns.filter(n => n.id !== id));
  }

  const counts: Record<string, number> = {
    critical: notifications.filter(n => n.type === 'critical').length,
    warning:  notifications.filter(n => n.type === 'warning').length,
    info:     notifications.filter(n => n.type === 'info').length,
    success:  notifications.filter(n => n.type === 'success').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notification Centre</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time alerts for critical patients, machine status, and system events</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm hover:bg-accent transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark all read ({unread})
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['critical', 'warning', 'info', 'success'] as const).map(type => {
          const { icon: Icon, colors } = TYPE_CONFIG[type];
          return (
            <Card key={type} className="p-4 cursor-pointer hover:shadow-card-hover transition-all" onClick={() => setFilter(type)}>
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl bg-muted flex items-center justify-center', colors)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{counts[type]}</div>
                  <div className="text-xs text-muted-foreground capitalize">{type}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {(['all', 'critical', 'warning', 'info', 'success'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
              filter === f ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
            )}>
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <div className="text-sm font-medium text-foreground">No notifications</div>
            <div className="text-xs text-muted-foreground mt-1">You&apos;re all caught up</div>
          </Card>
        ) : (
          filtered.map(notification => {
            const { icon: Icon, colors, bg } = TYPE_CONFIG[notification.type];
            return (
              <div
                key={notification.id}
                className={cn(
                  'relative rounded-2xl border p-4 transition-all',
                  notification.read ? 'bg-card border-border opacity-70' : bg,
                  notification.type === 'critical' && !notification.read && 'critical-pulse'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    notification.read ? 'bg-muted' : `bg-white/70 dark:bg-white/5`
                  )}>
                    <Icon className={cn('w-5 h-5', notification.read ? 'text-muted-foreground' : colors)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('font-semibold text-sm', notification.read ? 'text-muted-foreground' : 'text-foreground')}>
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                          {notification.category}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatDateTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className={cn('text-sm mt-1 leading-relaxed', notification.read ? 'text-muted-foreground' : 'text-foreground')}>
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => markRead(notification.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(notification.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
