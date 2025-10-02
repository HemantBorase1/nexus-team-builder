export function Card({ className = "", children }) {
  return (
    <div className={"glass-card hover-glow transition-transform " + className}>
      <div className="inner p-6">
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={"px-6 py-4 border-b border-white/10 " + className}>{children}</div>;
}

export function CardContent({ className = "", children }) {
  return <div className={"px-6 py-4 " + className}>{children}</div>;
}

export function CardFooter({ className = "", children }) {
  return <div className={"px-6 py-3 border-t border-white/10 " + className}>{children}</div>;
}


