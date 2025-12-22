import '@/styles/components.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div style={{ marginBottom: '15px' }}>
      {label && <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>{label}</label>}
      <input className={`input-base ${className}`} {...props} />
    </div>
  );
}