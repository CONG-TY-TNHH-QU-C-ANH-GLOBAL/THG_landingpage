import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "DỊCH VỤ", href: "#services" },
  { label: "THG FULFILL", href: "#fulfill" },
  { label: "THG EXPRESS", href: "#express" },
  { label: "THG WAREHOUSE", href: "#warehouse" },
  { label: "THG ORDER", href: "#order" },
  { label: "Q&A", href: "#faq" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center">
            <span className="text-primary-foreground font-serif font-bold text-lg">THG</span>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-navy leading-tight">THG Fulfill</h1>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Transport Happiness Group</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <Button className="hidden lg:flex bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-6">
          Tư vấn ngay
        </Button>

        {/* Mobile toggle */}
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-t border-border px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-sm font-medium text-foreground/80 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Button className="w-full bg-primary hover:bg-gold-dark text-primary-foreground rounded-full">
            Tư vấn ngay
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
