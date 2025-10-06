# System Architecture & Process Flow

## 🏗️ High-Level System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IoT Sensors   │    │     Cameras     │    │   Mobile Data   │
│  (Traffic Flow) │    │  (Vehicle Det.) │    │   (GPS/Apps)    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Edge Computing        │
                    │   (Real-time Process)     │
                    └─────────────┬─────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
   ┌────────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
   │ Emergency Alert │  │ Traffic Optim. │  │  Route Calc.   │
   │    System       │  │   AI Engine    │  │    Service     │
   └────────┬────────┘  └───────┬────────┘  └───────┬────────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                               │
                  ┌────────────▼────────────┐
                  │   Signal Controller     │
                  │      Network           │
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │    Web Dashboard       │
                  │  (React Frontend)      │
                  └─────────────────────────┘
```

## 🔄 Emergency Response Process Flow

### Phase 1: Detection & Classification
```
[IoT Sensor] → [Signal Processing] → [ML Classification] → [Priority Assignment]
     ↓                ↓                     ↓                    ↓
 Audio/Visual    Noise Filter      CNN Model          Emergency/Normal
 Detection       Data Clean     96% Accuracy         Priority Queue
```

### Phase 2: Route Optimization
```
[Emergency Location] → [Destination Input] → [Network Analysis] → [Optimal Path]
         ↓                     ↓                    ↓                 ↓
    GPS Coords           Hospital/Station      Graph Algorithm     Green Corridor
    Real-time           User Selection        Dijkstra + ML       Signal Timing
```

### Phase 3: Signal Preemption
```
[Path Calculation] → [ETA Prediction] → [Signal Scheduling] → [Preemption Execution]
        ↓                   ↓                  ↓                      ↓
   Route Segments      Travel Time Calc    Phase Planning        Hardware Control
   Intersection List    Traffic Density     Timing Optimization   MQTT Commands
```

### Phase 4: Traffic Redirection
```
[Normal Traffic] → [Alternative Routes] → [Dynamic Guidance] → [Flow Restoration]
       ↓                    ↓                    ↓                   ↓
  Affected Areas      A* Path Finding     Mobile Notifications   Signal Return
  Queue Detection     Secondary Routes    GPS Updates           Normal Operation
```

## 🤖 AI/ML Pipeline Architecture

### Data Input Layer
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Camera Feed │  │ Radar Data  │  │ GPS Tracks  │  │ Weather API │
│   30 FPS    │  │  100Hz      │  │   1Hz       │  │   15min     │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │                │
       └────────────────┼────────────────┼────────────────┘
                        │                │
              ┌─────────▼─────────┐      │
              │ Data Fusion Layer │      │
              │ Kalman Filtering  │      │
              └─────────┬─────────┘      │
                        │                │
                ┌───────▼────────────────▼───────┐
                │     Feature Engineering        │
                │ Normalization | Augmentation   │
                └───────┬────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼───────┐ ┌─────▼─────┐ ┌──────▼──────┐
│ Classification│ │Prediction │ │Optimization │
│     CNN       │ │   LSTM    │ │ Reinforcement│
│   Model       │ │  Model    │ │  Learning   │
└───────┬───────┘ └─────┬─────┘ └──────┬──────┘
        │               │              │
        └───────────────┼──────────────┘
                        │
                ┌───────▼────────┐
                │ Decision Engine│
                │ Rule-based +   │
                │ ML Inference   │
                └───────┬────────┘
                        │
                ┌───────▼────────┐
                │ Action Layer   │
                │Signal Control  │
                │Route Updates   │
                └────────────────┘
```

## 🚦 Signal Timing Algorithm Details

### Normal Operation Mode
```python
# Multi-Agent Reinforcement Learning
State = [queue_N, queue_S, queue_E, queue_W, current_phase, time_in_phase]
Action = [extend_current, switch_to_next, emergency_override]
Reward = -(total_waiting_time + queue_length_penalty)

Q-Learning Update:
Q(s,a) = Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]

Where:
α = learning_rate (0.1)
γ = discount_factor (0.95)
```

### Emergency Override Mode
```python
# Emergency Preemption Logic
if emergency_detected:
    current_phase → clear_phase (yellow → all_red)
    timing = minimum_safe_clearance_time
    
    emergency_direction → green_phase
    duration = emergency_vehicle_passage_time + buffer
    
    post_emergency → normal_operation_resume
```

## 📡 Communication Protocols

### IoT Device Communication
```
Protocol Stack:
┌─────────────────┐
│   Application   │ ← JSON/REST API
├─────────────────┤
│   Transport     │ ← MQTT/CoAP
├─────────────────┤
│    Network      │ ← IPv6/6LoWPAN
├─────────────────┤
│   Data Link     │ ← 802.11/LTE
├─────────────────┤
│   Physical      │ ← WiFi/Cellular
└─────────────────┘
```

### Message Format Example
```json
{
  "device_id": "sensor_001",
  "timestamp": "2025-10-06T13:24:15Z",
  "type": "emergency_detection",
  "data": {
    "vehicle_type": "ambulance",
    "confidence": 0.96,
    "direction": "north_bound",
    "speed": 65,
    "coordinates": [28.7041, 77.1025],
    "eta_intersection": 45
  },
  "metadata": {
    "sensor_type": "camera_radar_fusion",
    "weather_condition": "clear",
    "visibility": 10.0
  }
}
```

## 🗄️ Database Architecture

### Real-time Data Store (Redis)
```
Traffic Counts:     TTL: 30s
Signal Status:      TTL: 5s
Emergency Events:   TTL: 300s
Route Cache:        TTL: 120s
```

### Historical Data (PostgreSQL)
```sql
-- Traffic Patterns Table
CREATE TABLE traffic_patterns (
    id SERIAL PRIMARY KEY,
    intersection_id VARCHAR(50),
    timestamp TIMESTAMP,
    vehicle_count INTEGER,
    avg_speed FLOAT,
    density_level INTEGER,
    weather_condition VARCHAR(20)
);

-- Emergency Events Table
CREATE TABLE emergency_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(20),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    route_path JSONB,
    response_time INTEGER,
    efficiency_score FLOAT
);
```

## 🚀 Performance Optimization Strategies

### 1. Edge Computing Distribution
```
City Level:     Central Control + ML Models
Intersection:   Local Processing + Signal Control
Sensor:        Basic Detection + Data Compression
```

### 2. Caching Strategy
```
L1 Cache (Redis):    Real-time data (< 1 second access)
L2 Cache (Memory):   Frequently used routes/patterns
L3 Cache (SSD):      Historical data and ML models
```

### 3. Load Balancing
```
Round Robin:         Normal traffic processing
Weighted:           Emergency event processing
Geographic:         Location-based routing
```

## 🔒 Security & Safety Measures

### Cybersecurity
```
Encryption:         AES-256 for data transmission
Authentication:     OAuth 2.0 + JWT tokens
Network Security:   VPN tunnels for IoT devices
Monitoring:         Real-time intrusion detection
```

### Functional Safety
```
Redundancy:         Dual signal controllers
Failsafe:          Default to standard timing
Watchdog:          System health monitoring
Recovery:          Automatic system restart
```

## 📊 Key Performance Indicators

### System Metrics
- **Emergency Response Time:** < 30 seconds (target)
- **Signal Optimization Gain:** 25-40% improvement
- **Prediction Accuracy:** > 85%
- **System Availability:** 99.9%
- **Data Processing Latency:** < 100ms

### Traffic Metrics
- **Average Wait Time Reduction:** 30%
- **Fuel Consumption Decrease:** 20%
- **Emergency Vehicle Priority Success:** 95%
- **Congestion Reduction:** 35%

This architecture enables scalable, real-time traffic management with AI-driven optimization and emergency response capabilities.