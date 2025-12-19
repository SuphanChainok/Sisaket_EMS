import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import { Product } from '@/types';

interface Props { products: Product[]; onEdit?: (p: Product) => void; onDelete?: (id: string) => void; }

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>สินค้า</th>
          <th>หมวด</th>
          <th>คงเหลือ</th>
          <th>หน่วย</th>
          <th style={{ textAlign: 'right' }}>การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p._id}>
            <td style={{ fontWeight: 'bold' }}>{p.name}</td>
            <td>{p.category}</td>
            <td>{p.quantity}</td>
            <td>{p.unit}</td>
            <td style={{ textAlign: 'right' }}>
              <Button variant="ghost" onClick={() => onEdit?.(p)}>แก้ไข</Button>
              <Button variant="danger" onClick={() => { if (confirm('ลบสินค้านี้?')) onDelete?.(p._id); }} style={{ marginLeft: 8 }}>ลบ</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
