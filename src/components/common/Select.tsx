import '@/styles/components.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export default function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label className="input-label">{label}</label>}
      <select className={`select-base ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
