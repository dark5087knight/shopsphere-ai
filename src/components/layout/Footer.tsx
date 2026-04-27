import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-1.5 text-2xl font-black">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>GLAM</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Trendy fashion, beauty & lifestyle — delivered fast, priced right.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/$slug" params={{ slug: "women" }} className="hover:text-primary">Women</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "men" }} className="hover:text-primary">Men</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "beauty" }} className="hover:text-primary">Beauty</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "home" }} className="hover:text-primary">Home</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary">Order Tracking</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Get 15% off</h4>
            <p className="text-sm text-muted-foreground mb-3">Sign up for sneak peeks and exclusive deals.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input type="email" placeholder="Email address" className="flex-1 rounded-full bg-background border border-input px-4 py-2 text-sm outline-none focus:border-primary" />
              <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Join</button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GLAM. All rights reserved.</p>
          <div className="flex gap-4">
            <select className="bg-transparent text-xs outline-none" defaultValue="USD">
              <option>USD $</option><option>EUR €</option><option>GBP £</option>
            </select>
            <select className="bg-transparent text-xs outline-none" defaultValue="EN">
              <option>EN</option><option>ES</option><option>FR</option><option>DE</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}