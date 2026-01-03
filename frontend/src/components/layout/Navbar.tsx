import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="font-bold text-xl mr-6 flex items-center gap-2">
          JobTracker
        </Link>
        <SignedIn>
          <div className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <Link to="/kanban" className="text-sm font-medium transition-colors hover:text-primary">
              {t("nav.kanban")}
            </Link>
            <Link to="/analytics" className="text-sm font-medium transition-colors hover:text-primary">
              {t("nav.analytics")}
            </Link>
          </div>
        </SignedIn>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <LanguageSwitcher />
          
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <Button asChild variant="ghost" size="sm">
              <Link to="/sign-in">{t('nav.login')}</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
