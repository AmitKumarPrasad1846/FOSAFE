/**
 * FOSAFE Telemetry System & Fleet Domain Model
 * Real-time operational data simulation for open-cast haulage environments.
 */

export const FLEET_VEHICLES = [
  {
    id: 'D-07',
    type: 'Cat 797F Ultra-Class Hauler',
    class: 'Heavy Haul Truck (400t Payload)',
    status: 'warning',
    riskLevel: 'MEDIUM RISK',
    riskScore: 68,
    speed: 18.4,
    heading: 342,
    bearingText: '342° NNW',
    distanceToHazard: 8.4,
    zone: 'Haul Ramp 04 Bench B',
    elevation: '+412m Pit Level',
    operator: 'R. K. Sharma (ID: OP-882)',
    visibilityBand: 'REDUCED (<50m)',
    lastUpdate: '0.4s ago',
    coordinates: { lat: 23.7914, lng: 86.4278 },
    telemetry: {
      engineTemp: 84.2,
      brakePressure: '142 PSI',
      incline: '+7.4% Grade',
      humidity: 89,
      ambientTemp: 14.2,
      fogAssist: 'ACTIVE',
      vibrationRms: '1.4g'
    }
  },
  {
    id: 'D-12',
    type: 'Komatsu 930E Heavy Hauler',
    class: 'Heavy Haul Truck (320t Payload)',
    status: 'normal',
    riskLevel: 'LOW RISK',
    riskScore: 18,
    speed: 24.1,
    heading: 118,
    bearingText: '118° ESE',
    distanceToHazard: 42.6,
    zone: 'Primary Crusher Hopper Approach',
    elevation: '+480m Surface Level',
    operator: 'M. S. Verma (ID: OP-419)',
    visibilityBand: 'CLEAR (>500m)',
    lastUpdate: '0.2s ago',
    coordinates: { lat: 23.7942, lng: 86.4312 },
    telemetry: {
      engineTemp: 82.0,
      brakePressure: '148 PSI',
      incline: '-1.2% Grade',
      humidity: 62,
      ambientTemp: 18.5,
      fogAssist: 'STANDBY',
      vibrationRms: '0.8g'
    }
  },
  {
    id: 'L-04',
    type: 'P&H 4100XPC Electric Rope Shovel',
    class: 'Heavy Loading Unit (Pit Bench)',
    status: 'normal',
    riskLevel: 'STATIONARY',
    riskScore: 5,
    speed: 0.0,
    heading: 45,
    bearingText: '045° NE',
    distanceToHazard: 110.0,
    zone: 'Pit Seam 09 Extraction Face',
    elevation: '+385m Deep Bench',
    operator: 'D. Sen (ID: OP-104)',
    visibilityBand: 'REDUCED (<80m)',
    lastUpdate: '1.1s ago',
    coordinates: { lat: 23.7889, lng: 86.4251 },
    telemetry: {
      engineTemp: 76.4,
      brakePressure: 'PARKED',
      incline: '0.0% Grade',
      humidity: 91,
      ambientTemp: 13.8,
      fogAssist: 'BEACON ON',
      vibrationRms: '0.2g'
    }
  },
  {
    id: 'S-01',
    type: 'Toyota Land Cruiser 70 (Mine Spec)',
    class: 'Light Safety & Inspection Vehicle',
    status: 'critical',
    riskLevel: 'HIGH COLLISION RISK',
    riskScore: 92,
    speed: 31.8,
    heading: 210,
    bearingText: '210° SSW',
    distanceToHazard: 5.1,
    zone: 'Haul Ramp 04 Junction (Blind Curve)',
    elevation: '+415m Mid Bench',
    operator: 'Safety Patrol Unit 1',
    visibilityBand: 'DENSE FOG (<20m)',
    lastUpdate: '0.1s ago',
    coordinates: { lat: 23.7911, lng: 86.4274 },
    telemetry: {
      engineTemp: 88.6,
      brakePressure: 'EMERGENCY BRAKE READY',
      incline: '-6.8% Grade',
      humidity: 94,
      ambientTemp: 12.9,
      fogAssist: 'EMERGENCY HIGH INTENSITY',
      vibrationRms: '2.1g'
    }
  }
];

export const SENSOR_REGISTRY = {
  GPS: {
    id: 'GPS',
    name: 'GNSS / GPS Receiver Module',
    chipset: 'u-blox NEO-6M / High Sensitivity Engine',
    interface: 'UART (9600-115200 Baud)',
    frequency: '10 Hz Update Rate',
    accuracy: '±0.4m RTK Differential',
    operatingVoltage: '3.3V / 5.0V DC',
    purpose: 'Provides absolute coordinate tracking, geofencing within pit zones, ground speed verification, and spatial bearing on mine haul roads.',
    specifications: [
      { label: 'Tracking Channels', value: '50 Channels' },
      { label: 'Time-To-First-Fix', value: 'Cold 27s / Hot 1s' },
      { label: 'Antenna Interface', value: 'Active Ceramic Patch' },
      { label: 'Protocol', value: 'NMEA-0183 & UBX Binary' }
    ]
  },
  DHT11: {
    id: 'DHT11',
    name: 'Contextual Environmental Sensor',
    chipset: 'DHT11 Calibrated Digital Humidity/Temp',
    interface: 'Single-Bus Digital (Custom 1-Wire)',
    frequency: '1 Hz Sampling',
    accuracy: '±2°C Temp / ±5% RH',
    operatingVoltage: '3.3V–5.5V DC',
    purpose: 'Measures in-cab & intake ambient temperature and relative humidity as contextual baseline parameters. Note: Used to estimate condensation risk and atmospheric moisture, while visibility modes are governed by operational controls.',
    specifications: [
      { label: 'Humidity Range', value: '20–90% RH' },
      { label: 'Temperature Range', value: '0–50°C' },
      { label: 'Sampling Interval', value: '1.0 Second' },
      { label: 'Data Output', value: '40-bit Single-Bus Stream' }
    ]
  },
  ULTRASONIC: {
    id: 'ULTRASONIC',
    name: 'Close-Proximity Ultrasonic Ranging',
    chipset: 'HC-SR04 Industrial Sealed Transducer',
    interface: 'GPIO Trigger / Echo Pulse Width',
    frequency: '40 kHz Acoustic Pulse',
    accuracy: '±3 mm Precision',
    operatingVoltage: '5.0V DC',
    purpose: 'Critical near-field proximity radar that measures physical obstacle distance directly unaffected by dense fog or airborne particulate dust clouds.',
    specifications: [
      { label: 'Detection Range', value: '0.02m – 4.50m' },
      { label: 'Measuring Angle', value: '15° Cone' },
      { label: 'Trigger Pulse', value: '10µs TTL Pulse' },
      { label: 'Resistance', value: 'IP67 Sealed Transducers' }
    ]
  },
  IR: {
    id: 'IR',
    name: 'Infrared Barrier & Berm Sensing',
    chipset: 'TSSP / Phototransistor Array',
    interface: 'Digital Comparator / ADC Interrupt',
    frequency: '38 kHz Carrier Modulated',
    accuracy: 'Binary Edge Threshold Detection',
    operatingVoltage: '3.3V–5.0V DC',
    purpose: 'Detects haul-road edge berms, ramp drainage channels, and low-angle reflective obstacles at critical wheel-line blind spots.',
    specifications: [
      { label: 'Response Time', value: '< 2.5 ms' },
      { label: 'Modulation', value: '38 kHz Ambient-Reject' },
      { label: 'Field of View', value: '35° Wide-Angle Array' },
      { label: 'Berm Safety Margin', value: 'Calibrated for 1.8m Berms' }
    ]
  },
  MPU6050: {
    id: 'MPU6050',
    name: '6-Axis Inertial Motion Unit (IMU)',
    chipset: 'MPU-6050 (3-Axis Gyro + 3-Axis Accel)',
    interface: 'I2C Bus (Fast Mode 400kHz)',
    frequency: '1000 Hz Internal / 100 Hz DMP',
    accuracy: '16-bit ADC per channel',
    operatingVoltage: '3.3V DC',
    purpose: 'Monitors vehicle tilt, roll angles on steep 8-10% mine ramps, sudden deceleration, emergency braking events, and severe chassis vibration.',
    specifications: [
      { label: 'Gyroscope Range', value: '±250, ±500, ±2000 °/sec' },
      { label: 'Accelerometer Range', value: '±2g, ±4g, ±8g, ±16g' },
      { label: 'Hardware Engine', value: 'Digital Motion Processor (DMP)' },
      { label: 'Rollover Threshold', value: 'Triggers Alert at >14° Roll' }
    ]
  },
  ESP32: {
    id: 'ESP32',
    name: 'Core Edge Processing & Telematics MCU',
    chipset: 'ESP-WROOM-32 (Xtensa Dual-Core 32-bit LX6)',
    interface: 'CAN Bus, SPI, I2C, UART, WiFi, BLE',
    frequency: '240 MHz Core Clock',
    accuracy: 'Deterministic FreeRTOS Preemptive',
    operatingVoltage: '3.3V Core / 12-24V DC Conditioned',
    purpose: 'The central vehicle unit processor. Fuses all multi-sensor signals, computes local collision vectors in <15ms, triggers cab audiovisual alerts, and uplinks fleet telemetry via MQTT.',
    specifications: [
      { label: 'Architecture', value: 'Dual-Core 32-bit @ 240MHz' },
      { label: 'Flash / SRAM', value: '4MB SPI Flash / 520KB SRAM' },
      { label: 'Wireless Uplink', value: '802.11 b/g/n + ESP-NOW Mesh' },
      { label: 'Latency Loop', value: '< 15 ms Local Interrupt' }
    ]
  }
};

export const VISIBILITY_STATES = {
  CLEAR: {
    id: 'CLEAR',
    title: 'Normal Visibility',
    visibilityRange: '1000m+ Sightline',
    safetyRadius: '30 Meters',
    speedAdvisory: 'Normal (Up to 35 km/h)',
    fogDensityValue: 0.05,
    hudColor: '#10B981',
    description: 'Standard operational conditions. Drivers maintain direct visual line of sight with forward haul roads and switchback berms.'
  },
  LOW_VISIBILITY: {
    id: 'LOW_VISIBILITY',
    title: 'Reduced Visibility',
    visibilityRange: '80m – 150m Sightline',
    safetyRadius: '80 Meters',
    speedAdvisory: 'Restricted (20 km/h Limit)',
    fogDensityValue: 0.55,
    hudColor: '#F59E0B',
    description: 'Moderate inversion fog or heavy particulate dust. Visual reference to forward trucks degrades. System expands vehicle safety buffer radius.'
  },
  DENSE_FOG: {
    id: 'DENSE_FOG',
    title: 'Dense Fog Hazard',
    visibilityRange: '< 30m Sightline (Zero Visual)',
    safetyRadius: '150 Meters (Maximum)',
    speedAdvisory: 'Hazard Speed (10 km/h or Halt)',
    fogDensityValue: 0.92,
    hudColor: '#EF4444',
    description: 'Critical winter radiation fog. Sightline drops below the stopping distance of 400-ton haulers. Full acoustic alert and beacon strobe engaged.'
  }
};
