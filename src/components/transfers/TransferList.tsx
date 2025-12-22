import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import TransferStatus from './TransferStatus';
import { TransferRequest } from '@/types';

interface Props {
  transfers: TransferRequest[];
  onApprove?: (id: string) => void;
}

export default function TransferList({ transfers, onApprove }: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>วันที่</th>
          <th>ศูนย์</th>
          <th>รายการ</th>
          <th>สถานะ</th>
          <th style={{ textAlign: 'right' }}>จัดการ</th>
        </tr>
      </thead>
      <tbody>
        {transfers.map(t => (
          <tr key={t._id}>
            <td style={{ color: '#aaa' }}>{new Date(t.createdAt).toLocaleString('th-TH')}</td>
            <td style={{ fontWeight: 'bold' }}>{t.centerName}</td>
            <td>
              {t.items.map((it, i) => (
                <div key={i} style={{ fontSize: 13 }}>{it.productName} ×{it.quantity}</div>
              ))}
            </td>
            <td><TransferStatus status={t.status} /></td>
            <td style={{ textAlign: 'right' }}>
              {t.status === 'pending' && (
                <Button variant="success" onClick={() => onApprove?.(t._id)}>✔ อนุมัติ</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
