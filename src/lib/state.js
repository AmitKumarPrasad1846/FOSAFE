/**
 * FOSAFE Reactive Application State
 * Clean event-driven state container for synchronized UI components.
 */

import { FLEET_VEHICLES, SENSOR_REGISTRY, VISIBILITY_STATES } from './telemetry.js';

class StateManager {
  constructor() {
    this.state = {
      visibilityMode: 'LOW_VISIBILITY',
      activeVehicleId: 'D-07',
      activeSensorKey: 'ESP32',
      fogAssistPressed: false,
      circuitStep: 0,
      hardwareLoopStatus: 'STANDBY',
      proximityOverride: null // for testing distance alerts
    };

    this.listeners = new Set();
  }

  getState() {
    return { ...this.state };
  }

  getActiveVehicle() {
    return FLEET_VEHICLES.find(v => v.id === this.state.activeVehicleId) || FLEET_VEHICLES[0];
  }

  getActiveSensor() {
    return SENSOR_REGISTRY[this.state.activeSensorKey] || SENSOR_REGISTRY.ESP32;
  }

  getVisibilityData() {
    return VISIBILITY_STATES[this.state.visibilityMode] || VISIBILITY_STATES.LOW_VISIBILITY;
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  setVisibilityMode(mode) {
    if (VISIBILITY_STATES[mode]) {
      this.setState({ visibilityMode: mode });
    }
  }

  setActiveVehicle(id) {
    if (FLEET_VEHICLES.some(v => v.id === id)) {
      this.setState({ activeVehicleId: id });
    }
  }

  setActiveSensor(sensorKey) {
    if (SENSOR_REGISTRY[sensorKey]) {
      this.setState({ activeSensorKey: sensorKey });
    }
  }

  setProximityOverride(meters) {
    this.setState({ proximityOverride: meters });
  }

  triggerFogAssistButton() {
    if (this.state.fogAssistPressed) return;

    this.setState({
      fogAssistPressed: true,
      circuitStep: 1,
      hardwareLoopStatus: 'INTERRUPT: GPIO 18 PULLED LOW'
    });

    // Step 2: ESP32 Firmware ACK & Status LED
    setTimeout(() => {
      this.setState({
        circuitStep: 2,
        hardwareLoopStatus: 'ESP32 CORE 1: BEACON PWM PULSE ACTIVE'
      });
    }, 450);

    // Step 3: Wireless Uplink (ESP-NOW / MQTT)
    setTimeout(() => {
      this.setState({
        circuitStep: 3,
        hardwareLoopStatus: 'RF TELEMETRY: MQTT PACKET DISPATCHED (QoS 1)'
      });
    }, 900);

    // Step 4: Driver HUD Update
    setTimeout(() => {
      this.setState({
        circuitStep: 4,
        hardwareLoopStatus: 'IN-CAB HUD: HIGH-INTENSITY FOG BEACON ENGAGED'
      });
    }, 1350);

    // Step 5: Control Room Dispatch Alert
    setTimeout(() => {
      this.setState({
        circuitStep: 5,
        hardwareLoopStatus: 'FLEET DISPATCH: ZONE 04 VISIBILITY HAZARD LOGGED'
      });
    }, 1800);

    // Auto reset button state after 6 seconds
    setTimeout(() => {
      this.setState({
        fogAssistPressed: false,
        circuitStep: 0,
        hardwareLoopStatus: 'STANDBY (READY FOR NEXT EVENT)'
      });
    }, 6500);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const appState = new StateManager();
