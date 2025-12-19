import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { Center } from '@/types';

interface Props {
  center: Center;
  onEdit?: (center: Center) => void;
  onDelete?: (id: string) => void;
}

export default function CenterCard({ center, onEdit, onDelete }: Props) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0 }}>{center.name}</h3>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{center.location}</div>
          <div style={{ marginTop: 10, color: 'var(--text-secondary)' }}>📞 {center.contact}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Badge status={center.status} />
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>{center.population} คน</div>
            <div style={{ fontSize: '0.85rem', color: '#aaa' }}>รองรับ {center.capacity}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 15, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={() => onEdit?.(center)}>✏️ แก้ไข</Button>
        <Button variant="danger" onClick={() => { if (confirm('ลบศูนย์นี้ใช่หรือไม่?')) onDelete?.(center._id); }}>🗑️ ลบ</Button>
      </div>
    </Card>
  );
}
