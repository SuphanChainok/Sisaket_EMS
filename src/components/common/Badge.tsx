import '@/styles/components.css';

interface BadgeProps {
  status: string;
  type?: 'active' | 'inactive' | 'warning' | 'danger';
}

export default function Badge({ status, type }: BadgeProps) {
  // Auto detect type based on status text if not provided
  let badgeType = type;
  if (!badgeType) {
    if (['active', 'approved', 'completed', 'ปกติ'].includes(status)) badgeType = 'active';
    else if (['pending', 'รออนุมัติ'].includes(status)) badgeType = 'warning';
    else if (['inactive', 'rejected', 'low', 'วิกฤต'].includes(status)) badgeType = 'danger';
    else badgeType = 'inactive';
  }

  return (
    <span className={`badge badge-${badgeType}`}>
      {status}
    </span>
  );
}