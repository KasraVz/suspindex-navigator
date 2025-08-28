import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function SpecialOfferCard() {
  return (
    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-brand-gold" />
          </div>
          <CardTitle className="text-lg text-brand-gold">Special Offers</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Don't miss out on exclusive discounts and bundle deals on our certification 
          programs. Save up to 30% on selected exams and packages.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-brand-gold text-white hover:bg-brand-gold/90">
          <Link to="/dashboard/special-offer">
            View Offers
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}