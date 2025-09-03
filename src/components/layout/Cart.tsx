import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/contexts/OrderContext";

export function Cart() {
  const { cartItems, removeFromCart } = useOrders();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Group items by bundleId
  const groupedItems = cartItems.reduce((acc, item) => {
    const key = item.bundleId || `individual-${item.id}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  const bundles = Object.entries(groupedItems).filter(([key, items]) => 
    items[0].bundleId && items.length > 1
  );
  
  const individualItems = Object.entries(groupedItems).filter(([key, items]) => 
    !items[0].bundleId || items.length === 1
  ).map(([_, items]) => items[0]);

  const handlePayBundle = (bundleItems: typeof cartItems) => {
    navigate("/dashboard/purchase", { 
      state: { cartItems: bundleItems }
    });
  };

  const handlePayIndividual = (item: typeof cartItems[0]) => {
    navigate("/dashboard/purchase", { 
      state: { cartItems: [item] }
    });
  };

  const handlePayAll = () => {
    navigate("/dashboard/purchase", { 
      state: { cartItems }
    });
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3">Shopping Cart</h3>
        {cartItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {/* Render Bundles */}
              {bundles.map(([bundleId, bundleItems]) => {
                const bundleTotal = bundleItems.reduce((sum, item) => sum + item.price, 0);
                return (
                  <div key={bundleId} className="border border-border rounded-lg p-3 bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Bundle ({bundleItems.length} items)
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {bundleItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">${item.price}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive/80 text-xs px-1 py-1 h-auto"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Total: ${bundleTotal}</span>
                      <Button
                        size="sm"
                        onClick={() => handlePayBundle(bundleItems)}
                        className="text-xs"
                      >
                        Pay Bundle
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Render Individual Items */}
              {individualItems.map((item) => (
                <div key={item.id} className="border-b border-border pb-3 last:border-b-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">${item.price}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive/80 text-xs px-2 py-1 h-auto flex-shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handlePayIndividual(item)}
                    className="w-full text-xs"
                  >
                    Pay Now (${item.price})
                  </Button>
                </div>
              ))}
            </div>
            
            {(bundles.length > 0 || individualItems.length > 1 || (bundles.length > 0 && individualItems.length > 0)) && (
              <>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-sm">Total All Items:</span>
                  <span className="font-semibold text-sm">${total}</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handlePayAll}
                  disabled={cartItems.length === 0}
                >
                  Pay All (${total})
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}