import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
            C
          </div>
          <span className="font-bold text-xl tracking-tight">CoolCaptcha</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors">How it Works</Link>
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-white transition-colors">Features</Link>
          <Link href="/articles" className="text-sm text-white font-medium">Articles</Link>
          <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Pricing</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-sm">Sign In</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            Get API Key
          </Button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl"
          >
            <Link href="/" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/articles" className="text-lg font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>Articles</Link>
            <div className="h-px bg-white/10 my-2" />
            <Button variant="outline" className="w-full justify-center">Sign In</Button>
            <Button className="w-full justify-center bg-primary text-primary-foreground">Get API Key</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
