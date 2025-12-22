interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export default function Table({ children, className = '' }: TableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={`data-table ${className}`}>{children}</table>
    </div>
  );
}
