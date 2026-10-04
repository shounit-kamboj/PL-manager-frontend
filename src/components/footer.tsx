import { Link } from "react-router";
import { cn } from "@/lib/utils";

export const Footer = ({ className }: { className?: string }) => (
    <footer className={cn("border-t border-border bg-sidebar px-4 py-4 text-xs text-muted-foreground", className)}>
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p>© {new Date().getFullYear()} Collar PL</p>
            <nav className="flex gap-4">
                <Link to="/privacy" className="hover:text-foreground hover:underline">
                    Privacy
                </Link>
            </nav>
        </div>
    </footer>
);