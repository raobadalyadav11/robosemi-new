interface ShiprocketConfig {
  email: string;
  password: string;
  baseUrl: string;
}

interface ShiprocketOrder {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_phone?: string;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
    hsn?: number;
  }>;
  payment_method: string;
  shipping_charges: number;
  giftwrap_charges: number;
  transaction_charges: number;
  total_discount: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

interface ShiprocketResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

export class ShiprocketService {
  private config: ShiprocketConfig;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.config = {
      email: process.env.SHIPROCKET_EMAIL || '',
      password: process.env.SHIPROCKET_PASSWORD || '',
      baseUrl: process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external',
    };
  }

  private async authenticate(): Promise<string> {
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token!;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.config.email,
          password: this.config.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.token = data.token;
      this.tokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days

      return this.token!;
    } catch (error) {
      console.error('Shiprocket authentication error:', error);
      throw error;
    }
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const token = await this.authenticate();

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Shiprocket API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  async createOrder(orderData: ShiprocketOrder): Promise<ShiprocketResponse> {
    try {
      return await this.makeRequest('/orders/create/adhoc', 'POST', orderData);
    } catch (error) {
      console.error('Error creating Shiprocket order:', error);
      throw error;
    }
  }

  async generateAWB(shipmentId: number, courierId: number): Promise<any> {
    try {
      return await this.makeRequest('/courier/assign/awb', 'POST', {
        shipment_id: shipmentId,
        courier_id: courierId,
      });
    } catch (error) {
      console.error('Error generating AWB:', error);
      throw error;
    }
  }

  async trackShipment(awbCode: string): Promise<any> {
    try {
      return await this.makeRequest(`/courier/track/awb/${awbCode}`);
    } catch (error) {
      console.error('Error tracking shipment:', error);
      throw error;
    }
  }

  async getShippingRates(pickupPostcode: string, deliveryPostcode: string, weight: number, cod: boolean = false): Promise<any> {
    try {
      const params = new URLSearchParams({
        pickup_postcode: pickupPostcode,
        delivery_postcode: deliveryPostcode,
        weight: weight.toString(),
        cod: cod ? '1' : '0',
      });

      return await this.makeRequest(`/courier/serviceability?${params}`);
    } catch (error) {
      console.error('Error getting shipping rates:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<any> {
    try {
      return await this.makeRequest('/orders/cancel', 'POST', {
        ids: [orderId],
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  async createReturn(orderId: string, returnItems: any[]): Promise<any> {
    try {
      return await this.makeRequest('/orders/create/return', 'POST', {
        order_id: orderId,
        order_items: returnItems,
      });
    } catch (error) {
      console.error('Error creating return:', error);
      throw error;
    }
  }

  async getOrderDetails(orderId: string): Promise<any> {
    try {
      return await this.makeRequest(`/orders/show/${orderId}`);
    } catch (error) {
      console.error('Error getting order details:', error);
      throw error;
    }
  }

  async updatePickupLocation(pickupLocationData: any): Promise<any> {
    try {
      return await this.makeRequest('/settings/company/addpickup', 'POST', pickupLocationData);
    } catch (error) {
      console.error('Error updating pickup location:', error);
      throw error;
    }
  }
}

export const shiprocketService = new ShiprocketService();