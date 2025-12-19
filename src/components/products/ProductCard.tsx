import Button from '@/components/common/Button';
import { Product } from '@/types';

interface Props { product: Product; onEdit?: (p: Product) => void; onDelete?: (id: string) => void; }

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.12)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: 0 }}>{product.name}</h4>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{product.category}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>{product.quantity} {product.unit}</div>
          <div style={{ fontSize: 12, color: '#888' }}>เตือนที่ {product.minAlert}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={() => onEdit?.(product)}>แก้ไข</Button>
        <Button variant="danger" onClick={() => { if (confirm('ลบสินค้านี้?')) onDelete?.(product._id); }}>ลบ</Button>
      </div>
    </div>
  );
}
