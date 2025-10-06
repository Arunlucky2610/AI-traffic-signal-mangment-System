from flask import Flask, jsonify, request
from flask_cors import CORS
import googlemaps
import os
from datetime import datetime
import requests
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

app = Flask(__name__)
CORS(app)

# Configuration
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', 'YOUR_API_KEY_HERE')
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

# Telangana Traffic Centers
TELANGANA_LOCATIONS = [
    {
        'id': 0,
        'name': 'Hyderabad - HITEC City',
        'lat': 17.3850,
        'lng': 78.4867,
        'type': 'IT Hub',
        'description': 'Major IT hub with heavy traffic during peak hours'
    },
    {
        'id': 1,
        'name': 'Banjara Hills',
        'lat': 17.4065,
        'lng': 78.4772,
        'type': 'Commercial',
        'description': 'Upscale commercial and residential area'
    },
    {
        'id': 2,
        'name': 'Secunderabad Station',
        'lat': 17.4399,
        'lng': 78.3489,
        'type': 'Transport Hub',
        'description': 'Major railway junction with constant traffic'
    },
    {
        'id': 3,
        'name': 'Charminar Area',
        'lat': 17.3616,
        'lng': 78.4747,
        'type': 'Historic Center',
        'description': 'Historic landmark and bustling market area'
    },
    {
        'id': 4,
        'name': 'Ameerpet',
        'lat': 17.4126,
        'lng': 78.4392,
        'type': 'Education Hub',
        'description': 'Educational and training institute hub'
    },
    {
        'id': 5,
        'name': 'Kompally',
        'lat': 17.5007,
        'lng': 78.3963,
        'type': 'Residential',
        'description': 'Residential suburb with moderate traffic'
    },
    {
        'id': 6,
        'name': 'LB Nagar',
        'lat': 17.3753,
        'lng': 78.5733,
        'type': 'Suburban',
        'description': 'Major suburban center and transport hub'
    },
    {
        'id': 7,
        'name': 'Kukatpally',
        'lat': 17.4232,
        'lng': 78.3825,
        'type': 'Residential',
        'description': 'Residential and commercial area'
    }
]

@app.route('/api/maps/locations', methods=['GET'])
def get_locations():
    """Get all Telangana traffic monitoring locations"""
    return jsonify({
        'success': True,
        'locations': TELANGANA_LOCATIONS
    })

@app.route('/api/maps/traffic/<int:location_id>', methods=['GET'])
def get_traffic_data(location_id):
    """Get traffic data for a specific location using Google Maps API"""
    try:
        if location_id >= len(TELANGANA_LOCATIONS):
            return jsonify({'success': False, 'error': 'Location not found'}), 404
        
        location = TELANGANA_LOCATIONS[location_id]
        
        # Get real-time traffic data from Google Maps Roads API
        traffic_data = get_real_traffic_data(location['lat'], location['lng'])
        
        # Get nearby places
        nearby_places = get_nearby_places(location['lat'], location['lng'])
        
        # Get directions and travel time
        travel_times = get_travel_times_to_other_locations(location_id)
        
        return jsonify({
            'success': True,
            'location': location,
            'traffic': traffic_data,
            'nearby_places': nearby_places,
            'travel_times': travel_times,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_real_traffic_data(lat, lng):
    """Get real-time traffic data using Google Maps API"""
    try:
        # Use Google Maps Distance Matrix API to get traffic conditions
        origins = [(lat, lng)]
        destinations = [(lat + 0.01, lng + 0.01)]  # Small offset for traffic analysis
        
        result = gmaps.distance_matrix(
            origins=origins,
            destinations=destinations,
            mode="driving",
            departure_time="now",
            traffic_model="best_guess"
        )
        
        if result['status'] == 'OK':
            element = result['rows'][0]['elements'][0]
            if element['status'] == 'OK':
                duration = element['duration']['value']
                duration_in_traffic = element.get('duration_in_traffic', {}).get('value', duration)
                
                # Calculate traffic severity based on delay
                delay_ratio = duration_in_traffic / duration if duration > 0 else 1
                
                if delay_ratio > 1.5:
                    severity = 'high'
                elif delay_ratio > 1.2:
                    severity = 'medium'
                else:
                    severity = 'low'
                
                return {
                    'severity': severity,
                    'delay_ratio': delay_ratio,
                    'travel_time': duration_in_traffic,
                    'normal_time': duration,
                    'delay_minutes': int((duration_in_traffic - duration) / 60)
                }
        
        # Fallback to simulated data if API fails
        return generate_simulated_traffic()
        
    except Exception as e:
        print(f"Traffic data error: {e}")
        return generate_simulated_traffic()

def get_nearby_places(lat, lng):
    """Get nearby places of interest using Google Places API"""
    try:
        # Search for nearby places
        places_result = gmaps.places_nearby(
            location=(lat, lng),
            radius=2000,  # 2km radius
            type='point_of_interest'
        )
        
        places = []
        for place in places_result.get('results', [])[:5]:  # Top 5 places
            places.append({
                'name': place['name'],
                'rating': place.get('rating', 0),
                'types': place.get('types', []),
                'vicinity': place.get('vicinity', '')
            })
        
        return places
        
    except Exception as e:
        print(f"Places API error: {e}")
        return []

def get_travel_times_to_other_locations(current_location_id):
    """Get travel times from current location to other Telangana locations"""
    try:
        current_location = TELANGANA_LOCATIONS[current_location_id]
        origins = [(current_location['lat'], current_location['lng'])]
        
        destinations = []
        destination_names = []
        
        for i, location in enumerate(TELANGANA_LOCATIONS):
            if i != current_location_id:
                destinations.append((location['lat'], location['lng']))
                destination_names.append(location['name'])
        
        if not destinations:
            return []
        
        result = gmaps.distance_matrix(
            origins=origins,
            destinations=destinations,
            mode="driving",
            departure_time="now",
            traffic_model="best_guess"
        )
        
        travel_times = []
        if result['status'] == 'OK':
            elements = result['rows'][0]['elements']
            for i, element in enumerate(elements):
                if element['status'] == 'OK':
                    travel_times.append({
                        'destination': destination_names[i],
                        'distance': element['distance']['text'],
                        'duration': element['duration']['text'],
                        'duration_in_traffic': element.get('duration_in_traffic', {}).get('text', element['duration']['text'])
                    })
        
        return travel_times
        
    except Exception as e:
        print(f"Travel times error: {e}")
        return []

def generate_simulated_traffic():
    """Generate simulated traffic data as fallback"""
    import random
    
    severity_options = ['low', 'medium', 'high']
    severity = random.choice(severity_options)
    
    base_delay = {'low': 1.1, 'medium': 1.3, 'high': 1.6}
    delay_ratio = base_delay[severity] + random.uniform(-0.1, 0.1)
    
    return {
        'severity': severity,
        'delay_ratio': delay_ratio,
        'travel_time': int(600 * delay_ratio),  # Base 10 minutes
        'normal_time': 600,
        'delay_minutes': int(600 * (delay_ratio - 1) / 60),
        'simulated': True
    }

@app.route('/api/maps/incidents', methods=['GET'])
def get_live_incidents():
    """Get live traffic incidents for Telangana region"""
    # This would typically integrate with traffic incident APIs
    # For now, return simulated incidents
    incidents = [
        {
            'id': 1,
            'location': 'Outer Ring Road (ORR)',
            'type': 'Heavy Traffic',
            'severity': 'high',
            'description': 'Heavy congestion due to ongoing construction',
            'timestamp': datetime.now().isoformat(),
            'coordinates': {'lat': 17.4020, 'lng': 78.4900}
        },
        {
            'id': 2,
            'location': 'HITEC City - Gachibowli Road',
            'type': 'Minor Accident',
            'severity': 'medium',
            'description': 'Minor fender bender blocking one lane',
            'timestamp': datetime.now().isoformat(),
            'coordinates': {'lat': 17.3850, 'lng': 78.4867}
        },
        {
            'id': 3,
            'location': 'Secunderabad - Tank Bund',
            'type': 'Road Work',
            'severity': 'low',
            'description': 'Scheduled road maintenance',
            'timestamp': datetime.now().isoformat(),
            'coordinates': {'lat': 17.4399, 'lng': 78.3489}
        }
    ]
    
    return jsonify({
        'success': True,
        'incidents': incidents,
        'total': len(incidents)
    })

@app.route('/api/maps/geocode', methods=['GET'])
def geocode_location():
    """Geocode a location name to coordinates"""
    try:
        address = request.args.get('address', '')
        if not address:
            return jsonify({'success': False, 'error': 'Address parameter required'}), 400
        
        # Add Telangana context to improve geocoding accuracy
        full_address = f"{address}, Telangana, India"
        
        geocode_result = gmaps.geocode(full_address)
        
        if geocode_result:
            location = geocode_result[0]
            return jsonify({
                'success': True,
                'location': {
                    'address': location['formatted_address'],
                    'lat': location['geometry']['location']['lat'],
                    'lng': location['geometry']['location']['lng'],
                    'place_id': location['place_id']
                }
            })
        else:
            return jsonify({'success': False, 'error': 'Location not found'}), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/maps/directions', methods=['GET'])
def get_directions():
    """Get driving directions between two points"""
    try:
        origin = request.args.get('origin', '')
        destination = request.args.get('destination', '')
        
        if not origin or not destination:
            return jsonify({'success': False, 'error': 'Origin and destination required'}), 400
        
        directions_result = gmaps.directions(
            origin=origin,
            destination=destination,
            mode="driving",
            departure_time="now",
            traffic_model="best_guess"
        )
        
        if directions_result:
            route = directions_result[0]
            return jsonify({
                'success': True,
                'route': {
                    'summary': route['summary'],
                    'distance': route['legs'][0]['distance']['text'],
                    'duration': route['legs'][0]['duration']['text'],
                    'duration_in_traffic': route['legs'][0].get('duration_in_traffic', {}).get('text', ''),
                    'steps': [step['html_instructions'] for step in route['legs'][0]['steps']],
                    'polyline': route['overview_polyline']['points']
                }
            })
        else:
            return jsonify({'success': False, 'error': 'No route found'}), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Google Maps API Backend',
        'timestamp': datetime.now().isoformat(),
        'api_key_configured': bool(GOOGLE_MAPS_API_KEY and GOOGLE_MAPS_API_KEY != 'YOUR_API_KEY_HERE')
    })

if __name__ == '__main__':
    print("🗺️  Starting Google Maps API Backend Service...")
    print(f"🔑 API Key configured: {bool(GOOGLE_MAPS_API_KEY and GOOGLE_MAPS_API_KEY != 'YOUR_API_KEY_HERE')}")
    print("📍 Telangana Traffic Monitoring Ready")
    print("🚀 Server starting on http://localhost:5001")
    
    app.run(debug=True, port=5001, host='0.0.0.0')