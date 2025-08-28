import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

export function FastTrakCard() {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-brand-orange/10 via-brand-orange/5 to-brand-green/10 border-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/20 transition-all duration-500 hover:scale-[1.02] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-brand-green/5 opacity-50" />
      <div className="absolute top-2 right-2">
        <div className="bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          NEW
        </div>
      </div>
      <CardHeader className="pb-3 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-brand-orange to-brand-orange/80 rounded-xl shadow-lg">
            <Rocket className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-brand-orange mb-1">Fast Trak Program</CardTitle>
            <div className="text-xs text-brand-orange/70 font-medium">⚡ Accelerated Learning</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 relative">
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
          🚀 Accelerate your certification journey with our intensive Fast Trak program. 
          <span className="text-brand-orange font-semibold"> Reduce study time by 40%</span> while maintaining the highest preparation standards.
        </p>
      </CardContent>
      <CardFooter className="relative">
        <Button asChild className="w-full bg-gradient-to-r from-brand-orange to-brand-orange/90 hover:from-brand-orange/90 hover:to-brand-orange text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          <Link to="/dashboard/fast-trak">
            🎯 Learn More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}