interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Section({ id, children, className = "", style }: SectionProps) {
  return (
    <section 
      id={id}
      className={`min-h-screen snap-start snap-always flex items-center justify-center py-20 px-8 ${className}`}
      style={style}
    >
      <div className="max-w-4xl mx-auto text-center">
        {children}
      </div>
    </section>
  );
}
