import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { ArrowRight, BarChart3, Columns3 } from "lucide-react";

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container max-w-4xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {t("landing.heroTitle")}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("landing.heroSubtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Button asChild size="lg" className="h-12 px-8 text-lg rounded-full">
                <Link to="/sign-in">
                  {t("landing.ctaLogin")} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
                <a href="#features">{t("landing.ctaSeeFeatures")}</a>
              </Button>
            </SignedOut>

            <SignedIn>
              <Button asChild size="lg" className="h-12 px-8 text-lg rounded-full">
                <Link to="/kanban">
                  {t("landing.ctaOpenApp")} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
                <Link to="/analytics">{t("landing.ctaViewAnalytics")}</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.featuresTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("landing.featuresSubtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-muted transition-all hover:shadow-lg hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Columns3 className="h-6 w-6" />
                  </div>
                  {t("landing.featureKanbanTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base leading-relaxed">
                {t("landing.featureKanbanDesc")}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-muted transition-all hover:shadow-lg hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  {t("landing.featureAnalyticsTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base leading-relaxed">
                {t("landing.featureAnalyticsDesc")}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
