import Badge from '@/components/common/Badge';

interface Props { status: string; }

export default function TransferStatus({ status }: Props) {
  // แปลสเตตัสเป็นข้อความภาษาไทยถ้าต้องการ
  const label = status === 'pending' ? 'รออนุมัติ' : status === 'approved' ? 'อนุมัติ' : status === 'rejected' ? 'ปฏิเสธ' : status;
  return <Badge status={label} />;
}
