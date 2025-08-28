import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

export function FastTrakCard() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg text-primary">Fast Trak Program</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Accelerate your certification journey with our intensive Fast Trak program. 
          Reduce study time by 40% while maintaining the highest preparation standards.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link to="/dashboard/fast-trak">
            Learn More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}