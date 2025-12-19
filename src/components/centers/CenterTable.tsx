import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Center } from '@/types';

interface Props {
  centers: Center[];
  onEdit?: (center: Center) => void;
  onDelete?: (id: string) => void;
}

export default function CenterTable({ centers, onEdit, onDelete }: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>ที่อยู่</th>
          <th>ประเภท</th>
          <th>สถาณะ</th>
          <th style={{ textAlign: 'right' }}>การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        {centers.map((c) => (
          <tr key={c._id}>
            <td style={{ fontWeight: 'bold' }}>{c.name}</td>
            <td>{c.location}</td>
            <td>{c.type}</td>
            <td><Badge status={c.status} /></td>
            <td style={{ textAlign: 'right' }}>
              <Button variant="ghost" onClick={() => onEdit?.(c)}>แก้ไข</Button>
              <Button variant="danger" onClick={() => { if (confirm('ลบศูนย์นี้?')) onDelete?.(c._id); }} style={{ marginLeft: 8 }}>ลบ</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
