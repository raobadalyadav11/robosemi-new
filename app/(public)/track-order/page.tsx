'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  Search,
  Phone,
  Mail
} from 'lucide-react';

const mockTrackingData = {
  orderNumber: 'RBS123456',
  status: 'in_transit',
  estimatedDelivery: '2024-01-20',
  currentLocation: 'Mumbai Distribution Center',
  trackingHistory: [
    {
      status: 'Order Placed',
      location: 'Mumbai',
      date: '2024-01-15 10:30 AM',
      description: 'Your order has been confirmed and is being prepared'
    },
    {
      status: 'Processing',
      location: 'Mumbai Warehouse',
      date: '2024-01-15 02:45 PM',
      description: 'Items are being picked and packed'
    },
    {
      status: 'Shipped',
      location: 'Mumbai',
      date: '2024-01-16 09:15 AM',
      description: 'Package has been dispatched via courier'
    },
    {
      status: 'In Transit',
      location: 'Mumbai Distribution Center',
      date: '2024-01-17 11:20 AM',
      description: 'Package is on the way to destination'
    }
  ]
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (orderNumber.toLowerCase() === 'rbs123456') {
        setTrackingData(mockTrackingData);
      } else {
        setError('Order not found. Please check your order number.');
        setTrackingData(null);
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order placed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'in transit':
        return <MapPin className="h-5 w-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Track Your Order</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Enter your order number to get real-time updates on your shipment
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Tracking Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Your Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="Enter your order number (e.g., RBS123456)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Order Number</Label>
                    <p className="font-semibold">{trackingData.orderNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(trackingData.status)}>
                        {trackingData.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Estimated Delivery</Label>
                    <p className="font-semibold">{trackingData.estimatedDelivery}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm text-muted-foreground">Current Location</Label>
                  <p className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {trackingData.currentLocation}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.trackingHistory.map((event: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h4 className="font-semibold">{event.status}</h4>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                        <p className="text-sm mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about your order or need assistance with tracking, 
              our customer support team is here to help.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Call Us</p>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@robosemi.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}