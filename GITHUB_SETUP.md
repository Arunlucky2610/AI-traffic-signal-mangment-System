# 🚀 GitHub Repository Setup Guide

## Step 1: Create Repository on GitHub
1. Go to [github.com](https://github.com) and sign in
2. Click **"+"** → **"New repository"**
3. Repository name: `AI-traffic-signal-management-system`
4. Description: `AI-powered traffic signal management system with real-time emergency detection and Google Maps integration`
5. Set to **Public**
6. **DON'T** initialize with README
7. Click **"Create repository"**

## Step 2: Connect Local Repository
After creating the GitHub repo, run these commands:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/AI-traffic-signal-management-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Add Collaborators
1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Collaborators"** in the left sidebar
4. Click **"Add people"**
5. Enter your friends' GitHub usernames or email addresses
6. Send invitations

## Step 4: Collaborative Workflow
Create a branch structure for team collaboration:

```bash
# Create development branch
git checkout -b develop
git push -u origin develop

# Each team member creates feature branches
git checkout -b feature/your-feature-name
```

## Project Structure
```
AI-traffic-signal-management-system/
├── frontend/ (React + Vite)
│   ├── src/components/
│   ├── src/lib/
│   └── package.json
├── backend/ (Flask Python)
│   ├── app.py
│   └── requirements.txt
└── docs/ (Documentation)
```

## Team Development Tips
1. **Always pull before starting work**: `git pull origin main`
2. **Create feature branches**: `git checkout -b feature/new-feature`
3. **Regular commits**: Commit small, focused changes
4. **Pull requests**: Always create PRs for code review
5. **Communication**: Use GitHub Issues for bug reports and feature requests

## Environment Setup for Teammates
1. Clone the repository: `git clone https://github.com/YOUR_USERNAME/AI-traffic-signal-management-system.git`
2. Install frontend dependencies: `npm install`
3. Setup Python backend: `pip install -r backend/requirements.txt`
4. Create `.env` file with API keys
5. Start development servers:
   - Frontend: `npm run dev` (localhost:5173)
   - Backend: `python backend/app.py` (localhost:5000)
