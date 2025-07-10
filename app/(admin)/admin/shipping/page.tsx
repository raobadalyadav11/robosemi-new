'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Truck, Package, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Shipment {
  _id: string;
  order: {
    orderNumber: string;
    user: {
      name: string;
    };
  };
  awbCode?: string;
  courierName?: string;
  status: string;
  estimatedDelivery?: string;
  shippingCharges: number;
  createdAt: string;
}

const statusColors = {
  created: 'bg-gray-100 text-gray-800',
  assigned: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-yellow-100 text-yellow-800',
  in_transit: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  returned: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockShipments: Shipment[] = [
        {
          _id: '1',
          order: {
            orderNumber: 'RBS123456',
            user: { name: 'John Doe' }
          },
          awbCode: 'AWB123456789',
          courierName: 'BlueDart',
          status: 'in_transit',
          estimatedDelivery: '2024-01-20',
          shippingCharges: 50,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          order: {
            orderNumber: 'RBS123457',
            user: { name: 'Jane Smith' }
          },
          awbCode: 'AWB123456790',
          courierName: 'DTDC',
          status: 'delivered',
          estimatedDelivery: '2024-01-18',
          shippingCharges: 0,
          createdAt: '2024-01-14T09:15:00Z'
        }
      ];
      
      setShipments(mockShipments);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [page, searchQuery]);

  const handleCreateShipment = async (orderId: string) => {
    try {
      const response = await fetch('/api/shipping/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        fetchShipments();
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  const stats = [
    {
      title: 'Total Shipments',
      value: '1,234',
      change: '+12.5%',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'In Transit',
      value: '156',
      change: '+8.2%',
      icon: Truck,
      color: 'text-purple-600',
    },
    {
      title: 'Delivered Today',
      value: '89',
      change: '+15.3%',
      icon: MapPin,
      color: 'text-green-600',
    },
    {
      title: 'Avg. Delivery Time',
      value: '3.2 days',
      change: '-0.5 days',
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shipping Management</h1>
        <p className="text-muted-foreground">
          Track and manage shipments with Shiprocket integration
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Shipments</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search shipments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>AWB Code</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Charges</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{shipment.order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.order.user.name}</TableCell>
                      <TableCell>
                        {shipment.awbCode ? (
                          <span className="font-mono text-sm">{shipment.awbCode}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {shipment.courierName || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[shipment.status as keyof typeof statusColors]}>
                          {shipment.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {shipment.estimatedDelivery 
                          ? format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {shipment.shippingCharges === 0 ? (
                          <span className="text-green-600 font-medium">Free</span>
                        ) : (
                          `₹${shipment.shippingCharges}`
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Generate Label</DropdownMenuItem>
                            <DropdownMenuItem>Cancel Shipment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}