import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export interface CartItem {
  id: string;
  name: string;
  price: number;
}

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
}

export function Cart({ items, onRemoveItem }: CartProps) {
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handlePayNow = () => {
    navigate("/dashboard/purchase", { 
      state: { cartItems: items }
    });
  };

  return (
    <div className="w-80">
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3">Shopping Cart</h3>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="mb-4" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">${total}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handlePayNow}
              disabled={items.length === 0}
            >
              Pay Now
            </Button>
          </>
        )}
      </div>
    </div>
  );
}