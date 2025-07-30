import connectDB from "./mongodb";
import User from "./models/User";
import Product from "./models/Product";
import Category from "./models/Category";
import Coupon from "./models/Coupon";
import Order from "./models/Order";
import bcryptjs from "bcryptjs";
import Review from "./models/Review";

export async function seedDatabase() {
  try {
    await connectDB();
    console.log("deleting  data from db...");
    // Clear existing data
    // await Promise.all([
    //   User.deleteMany({}),
    //   Product.deleteMany({}),
    //   Category.deleteMany({}),
    //   Coupon.deleteMany({}),
    //   Order.deleteMany({}),
    //   Review.deleteMany({}),
    // ]);

    console.log("Data seeding started.");

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@robosemi.com",
      password: await bcryptjs.hash("admin123", 12),
      role: "admin",
      phone: "+91 9876543210",
      isActive: true,
      emailVerified: true,
    });

    // Create regular users
    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: await bcryptjs.hash("password123", 12),
        role: "user",
        phone: "+91 9876543211",
        addresses: [
          {
            type: "home",
            street: "123 Main Street",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
            isDefault: true,
          },
        ],
      },
    ]);

    // Create categories
    const categories = await Category.create([
      {
        name: "Microcontrollers",
        icon: "Code",
        description: "Arduino, Raspberry Pi and other microcontrollers",
      },
      {
        name: "Sensors",
        icon: "Sensor",
        description: "Temperature, humidity, motion and other sensors",
      },
      {
        name: "Motors",
        icon: "Motor",
        description: "Servo motors, stepper motors and DC motors",
      },
      {
        name: "Displays",
        icon: "Monitor",
        description: "LCD, OLED and LED displays",
      },
      {
        name: "Components",
        icon: "Components",
        description: "Resistors, capacitors and other electronic components",
      },
      {
        name: "Modules",
        icon: "Module",
        description: "WiFi, Bluetooth and communication modules",
      },
      {
        name: "Automation",
        icon: "Settings",
        description: "Components for automation systems",
      },
      {
        name: "Electronics",
        icon: "Zap",
        description: "Electronic components and modules",
      },
      {
        name: "Actuators",
        icon: "Move",
        description: "Actuators for motion and control",
      },
      {
        name: "Controllers",
        icon: "Cpu",
        description: "Microcontrollers and development boards",
      },
      {
        name: "Accessories",
        icon: "Wrench",
        description: "Accessories for electronics projects",
      },
      {
        name: "Robotics",
        icon: "Bot",
        description: "Components for building and programming robots",
      },
      {
        name: "Power Supplies",
        icon: "Battery",
        description: "Power sources and converters for electronic projects",
      },
      {
        name: "Communication",
        icon: "Wifi",
        description: "Modules for wireless and wired communication",
      },
      {
        name: "Cables & Connectors",
        icon: "Link",
        description: "Wires and connectors for circuit assembly",
      },
      {
        name: "Tools",
        icon: "Hammer",
        description: "Tools for electronics and prototyping",
      },
      {
        name: "Storage",
        icon: "HardDrive",
        description: "Memory cards and storage solutions",
      },
      {
        name: "Audio Components",
        icon: "Speaker",
        description: "Speakers, microphones, and audio modules",
      },
      {
        name: "IoT Devices",
        icon: "Cloud",
        description: "Devices for Internet of Things applications",
      },
      {
        name: "Batteries",
        icon: "BatteryCharging",
        description: "Rechargeable and disposable batteries",
      },
      {
        name: "Cooling",
        icon: "Fan",
        description: "Fans and heatsinks for thermal management",
      },
      {
        name: "Lighting",
        icon: "Lightbulb",
        description: "LEDs and lighting solutions for projects",
      },
      {
        name: "Prototyping Boards",
        icon: "Circuit",
        description: "Boards for circuit prototyping and testing",
      },
      {
        name: "Enclosures",
        icon: "Box",
        description: "Cases and enclosures for project protection",
      },
      {
        name: "Switches & Relays",
        icon: "Toggle",
        description: "Switches and relays for circuit control",
      },
      {
        name: "Resistors",
        icon: "Resistor",
        description: "Resistors for current regulation",
      },
      {
        name: "Capacitors",
        icon: "Capacitor",
        description: "Capacitors for energy storage and filtering",
      },
      {
        name: "Diodes",
        icon: "Diode",
        description: "Diodes for circuit protection and signal control",
      },
      {
        name: "Transistors",
        icon: "Transistor",
        description: "Transistors for amplification and switching",
      },
    ]);

    // Create products
    const products = await Product.create([
      {
        name: "Arduino Uno R3",
        description:
          "The Arduino Uno R3 is a microcontroller board based on the ATmega328P.",
        price: 1299,
        category: "Microcontrollers",
        brand: "Arduino",
        images: [
          "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500",
        ],
        stock: 50,
        sku: "ARD-UNO-R3",
        specifications: {
          Microcontroller: "ATmega328P",
          "Operating Voltage": "5V",
          "Input Voltage": "7-12V",
          "Digital I/O Pins": "14",
          "Analog Input Pins": "6",
        },
        tags: ["arduino", "microcontroller", "development board"],
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 156,
        discount: 10,
        createdBy: adminUser._id,
      },
      {
        name: "Raspberry Pi 4 Model B",
        description:
          "A high-performance 64-bit quad-core processor, dual-display support.",
        price: 4999,
        category: "Microcontrollers",
        brand: "Raspberry Pi Foundation",
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        ],
        stock: 30,
        sku: "RPI-4B-4GB",
        specifications: {
          Processor: "Quad-core Cortex-A72",
          RAM: "4GB LPDDR4",
          Storage: "MicroSD",
          Connectivity: "WiFi, Bluetooth, Ethernet",
        },
        tags: ["raspberry pi", "single board computer", "linux"],
        isActive: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 203,
        createdBy: adminUser._id,
      },
      {
        name: "DHT22 Temperature Sensor",
        description:
          "Digital temperature and humidity sensor with high accuracy.",
        price: 299,
        category: "Sensors",
        brand: "Aosong",
        images: [
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500",
        ],
        stock: 100,
        sku: "DHT22-TEMP",
        specifications: {
          "Temperature Range": "-40 to 80°C",
          "Humidity Range": "0-100% RH",
          Accuracy: "±0.5°C, ±1% RH",
          Interface: "Single-wire digital",
        },
        tags: ["temperature sensor", "humidity sensor", "digital sensor"],
        isActive: true,
        rating: 4.6,
        reviewCount: 89,
        createdBy: adminUser._id,
      },
      {
        name: "SG90 Servo Motor",
        description: "Micro servo motor for robotics and automation projects.",
        price: 199,
        category: "Motors",
        brand: "TowerPro",
        images: [
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500",
        ],
        stock: 75,
        sku: "SG90-SERVO",
        specifications: {
          "Operating Voltage": "4.8-6V",
          Torque: "1.8 kg/cm",
          Speed: "0.1 sec/60°",
          Weight: "9g",
        },
        tags: ["servo motor", "robotics", "micro servo"],
        isActive: true,
        rating: 4.4,
        reviewCount: 67,
        discount: 15,
        createdBy: adminUser._id,
      },
      {
        name: "16x2 LCD Display",
        description: "Character LCD display for displaying text and numbers.",
        price: 399,
        category: "Displays",
        brand: "Hitachi",
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        ],
        stock: 60,
        sku: "LCD-16X2",
        specifications: {
          Display: "16 characters x 2 lines",
          Backlight: "Blue with white text",
          Interface: "Parallel",
          "Operating Voltage": "5V",
        },
        tags: ["lcd display", "character display", "16x2"],
        isActive: true,
        rating: 4.3,
        reviewCount: 45,
        createdBy: adminUser._id,
      },
      {
        name: "ESP32 WiFi Module",
        description: "Powerful WiFi and Bluetooth microcontroller module.",
        price: 899,
        category: "Modules",
        brand: "Espressif",
        images: [
          "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500",
        ],
        stock: 40,
        sku: "ESP32-WIFI",
        specifications: {
          Processor: "Dual-core Tensilica LX6",
          WiFi: "802.11 b/g/n",
          Bluetooth: "v4.2 BR/EDR and BLE",
          GPIO: "34 pins",
        },
        tags: ["esp32", "wifi module", "bluetooth", "iot"],
        isActive: true,
        isFeatured: true,
        rating: 4.7,
        reviewCount: 134,
        createdBy: adminUser._id,
      },
      {
        name: "HC-SR04 Ultrasonic Sensor",
        description:
          "HC-SR04 ultrasonic sensor provides 2cm - 400cm non-contact measurement function with ranging accuracy up to 3mm.",
        price: 299,
        category: "Sensors",
        brand: "Generic",
        images: [
          "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg",
        ],
        stock: 200,
        sku: "HC-SR04-ULTRA",
        specifications: {
          range: "2cm-400cm",
          accuracy: "3mm",
          voltage: "5V",
          interface: "Digital",
        },
        tags: ["ultrasonic sensor", "distance sensor", "hc-sr04"],
        isActive: true,
        rating: 4.6,
        reviewCount: 312,
        createdBy: adminUser._id,
      },
      {
        name: "NEMA 17 Stepper Motor",
        description:
          "NEMA 17 stepper motor perfect for 3D printers, CNC machines, and robotics projects.",
        price: 1599,
        category: "Motors",
        brand: "Generic",
        images: [
          "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg",
        ],
        stock: 40,
        sku: "NEMA17-STEPPER",
        specifications: {
          stepAngle: "1.8°",
          torque: "0.4N-m",
          voltage: "12V",
          current: "1.7A",
        },
        tags: ["stepper motor", "nema 17", "3d printer", "cnc"],
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 89,
        createdBy: adminUser._id,
      },
      {
        name: "0.96 Inch OLED Display",
        description:
          "0.96-inch OLED display with 128x64 resolution for Arduino projects.",
        price: 499,
        category: "Displays",
        brand: "Generic",
        images: [
          "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg",
        ],
        stock: 100,
        sku: "OLED-096-12864",
        specifications: {
          resolution: "128x64",
          interface: "I2C",
          size: "0.96 inch",
        },
        tags: ["oled display", "128x64", "i2c", "arduino"],
        isActive: true,
        isFeatured: true,
        rating: 4.7,
        reviewCount: 98,
        createdBy: adminUser._id,
      },
      {
        name: "Soldering Iron 60W",
        description: "60W adjustable soldering iron for electronics assembly.",
        price: 699,
        category: "Tools",
        brand: "Generic",
        images: [
          "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg",
        ],
        stock: 60,
        sku: "SLD-60W",
        specifications: { 
          power: "60W", 
          temperature: "200-450°C" 
        },
        tags: ["soldering iron", "60w", "electronics tool"],
        isActive: true,
        isFeatured: true,
        rating: 4.7,
        reviewCount: 67,
        discount: 10,
        createdBy: adminUser._id,
      },


    ]);

    const reviews = await Review.create([
      {
         product: products[0]._id,
         user: users[0]._id,
         rating: 5,
         title: 'Excellent Product!',
         comment: 'The Arduino Uno R3 is perfect for my projects. Easy to use and reliable.',
         verified: true,
         helpful: 10,
         status: 'approved'
       },
       {
         product: products[1]._id,
         user: users[0]._id,
         rating: 4,
         title: 'Good Sensor',
         comment: 'The HC-SR04 sensor works well, but the range could be better for outdoor use.',
         verified: true,
         helpful: 5,
         status: 'approved'
       },
       {
         product: products[2]._id,
         user: users[0]._id,
         rating: 5,
         title: 'Great for IoT',
         comment: 'ESP32 module is fantastic for IoT projects. Fast and reliable connectivity.',
         verified: true,
         helpful: 8,
         status: 'approved'
       },
       {
         product: products[3]._id,
         user: users[0]._id,
         rating: 3,
         title: 'Decent but Pricey',
         comment: 'The robotic arm kit is good, but a bit expensive for the features provided.',
         verified: true,
         helpful: 3,
         status: 'approved'
       }
    ])

    // Create coupons
    await Coupon.create([
      {
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        minOrderValue: 500,
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        code: "SAVE50",
        type: "fixed",
        value: 50,
        minOrderValue: 1000,
        usageLimit: 50,
        usedCount: 0,
        isActive: true,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
    ]);

    // Create sample orders
    await Order.create([
      {
        orderNumber: "RBS" + Date.now().toString().slice(-6) + "A1",
        user: users[0]._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price * 0.9, // with discount
            quantity: 1,
            image: products[0].images[0],
          },
        ],
        shippingAddress: {
          name: users[0].name,
          phone: users[0].phone,
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India",
        },
        billingAddress: {
          name: users[0].name,
          phone: users[0].phone,
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India",
        },
        subtotal: 1169,
        shippingCost: 50,
        tax: 219,
        total: 1438,
        paymentMethod: "razorpay",
        paymentStatus: "paid",
        orderStatus: "delivered",
      },
    ]);

    console.log("Database seeded successfully!");
    return {
      users: users.length + 1, // +1 for admin
      products: products.length,
      categories: categories.length,
      reviews: 4,
      coupons: 2,
      orders: 1,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
