
import React, { useState, useEffect } from "react";

interface ActivityItemProps {
  activity: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, timestamp }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex items-start space-x-4 py-3">
      <div className="space-y-1">
        <p className="text-sm">
          <span className="text-muted-foreground">{activity}</span>
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(timestamp)}</p>
      </div>
    </div>
  );
};

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItemProps[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:5018/api/dashboard/recent-activity");
        if (!response.ok) {
          throw new Error("Failed to fetch recent activity");
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="px-6 py-4">
      <div className="space-y-0 divide-y divide-border">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            activity={activity.activity}
            timestamp={activity.timestamp}
          />
        ))}
      </div>
      <div className="mt-4 text-center">
        <button className="text-sm text-company-blue hover:underline">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
