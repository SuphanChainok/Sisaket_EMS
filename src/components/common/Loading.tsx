import '@/styles/components.css';

interface LoadingProps { size?: number; }

export default function Loading({ size = 36 }: LoadingProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
      <div className="spinner" style={{ width: size, height: size }} aria-hidden="true" />
    </div>
  );
}
