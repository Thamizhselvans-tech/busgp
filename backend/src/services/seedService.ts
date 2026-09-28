import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Bus } from '../models/Bus.js';
import { Complaint } from '../models/Complaint.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains user data. Refreshing bus route GPS seeds...');
      await updateBusSeeds();
      return;
    }

    console.log('🌱 Database is empty. Seeding initial demo data...');

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash('password123', salt);
    const adminPassHash = await bcrypt.hash('admin123', salt);
    const officerPassHash = await bcrypt.hash('officer123', salt);

    // Admin & Officers
    const admin = await User.create({
      name: 'Admin Officer Sundaram',
      email: 'admin@tnbus.gov.in',
      phone: '+91 98765 43210',
      passwordHash: adminPassHash,
      role: 'admin',
    });

    const officer1 = await User.create({
      name: 'Officer Ramesh Kumar',
      email: 'officer.ramesh@tnbus.gov.in',
      phone: '+91 98765 11111',
      passwordHash: officerPassHash,
      role: 'officer',
    });

    const passenger1 = await User.create({
      name: 'Anand Viswanathan',
      email: 'passenger@example.com',
      phone: '+91 94433 12345',
      passwordHash: passHash,
      role: 'passenger',
    });

    await updateBusSeeds();

    console.log('✅ Demo data successfully seeded into database!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const updateBusSeeds = async () => {
  await Bus.deleteMany({});

  // 1. Bus 21G: Saidapet -> Guindy -> Teynampet -> Mount Road -> Broadway
  const route21G: Array<[number, number]> = [
    [13.0228, 80.2231], // Saidapet
    [13.0102, 80.2157], // Guindy
    [13.0405, 80.2504], // Teynampet
    [13.0580, 80.2590], // Thousand Lights
    [13.0645, 80.2660], // Anna Salai LIC
    [13.0827, 80.2707], // Central / Broadway
  ];

  // 2. Bus 5E: Tambaram -> Chromepet -> Pallavaram -> Guindy -> Teynampet -> Anna Salai
  const route5E: Array<[number, number]> = [
    [12.9249, 80.1000], // Tambaram
    [12.9516, 80.1462], // Chromepet
    [12.9675, 80.1491], // Pallavaram
    [12.9863, 80.1687], // Airport
    [13.0102, 80.2157], // Guindy
    [13.0405, 80.2504], // Teynampet
  ];

  // 3. Bus 102: Anna Salai -> T. Nagar -> CMBT -> Anna Nagar
  const route102: Array<[number, number]> = [
    [13.0604, 80.2612], // Anna Salai
    [13.0418, 80.2341], // T. Nagar
    [13.0500, 80.2120], // Vadapalani
    [13.0694, 80.1948], // CMBT Koyambedu
    [13.0850, 80.2100], // Anna Nagar
  ];

  // 4. Bus 32A: Cuddalore -> Pondicherry
  const route32A: Array<[number, number]> = [
    [11.7480, 79.7714], // Cuddalore BS
    [11.8200, 79.7800], // Reddichavadi
    [11.8600, 79.7900], // Kirumampakkam
    [11.9350, 79.8150], // Pondicherry New BS
  ];

  // 5. Bus 45N: Trichy -> Chennai Express
  const route45N: Array<[number, number]> = [
    [10.7905, 78.7047], // Trichy BS
    [11.2333, 78.8833], // Perambalur
    [12.2333, 79.6500], // Tindivanam
    [13.0694, 80.1948], // Chennai Koyambedu
  ];

  const bus1 = await Bus.create({
    busNumber: '21G',
    registrationNumber: 'TN01N9988',
    route: 'Saidapet → Broadway',
    source: 'Saidapet',
    destination: 'Broadway',
    driver: 'M. Arumugam',
    conductor: 'K. Balan',
    assignedOfficer: 'Officer Ramesh Kumar',
    status: 'moving',
    currentLat: route21G[0][0],
    currentLng: route21G[0][1],
    speed: 28,
    heading: 90,
    routeCoordinates: route21G,
    lastUpdated: new Date(),
    isSimulated: true,
    isLiveAvailable: true,
  });

  const bus2 = await Bus.create({
    busNumber: '5E',
    registrationNumber: 'TN45N5678',
    route: 'Tambaram → Teynampet',
    source: 'Tambaram',
    destination: 'Teynampet',
    driver: 'S. Rajendran',
    conductor: 'P. Palani',
    assignedOfficer: 'Officer Priya Selvam',
    status: 'moving',
    currentLat: route5E[1][0],
    currentLng: route5E[1][1],
    speed: 32,
    heading: 45,
    routeCoordinates: route5E,
    lastUpdated: new Date(),
    isSimulated: true,
    isLiveAvailable: true,
  });

  const bus3 = await Bus.create({
    busNumber: '102',
    registrationNumber: 'TN32N1234',
    route: 'Anna Salai → CMBT',
    source: 'Anna Salai',
    destination: 'CMBT Koyambedu',
    driver: 'V. Elangovan',
    conductor: 'G. Natarajan',
    assignedOfficer: 'Officer Suresh Rajan',
    status: 'moving',
    currentLat: route102[0][0],
    currentLng: route102[0][1],
    speed: 22,
    heading: 270,
    routeCoordinates: route102,
    lastUpdated: new Date(),
    isSimulated: true,
    isLiveAvailable: true,
  });

  const bus4 = await Bus.create({
    busNumber: 'TN-32-A',
    registrationNumber: 'TN32A1234',
    route: 'Cuddalore → Pondicherry',
    source: 'Cuddalore Bus Stand',
    destination: 'Pondicherry New Bus Stand',
    driver: 'T. Manikandan',
    conductor: 'R. Velu',
    assignedOfficer: 'Officer Ramesh Kumar',
    status: 'moving',
    currentLat: route32A[0][0],
    currentLng: route32A[0][1],
    speed: 40,
    heading: 15,
    routeCoordinates: route32A,
    lastUpdated: new Date(),
    isSimulated: true,
    isLiveAvailable: true,
  });

  const bus5 = await Bus.create({
    busNumber: 'TN-45-N',
    registrationNumber: 'TN45N7711',
    route: 'Trichy → Central Chennai',
    source: 'Trichy Central BS',
    destination: 'Chennai Koyambedu',
    driver: 'D. Senthamizh',
    conductor: 'M. Senthil',
    assignedOfficer: 'Officer Priya Selvam',
    status: 'stopped',
    currentLat: route45N[3][0],
    currentLng: route45N[3][1],
    speed: 0,
    heading: 0,
    routeCoordinates: route45N,
    lastUpdated: new Date(),
    isSimulated: true,
    isLiveAvailable: true,
  });
};
