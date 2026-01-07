import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-bold text-lg tracking-tight">
              Pawn to Glory
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Elevate your chess game.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/course" className="text-sm text-muted-foreground hover:text-foreground">Courses</Link></li>
              <li><Link href="/tournament" className="text-sm text-muted-foreground hover:text-foreground">Tournaments</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="text-sm font-semibold tracking-wider uppercase">Social</h3>
             <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Pawn to Glory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
