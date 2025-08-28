import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FastTrak = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Fast Trak Tour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Experience accelerated learning with our Fast Trak program. Designed for busy professionals 
            who want to fast-track their certification journey, this comprehensive program combines 
            intensive study materials, expert guidance, and streamlined exam processes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our Fast Trak approach reduces traditional study time by 40% while maintaining the highest 
            standards of preparation. Join thousands of successful professionals who have achieved their 
            certification goals through our proven methodology.
          </p>
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-accent mb-2">What's Included:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Intensive study materials and practice tests</li>
              <li>One-on-one mentoring sessions</li>
              <li>Priority exam scheduling</li>
              <li>24/7 support during your preparation</li>
              <li>Money-back guarantee</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FastTrak;