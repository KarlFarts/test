import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Activity, Loader2 } from 'lucide-react';

export type ActivityType = 'task' | 'event' | 'announcement' | 'update';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  icon: string;
  message: string;
  timestamp: string;
  author: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  initialItems?: number;
  loadMoreText?: string;
  loadingMoreText?: string;
  noActivitiesText?: string;
  className?: string;
}

export function ActivityFeed({
  activities,
  initialItems = 5,
  loadMoreText = 'Load More',
  loadingMoreText = 'Loading...',
  noActivitiesText = 'No activities to show',
  className = '',
}: ActivityFeedProps) {
  const [visibleItems, setVisibleItems] = useState(initialItems);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const visibleActivities = sortedActivities.slice(0, visibleItems);
  const hasMore = visibleItems < sortedActivities.length;

  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
      setVisibleItems((prev) => Math.min(prev + 5, sortedActivities.length));
      setIsLoadingMore(false);
    }, 300);
  }, [sortedActivities.length]);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {visibleActivities.length > 0 ? (
        <>
          <div className="space-y-4">
            {visibleActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                data-testid={`activity-${activity.id}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(activity.priority)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{activity.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mt-1">
                    {activity.message}
                  </p>
                  {activity.status && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                      {activity.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="text-sm"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingMoreText}
                  </>
                ) : (
                  loadMoreText
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>{noActivitiesText}</p>
        </div>
      )}
    </div>
  );
}
