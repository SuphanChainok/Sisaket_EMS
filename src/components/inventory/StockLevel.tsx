interface Props { quantity: number; minAlert: number; }

export default function StockLevel({ quantity, minAlert }: Props) {
  // เปอร์เซ็นต์เทียบกับระดับเตือน (ถ้ามากกว่า 100% = ปลอดภัย)
  const percent = Math.min(100, Math.round((quantity / Math.max(1, minAlert)) * 100));
  const color = quantity <= minAlert ? 'var(--accent-red)' : 'var(--accent-green)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color }} />
      </div>
      <div style={{ minWidth: 70, textAlign: 'right', fontSize: 13 }}>{quantity} / {minAlert}</div>
    </div>
  );
}
