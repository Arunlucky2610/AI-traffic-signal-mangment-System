# AI Traffic Signal Management System

An intelligent traffic management system designed for emergency vehicle clearance with real-time AI detection and automated signal control.

## 🚀 Features

- **Real-time Traffic Monitoring** - Multiple mapping options including Google Maps and OpenStreetMap
- **AI Emergency Detection** - Automated detection of emergency vehicles
- **Smart Signal Control** - Dynamic traffic light optimization
- **Emergency Corridors** - Automated green corridor creation for emergency vehicles
- **Analytics Dashboard** - Comprehensive traffic flow and system performance analytics
- **Admin Panel** - System configuration and management interface

## 🗺️ Mapping Options

### 1. Simulated Traffic Map
- Built-in animated traffic simulation
- No API key required
- Perfect for demonstrations and testing

### 2. Google Maps Integration
- Real-time traffic data
- Live traffic layer visualization
- Requires Google Maps API key
- See [MAPS_SETUP.md](./MAPS_SETUP.md) for setup instructions

### 3. OpenStreetMap (Free Alternative)
- Completely free to use
- No API key required
- Global coverage with simulated traffic signals
- Perfect for development and testing

## 🛠️ Quick Start

1. **Clone and Install**
```bash
git clone <repository-url>
cd AI-traffic-signal-mangment-System-main
npm install
```

2. **Configure Environment (Optional for Google Maps)**
```bash
# Copy environment template
cp .env.example .env

# Add your Google Maps API key (optional)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

3. **Start Development Servers**
```bash
# Frontend (React + Vite)
npm run dev

# Backend (Flask) - in a separate terminal
cd backend
python app.py
```

4. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📋 System Requirements

- Node.js 16+ and npm
- Python 3.8+
- Modern web browser with JavaScript enabled

## 🔧 Backend Dependencies

```bash
cd backend
pip install flask
```

## 🌐 Live Maps Setup

For real-time traffic data with Google Maps:
1. Follow the detailed setup guide in [MAPS_SETUP.md](./MAPS_SETUP.md)
2. Get a Google Maps API key from Google Cloud Console
3. Add the key to your `.env` file

For free mapping without API keys:
- Use the OpenStreetMap option (available immediately)
- No setup required, works out of the box

## 📱 Navigation

- **Dashboard** - System overview and key metrics
- **Traffic Map** - Simulated traffic with animated vehicles
- **Google Maps** - Real-time traffic data (requires API key)
- **OpenStreet Map** - Free alternative mapping solution
- **AI Detection** - Emergency vehicle detection interface
- **Signal Control** - Manual and automatic signal management
- **Analytics** - Performance metrics and traffic flow analysis
- **Admin Panel** - System configuration and management

## 🚨 Emergency Mode

When an emergency vehicle is detected:
1. System automatically activates emergency mode
2. Creates optimized green corridors
3. Coordinates traffic signals along the route
4. Provides real-time status updates
5. Returns to normal operation after clearance

## 📊 Key Metrics

- Real-time vehicle detection and tracking
- Traffic signal status monitoring
- Emergency response time optimization
- System performance analytics
- Traffic flow efficiency measurements

## 🔐 Security

- API key security best practices
- Environment variable configuration
- Secure backend API endpoints
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Check [MAPS_SETUP.md](./MAPS_SETUP.md) for mapping configuration
- Review browser console for error messages
- Ensure all required APIs are enabled (for Google Maps)
- Verify environment variables are properly set

---

**🎯 Perfect for**: Smart city initiatives, emergency services optimization, traffic management research, and urban planning applications.