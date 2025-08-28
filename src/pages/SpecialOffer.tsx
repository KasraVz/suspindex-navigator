import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const offers = [
  {
    id: 1,
    title: "FPA Exam Discount",
    description: "Get 30% off on Financial Planning Association certification exam. Limited time offer!",
    discount: "30% OFF",
    originalPrice: "$299",
    offerPrice: "$209",
    gradient: "bg-gradient-to-br from-primary/10 to-primary/5",
    badgeColor: "bg-primary"
  },
  {
    id: 2,
    title: "EEA Bundle Special",
    description: "Complete Enterprise Excellence Assessment bundle with study materials and practice tests.",
    discount: "BUNDLE DEAL",
    originalPrice: "$599",
    offerPrice: "$399",
    gradient: "bg-gradient-to-br from-accent/10 to-accent/5",
    badgeColor: "bg-accent"
  },
  {
    id: 3,
    title: "Team Certification",
    description: "Special rates for team certifications. Perfect for organizations looking to upskill their workforce.",
    discount: "TEAM RATES",
    originalPrice: "$1,499",
    offerPrice: "$999",
    gradient: "bg-gradient-to-br from-secondary/10 to-secondary/5",
    badgeColor: "bg-secondary"
  }
];

const SpecialOffer = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Special Offers</h1>
        <p className="text-muted-foreground">
          Take advantage of our exclusive discounts and bundle deals to advance your career.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className={`relative overflow-hidden ${offer.gradient} border-2`}>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={`${offer.badgeColor} text-white`}>
                  {offer.discount}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground line-through">{offer.originalPrice}</p>
                  <p className="text-2xl font-bold text-primary">{offer.offerPrice}</p>
                </div>
              </div>
              <CardTitle className="text-xl">{offer.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {offer.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary mb-2">Need a Custom Package?</h3>
            <p className="text-muted-foreground mb-4">
              Contact our team to create a personalized certification package that fits your specific needs and budget.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Contact Sales Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialOffer;