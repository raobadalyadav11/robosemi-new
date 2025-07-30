import mongoose from 'mongoose';
import connectDB from './mongodb';
import Project from './models/Project';
import Training from './models/Training';
import Category from './models/Category';
import User from './models/User';
import bcryptjs from 'bcryptjs';

const sampleProjects = [
  {
    title: "Arduino Robot Car",
    description: "Build a remote-controlled robot car using Arduino Uno, DC motors, and ultrasonic sensors. This project teaches basic robotics concepts, motor control, and sensor integration. Perfect for beginners who want to get hands-on experience with Arduino programming and hardware assembly.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
    difficulty: "beginner",
    estimatedTime: "2-3 hours",
    components: [
      "Arduino Uno R3",
      "DC Motors (2x)",
      "Ultrasonic Sensor HC-SR04",
      "Motor Driver L298N",
      "Jumper Wires",
      "Breadboard",
      "9V Battery"
    ],
    tags: ["arduino", "robot", "car", "motors", "sensors", "beginner"],
    seoTitle: "Arduino Robot Car Project - Build Your First Robot",
    seoDescription: "Learn to build an Arduino robot car with step-by-step instructions. Perfect beginner robotics project with code examples and component list."
  },
  {
    title: "IoT Weather Station",
    description: "Create a comprehensive weather monitoring system using ESP32, various sensors, and cloud connectivity. This project covers temperature, humidity, pressure monitoring, and real-time data visualization through a web dashboard. Ideal for intermediate makers interested in IoT development.",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80",
    difficulty: "intermediate",
    estimatedTime: "4-6 hours",
    components: [
      "ESP32 DevKit",
      "DHT22 Temperature/Humidity Sensor",
      "BMP280 Pressure Sensor",
      "OLED Display 0.96\"",
      "Resistors",
      "Breadboard",
      "Enclosure"
    ],
    tags: ["iot", "weather", "esp32", "sensors", "dashboard", "intermediate"],
    seoTitle: "IoT Weather Station Project - ESP32 Weather Monitoring",
    seoDescription: "Build an IoT weather station with ESP32 and sensors. Monitor temperature, humidity, and pressure with real-time data visualization."
  },
  {
    title: "Smart Home Automation System",
    description: "Develop a complete home automation system using Raspberry Pi, relays, and various sensors. Control lights, fans, and appliances remotely through a mobile app. This advanced project involves circuit design, programming, and mobile app development.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    difficulty: "advanced",
    estimatedTime: "10-15 hours",
    components: [
      "Raspberry Pi 4",
      "Relay Module 8-Channel",
      "PIR Motion Sensor",
      "Temperature Sensor",
      "Light Sensor",
      "Breadboard",
      "Jumper Wires",
      "Power Supply"
    ],
    tags: ["smart-home", "raspberry-pi", "automation", "relays", "mobile-app", "advanced"],
    seoTitle: "Smart Home Automation System - Raspberry Pi Project",
    seoDescription: "Build a complete smart home automation system with Raspberry Pi. Control lights, fans, and appliances remotely with mobile app."
  },
  {
    title: "Line Following Robot",
    description: "Build an autonomous line-following robot using infrared sensors and microcontroller. This project teaches concepts of sensor feedback, motor control, and basic artificial intelligence. Great for understanding robotics fundamentals and autonomous navigation.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    difficulty: "beginner",
    estimatedTime: "3-4 hours",
    components: [
      "Arduino Uno",
      "IR Sensors (3x)",
      "DC Motors (2x)",
      "Motor Driver",
      "Wheels",
      "Chassis",
      "Battery Pack"
    ],
    tags: ["line-following", "robot", "arduino", "sensors", "autonomous", "beginner"],
    seoTitle: "Line Following Robot - Arduino Autonomous Robot Project",
    seoDescription: "Build a line following robot with Arduino and IR sensors. Learn autonomous navigation and sensor-based control systems."
  },
  {
    title: "Bluetooth Controlled LED Matrix",
    description: "Create an 8x8 LED matrix display controlled via Bluetooth from your smartphone. Display text, animations, and patterns. This project combines LED matrix programming, Bluetooth communication, and mobile app development for a fun interactive display.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
    difficulty: "intermediate",
    estimatedTime: "5-7 hours",
    components: [
      "Arduino Nano",
      "8x8 LED Matrix",
      "MAX7219 Driver",
      "HC-05 Bluetooth Module",
      "Resistors",
      "Breadboard",
      "Power Supply"
    ],
    tags: ["led-matrix", "bluetooth", "arduino", "display", "mobile-control", "intermediate"],
    seoTitle: "Bluetooth LED Matrix Display - Arduino Project",
    seoDescription: "Build a Bluetooth controlled LED matrix display with Arduino. Create text displays and animations controlled from your phone."
  },
  {
    title: "Voice Controlled Robot",
    description: "Develop a voice-controlled robot that responds to spoken commands. Uses speech recognition, natural language processing, and robotics. This advanced project involves AI integration, voice processing, and complex robot control systems.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    difficulty: "advanced",
    estimatedTime: "12-18 hours",
    components: [
      "Raspberry Pi 4",
      "USB Microphone",
      "Speaker",
      "Servo Motors (4x)",
      "Ultrasonic Sensor",
      "Camera Module",
      "Robot Chassis",
      "Power Bank"
    ],
    tags: ["voice-control", "ai", "raspberry-pi", "speech-recognition", "robot", "advanced"],
    seoTitle: "Voice Controlled Robot - AI Raspberry Pi Project",
    seoDescription: "Build a voice controlled robot with Raspberry Pi and AI. Control your robot with spoken commands using speech recognition."
  }
];

const sampleTrainings = [
  {
    title: "Introduction to Arduino Programming",
    description: "Learn the fundamentals of Arduino programming from scratch. This comprehensive course covers basic electronics, programming concepts, and hands-on projects. Perfect for beginners who want to start their journey in embedded systems and IoT development.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
    category: "beginner",
    duration: "2 days",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    price: 3500,
    instructor: "Dr. Rajesh Kumar",
    instructorBio: "Ph.D. in Electronics Engineering with 10+ years of experience in embedded systems and IoT development. Published researcher and industry expert.",
    maxParticipants: 20,
    currentParticipants: 12,
    location: "RoboSemi Training Center, Bangalore",
    mode: "offline",
    prerequisites: ["Basic computer skills", "Interest in electronics"],
    learningOutcomes: [
      "Understand Arduino hardware and software",
      "Write basic Arduino programs",
      "Interface with sensors and actuators",
      "Build simple IoT projects"
    ],
    tags: ["arduino", "programming", "electronics", "beginner", "iot"]
  },
  {
    title: "Advanced Robotics with ROS",
    description: "Master Robot Operating System (ROS) for advanced robotics applications. Learn robot modeling, navigation, manipulation, and perception. This course is designed for experienced developers who want to build sophisticated robotic systems.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    category: "advanced",
    duration: "5 days",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    endDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000), // 19 days from now
    price: 12000,
    instructor: "Prof. Anjali Sharma",
    instructorBio: "Former senior robotics engineer at leading tech companies. Expert in ROS, autonomous navigation, and robotic perception systems.",
    maxParticipants: 15,
    currentParticipants: 8,
    location: "Online",
    mode: "online",
    prerequisites: [
      "Strong programming skills in C++ or Python",
      "Basic robotics knowledge",
      "Linux familiarity"
    ],
    learningOutcomes: [
      "Master ROS architecture and concepts",
      "Implement robot navigation systems",
      "Develop robotic perception algorithms",
      "Build autonomous robot applications"
    ],
    tags: ["ros", "robotics", "advanced", "navigation", "perception"]
  },
  {
    title: "IoT Development with ESP32",
    description: "Comprehensive course on Internet of Things development using ESP32 microcontroller. Learn wireless communication, sensor integration, cloud connectivity, and mobile app development. Build real-world IoT projects from concept to deployment.",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80",
    category: "intermediate",
    duration: "3 days",
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
    price: 6500,
    instructor: "Mr. Vikram Patel",
    instructorBio: "IoT solutions architect with 8+ years of experience in embedded systems, cloud platforms, and mobile app development.",
    maxParticipants: 25,
    currentParticipants: 18,
    location: "RoboSemi Training Center, Mumbai",
    mode: "hybrid",
    prerequisites: [
      "Basic programming knowledge",
      "Understanding of electronics",
      "Familiarity with microcontrollers"
    ],
    learningOutcomes: [
      "Master ESP32 programming and features",
      "Implement wireless communication protocols",
      "Connect devices to cloud platforms",
      "Develop IoT mobile applications"
    ],
    tags: ["esp32", "iot", "wireless", "cloud", "intermediate"]
  },
  {
    title: "Machine Learning for Robotics",
    description: "Explore the intersection of machine learning and robotics. Learn how to implement AI algorithms for robot perception, decision making, and control. This advanced course covers computer vision, reinforcement learning, and neural networks for robotics applications.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    category: "advanced",
    duration: "4 days",
    startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
    price: 15000,
    instructor: "Dr. Priya Menon",
    instructorBio: "AI researcher and robotics expert with Ph.D. in Machine Learning. Published author and consultant for autonomous systems development.",
    maxParticipants: 12,
    currentParticipants: 7,
    location: "Online",
    mode: "online",
    prerequisites: [
      "Strong programming skills in Python",
      "Basic machine learning knowledge",
      "Robotics fundamentals",
      "Linear algebra and statistics"
    ],
    learningOutcomes: [
      "Implement computer vision for robotics",
      "Apply reinforcement learning to robot control",
      "Develop neural networks for perception",
      "Build intelligent autonomous systems"
    ],
    tags: ["machine-learning", "ai", "robotics", "computer-vision", "advanced"]
  },
  {
    title: "PCB Design for Electronics Projects",
    description: "Learn professional PCB design from concept to manufacturing. Master industry-standard tools, design rules, and best practices. This course covers schematic capture, PCB layout, component selection, and manufacturing processes.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
    category: "intermediate",
    duration: "3 days",
    startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 5 weeks from now
    endDate: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000), // 38 days from now
    price: 8500,
    instructor: "Mr. Suresh Reddy",
    instructorBio: "Senior hardware engineer with 15+ years of experience in PCB design and electronics manufacturing. Expert in high-speed digital and analog circuit design.",
    maxParticipants: 18,
    currentParticipants: 14,
    location: "RoboSemi Training Center, Chennai",
    mode: "offline",
    prerequisites: [
      "Basic electronics knowledge",
      "Understanding of circuit analysis",
      "Familiarity with electronic components"
    ],
    learningOutcomes: [
      "Design professional PCBs",
      "Master PCB design software",
      "Understand manufacturing processes",
      "Optimize circuits for performance"
    ],
    tags: ["pcb-design", "electronics", "hardware", "manufacturing", "intermediate"]
  },
  {
    title: "Drone Building and Programming",
    description: "Build and program autonomous drones from scratch. Learn flight dynamics, control systems, and autonomous navigation. This hands-on course covers everything from hardware assembly to advanced flight programming and mission planning.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    category: "intermediate",
    duration: "4 days",
    startDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 6 weeks from now
    endDate: new Date(Date.now() + 46 * 24 * 60 * 60 * 1000), // 46 days from now
    price: 11000,
    instructor: "Capt. Arjun Singh",
    instructorBio: "Former Air Force pilot and aerospace engineer. Expert in UAV technology, flight control systems, and autonomous navigation with 12+ years of experience.",
    maxParticipants: 16,
    currentParticipants: 9,
    location: "RoboSemi Training Center, Delhi",
    mode: "offline",
    prerequisites: [
      "Basic programming knowledge",
      "Understanding of physics and mathematics",
      "Interest in aerospace technology"
    ],
    learningOutcomes: [
      "Build custom drone hardware",
      "Program flight control systems",
      "Implement autonomous navigation",
      "Plan and execute drone missions"
    ],
    tags: ["drone", "uav", "flight-control", "autonomous", "aerospace", "intermediate"]
  }
];

export async function seedProjectsAndTraining() {
  try {
    await connectDB();
    
    // Check if admin user exists, if not create one
    let adminUser = await User.findOne({ email: 'admin@robosemi.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@robosemi.com',
        password:await bcryptjs.hash('admin123',12), // This should be hashed in real implementation
        role: 'admin',
        phone: '+91-9876543210',
        address: {
          street: '123 Tech Street',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        }
      });
    }

    // Check if categories exist, if not create them
    const categories = ['Robotics', 'IoT', 'Automation', 'Electronics', 'AI/ML'];
    const categoryDocs = [];
    
    for (const catName of categories) {
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({
          name: catName,
          description: `${catName} related projects and products`,
          image: 'https://via.placeholder.com/300x200?text=' + catName.replace('/', '%2F'),
          isActive: true
        });
      }
      categoryDocs.push(category);
    }

    // Seed projects
    console.log('Seeding projects...');
    await Project.deleteMany({}); // Clear existing projects
    
    for (const projectData of sampleProjects) {
      const categoryIndex = Math.floor(Math.random() * categoryDocs.length);
      const category = categoryDocs[categoryIndex];
      
      await Project.create({
        ...projectData,
        category: category._id,
        createdBy: adminUser._id,
        isActive: true
      });
    }

    // Seed training courses
    console.log('Seeding training courses...');
    await Training.deleteMany({}); // Clear existing trainings
    
    for (const trainingData of sampleTrainings) {
      await Training.create({
        ...trainingData,
        createdBy: adminUser._id,
        isActive: true
      });
    }

    console.log('✅ Projects and training courses seeded successfully!');
    console.log(`Created ${sampleProjects.length} projects and ${sampleTrainings.length} training courses`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedProjectsAndTraining();
}