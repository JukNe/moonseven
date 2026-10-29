import Link from "next/link";

interface NavLinkProps {
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function NavLink({ href, onClick, children, className = "", style }: NavLinkProps) {
  const baseClasses = "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-zinc-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40";
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      style={style}
    >
      {children}
    </Link>
  );
}
