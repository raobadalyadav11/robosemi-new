'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Truck } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, getCartTotal, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [billingAddress, setBillingAddress] = useState({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [notes, setNotes] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = getCartTotal();
  const discount = 0; // Apply coupon logic here
  const shippingCost = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal - discount + shippingCost + tax;

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

  }, [user, cart, router]);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress]);

  const handleInputChange = (
    type: 'shipping' | 'billing',
    field: string,
    value: string
  ) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'zipCode'];
    
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        toast.error(`Please fill in the shipping ${field}`);
        return false;
      }
    }

    if (!sameAsShipping) {
      for (const field of requiredFields) {
        if (!billingAddress[field as keyof typeof billingAddress]) {
          toast.error(`Please fill in the billing ${field}`);
          return false;
        }
      }
    }

    return true;
  };

  const createOrder = async () => {
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.id,
          name: item.name,
          price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        subtotal,
        discount,
        shippingCost,
        tax,
        total,
        paymentMethod,
        notes,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async (order: any) => {
    try {
      // Create Razorpay order
      const paymentResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          receipt: order.orderNumber,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const paymentData = await paymentResponse.json();

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'RoboSemi',
        description: `Order #${order.orderNumber}`,
        order_id: paymentData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order._id,
              }),
            });

            if (verifyResponse.ok) {
              clearCart();
              toast.success('Payment successful!');
              router.push(`/account/orders/${order._id}`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#2563EB',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      toast.error('Failed to initiate payment');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const order = await createOrder();

      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(order);
      } else {
        // COD
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/account/orders/${order._id}`);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping-name">Full Name *</Label>
                    <Input
                      id="shipping-name"
                      value={shippingAddress.name}
                      onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-phone">Phone Number *</Label>
                    <Input
                      id="shipping-phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="shipping-street">Street Address *</Label>
                  <Input
                    id="shipping-street"
                    value={shippingAddress.street}
                    onChange={(e) => handleInputChange('shipping', 'street', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shipping-city">City *</Label>
                    <Input
                      id="shipping-city"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-state">State *</Label>
                    <Input
                      id="shipping-state"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-zip">ZIP Code *</Label>
                    <Input
                      id="shipping-zip"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="same-as-shipping"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="same-as-shipping">Same as shipping address</Label>
                </div>

                {!sameAsShipping && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing-name">Full Name *</Label>
                        <Input
                          id="billing-name"
                          value={billingAddress.name}
                          onChange={(e) => handleInputChange('billing', 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-phone">Phone Number *</Label>
                        <Input
                          id="billing-phone"
                          type="tel"
                          value={billingAddress.phone}
                          onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="billing-street">Street Address *</Label>
                      <Input
                        id="billing-street"
                        value={billingAddress.street}
                        onChange={(e) => handleInputChange('billing', 'street', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billing-city">City *</Label>
                        <Input
                          id="billing-city"
                          value={billingAddress.city}
                          onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-state">State *</Label>
                        <Input
                          id="billing-state"
                          value={billingAddress.state}
                          onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-zip">ZIP Code *</Label>
                        <Input
                          id="billing-zip"
                          value={billingAddress.zipCode}
                          onChange={(e) => handleInputChange('billing', 'zipCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center gap-2">
                      Online Payment (Razorpay)
                      <Badge variant="secondary">Recommended</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions for your order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cart.map((item) => {
                    const finalPrice = item.discount 
                      ? item.price * (1 - item.discount / 100)
                      : item.price;
                    
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium line-clamp-1">{item.name}</div>
                          <div className="text-muted-foreground">
                            Qty: {item.quantity} × ₹{finalPrice.toLocaleString()}
                          </div>
                        </div>
                        <div className="font-medium">
                          ₹{(finalPrice * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Place Order - ₹${total.toLocaleString()}`
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}