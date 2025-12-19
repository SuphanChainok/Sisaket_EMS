import '@/styles/components.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {props.children}
    </button>
  );
}