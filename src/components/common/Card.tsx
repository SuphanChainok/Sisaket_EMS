interface CardProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
}

export default function Card({ children, title, action }: CardProps) {
  return (
    <div style={{ 
      backgroundColor: 'var(--bg-card)', 
      borderRadius: '12px', 
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)' 
    }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #333' }}>
          {title && <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}