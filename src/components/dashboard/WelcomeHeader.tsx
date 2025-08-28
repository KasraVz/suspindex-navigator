import { Card, CardContent } from "@/components/ui/card";

export function WelcomeHeader() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, John Doe
        </h1>
        <p className="text-lg opacity-90">
          Welcome back to your Suspindex dashboard. Here's what's happening today.
        </p>
      </CardContent>
    </Card>
  );
}