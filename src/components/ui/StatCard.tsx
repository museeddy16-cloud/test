import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change,
  color = 'primary'
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-icon">
        <Icon size={24} />
      </div>
      <div className="stat-card-content">
        <h4 className="stat-card-title">{title}</h4>
        <p className="stat-card-value">{value}</p>
        {change && (
          <div className={`stat-card-change ${change.type}`}>
            {change.type === 'increase' ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            <span>{Math.abs(change.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
