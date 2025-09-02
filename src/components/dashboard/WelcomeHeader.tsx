import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function WelcomeHeader() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="bg-gradient-to-r from-brand-orange to-brand-green text-white">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, John Doe
          </h1>
          <p className="text-lg opacity-90">
            Welcome back to your Supsindex dashboard. Here's what's happening today.
          </p>
        </div>
        <Button asChild variant="secondary" size="lg" className="hidden sm:flex items-center justify-center px-6 py-3">
          <Link to="/dashboard/exams/booked" className="text-center">
            Book a Test Now!
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}