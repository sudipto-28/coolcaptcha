import { Link } from "wouter";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  className?: string;
}

const defaultLinks: FooterLink[] = [
  { label: "Documentation", href: "#" },
  { label: "API Reference", href: "#" },
];
export const Footer = ({ className = "" }: FooterProps) => {
  return (
    <footer className={`bg-black py-10 border-t border-white/10 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              C
            </div>
            <span className="font-bold tracking-tight text-white">
              CoolCaptcha
            </span>
          </Link>

          <div className="flex gap-6 text-sm text-muted-foreground">
            {defaultLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 text-xs text-muted-foreground text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-center items-center  gap-4">
            <p>© 2026 CoolCaptcha.com. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
