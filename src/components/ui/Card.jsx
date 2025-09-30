export function Card({ className = "", children }) {
  return (
    <div className={"glass-card " + className}>
      <div className="inner">
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={"px-5 py-4 border-b border-white/10 " + className}>{children}</div>;
}

export function CardContent({ className = "", children }) {
  return <div className={"px-5 py-4 " + className}>{children}</div>;
}

export function CardFooter({ className = "", children }) {
  return <div className={"px-5 py-3 border-t border-white/10 " + className}>{children}</div>;
}


