'use client';

interface HousekeepingStatsProps {
  taskStats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    urgent: number;
  };
}

export default function HousekeepingStats({ taskStats }: HousekeepingStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="card text-center">
        <div className="text-2xl font-bold text-secondary-900">{taskStats.total}</div>
        <div className="text-sm text-secondary-600">Total Tasks</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
        <div className="text-sm text-secondary-600">Pending</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
        <div className="text-sm text-secondary-600">In Progress</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
        <div className="text-sm text-secondary-600">Completed</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-red-600">{taskStats.urgent}</div>
        <div className="text-sm text-secondary-600">Urgent</div>
      </div>
    </div>
  );
}

