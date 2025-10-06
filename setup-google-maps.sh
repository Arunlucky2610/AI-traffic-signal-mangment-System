#!/bin/bash

# 🚀 Google Maps Integration Setup Script
# This script helps you set up Google Maps integration for your traffic management system

echo "🗺️  Google Maps Integration Setup"
echo "================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📋 Creating .env file from template..."
    cp .env.example .env 2>/dev/null || echo "⚠️  Please create .env file manually"
fi

# Check current API key status
if grep -q "your_google_maps_api_key_here" .env 2>/dev/null; then
    echo "🔑 API Key Status: ❌ Not configured"
    echo ""
    echo "📋 To fix the blank map issue, you need to:"
    echo "   1. Get a Google Maps API key from: https://console.cloud.google.com/"
    echo "   2. Enable these APIs:"
    echo "      • Maps JavaScript API"
    echo "      • Places API" 
    echo "      • Directions API"
    echo "      • Distance Matrix API"
    echo "   3. Update your .env file with the API key"
    echo "   4. Restart your development server"
    echo ""
    echo "💡 Your API key should look like: AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    echo ""
    
    # Prompt for API key
    read -p "🔑 Enter your Google Maps API key (or press Enter to skip): " api_key
    
    if [ ! -z "$api_key" ]; then
        # Update .env file with the API key
        sed -i "s/your_google_maps_api_key_here/$api_key/g" .env 2>/dev/null || {
            echo "⚠️  Could not automatically update .env file"
            echo "📝 Please manually update .env file with your API key:"
            echo "   VITE_GOOGLE_MAPS_API_KEY=$api_key"
            echo "   GOOGLE_MAPS_API_KEY=$api_key"
        }
        echo "✅ API key updated in .env file!"
        echo "🔄 Please restart your development server now"
    else
        echo "⏭️  Skipping API key setup"
        echo "📝 You can manually edit the .env file later"
    fi
else
    echo "🔑 API Key Status: ✅ Configured"
    echo "🎉 Your Google Maps integration should be working!"
fi

echo ""
echo "🛠️  Additional Setup Commands:"
echo "   npm run dev          # Start React development server"
echo "   python google_maps_service.py  # Start backend API service"
echo ""
echo "🌐 Open your app at: http://localhost:5173"
echo "📍 Navigate to: Google Maps section"
echo ""
echo "❓ Having issues? Check the GOOGLE_MAPS_API_SETUP.md file for detailed troubleshooting"