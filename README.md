# ☁️ KellyCloud

> **Forked cloud storage platform** with major UI/UX and functionality improvements by [@etsibeko-dev](https://github.com/etsibeko-dev)

## ⚠️ Development Notice

**🚧 This project is currently under active development and is NOT production-ready.**

This is a **forked contribution** where I'm exploring how far I can push the concept of a modern cloud storage platform. As a contributor, I've made significant improvements to the UI, functionality, and overall user experience, but this project serves as a **proof of concept** and **learning exercise**.

### Current Status:
- ✅ **Major UI/UX Overhaul** - Modern SaaS-style dashboard with cloud-themed styling
- ✅ **Functionality Enhancements** - Better authentication, file management, and validation
- ⚠️ **Responsive Design** - Still being refined for all screen sizes
- ⚠️ **Production Features** - Missing security hardening, performance optimization, and production deployment features
- 🔄 **Ongoing Development** - Continuously adding new features and improvements

**This project is for educational purposes and concept demonstration only.**

### 🎯 Contribution Goals:
This fork represents my exploration of modern web development practices, where I'm challenging myself to see how far I can take a cloud storage concept. The focus is on:
- **Learning & Experimentation** - Trying new UI/UX patterns and development techniques
- **Best Practices** - Implementing clean code, modern frameworks, and user-centered design
- **Concept Validation** - Testing ideas for what makes a great cloud storage experience
- **Skill Development** - Pushing boundaries in both frontend and backend development

### 🔮 Future Vision:
While this project may never become a full production service, it serves as a foundation for understanding what it takes to build modern SaaS applications and exploring the possibilities of cloud storage platforms.

---

**Original Project**: This is a fork of the original KellyCloud project by [COSTA300](https://github.com/COSTA300/kellycloud). Built with Django REST Framework and vanilla JavaScript, featuring user authentication, file upload, subscription management, and a clean, responsive design.

## ✨ Major Improvements Made

- 🎨 **Complete UI/UX Overhaul** - Modern cloud provider-style dashboard with professional KellyCloud theme
- 🎨 **Professional Design System** - Comprehensive KellyCloud color palette, typography, and spacing system
- 🔧 **Better Organization** - Restructured Django apps for better maintainability
- 📁 **Enhanced File Management** - Real file upload, multi-file support, and file deletion
- ⚡ **Optimized API** - Improved Django REST Framework implementation
- 📱 **Responsive Design** - Better mobile and desktop experience
- 🏗️ **Clean Code Structure** - More organized and maintainable project structure
- 💳 **Subscription Management** - Basic, Standard, and Premium plans with storage limits
- 📊 **Analytics Dashboard** - Storage usage charts and file statistics with Chart.js
- 👤 **Profile Management** - User profile settings and account information
- 🔐 **Enhanced Authentication** - Token-based authentication with secure login/logout
- 👁️ **Password Visibility Toggles** - Eye icons for showing/hiding passwords
- ✅ **Real-time Input Validation** - Email and password validation with visual feedback
- 🎨 **Color-Coded Validation** - Red/green borders for invalid/valid input fields
- 🔄 **Logout Functionality** - Secure session management
- 🎨 **Consistent Button Heights** - Equal height dropdown buttons and navigation elements
- 🎨 **Professional Cards** - Equal height stats cards with KellyCloud styling
- 🎨 **Modern Dropdown Menus** - Professional dropdown styling with proper hover states
- 🎨 **Fixed Message Display** - Proper positioning for notification messages
- 🎨 **KellyCloud Branding** - Complete theme rebrand from generic colors to KellyCloud design system

## 🛠️ Tech Stack

**Backend:**
- ![Python](https://img.shields.io/badge/Python-3.13+-blue?logo=python)
- ![Django](https://img.shields.io/badge/Django-5.2+-green?logo=django)
- ![Django REST Framework](https://img.shields.io/badge/DRF-3.16+-red?logo=django)
- ![SQLite](https://img.shields.io/badge/SQLite-Database-lightblue?logo=sqlite)

**Frontend:**
- ![HTML5](https://img.shields.io/badge/HTML5-Markup-orange?logo=html5)
- ![CSS3](https://img.shields.io/badge/CSS3-Styling-blue?logo=css3)
- ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3+-purple?logo=bootstrap)
- ![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-green?logo=chart.js)
- ![Font Awesome](https://img.shields.io/badge/Font_Awesome-6.0+-blue?logo=font-awesome)

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/etsibeko-dev/kellycloud.git
   cd kellycloud
   ```
   
   > **Note**: This is a fork of the original [COSTA300/kellycloud](https://github.com/COSTA300/kellycloud) repository with improvements.

2. **Set up the backend**
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cd main
   python3 manage.py migrate
   python3 manage.py runserver 0.0.0.0:8000
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   python3 -m http.server 3000
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   
   > **Note**: The backend root URL (`http://localhost:8000/`) will show a 404 error - this is expected! The backend is API-only and serves endpoints under `/api/`.

## 📁 Project Structure

```
kellycloud/
├── README.md                   # Project documentation
├── .gitignore                  # Git ignore rules
├── requirements.txt            # Python dependencies
├── LICENSE                     # License file
├── .env.example               # Environment template
├── backend/
│   ├── .venv/                 # Virtual environment
│   ├── main/                  # Django project
│   │   ├── apps/              # Django applications
│   │   │   ├── api/           # API endpoints & models
│   │   │   │   ├── models.py  # Subscription & UserSubscription models
│   │   │   │   ├── views.py   # API views (auth, files, subscriptions)
│   │   │   │   ├── serializers.py # Data serializers
│   │   │   │   └── urls.py    # API URL patterns
│   │   │   └── storage/       # File storage
│   │   │       ├── models.py  # File model
│   │   │       └── management/ # Custom commands
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py           # Main URL configuration
│   │   └── wsgi.py           # WSGI configuration
│   ├── manage.py             # Django management
│   ├── db.sqlite3            # SQLite database
│   └── media/                # User uploaded files
├── frontend/
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── pricing.html          # Pricing plans page
│   ├── dashboard.html        # User dashboard
│   ├── style.css             # Custom styling
│   ├── main.js               # JavaScript functionality
│   └── package.json          # Frontend dependencies
└── docs/                     # Documentation
    └── setup.md              # Setup guide
```

## 🔧 Development

### Backend Development
```bash
cd backend
source .venv/bin/activate
cd main
python3 manage.py runserver 0.0.0.0:8000
```

> **Note**: The backend runs on `0.0.0.0:8000` but is accessed via `localhost:8000` from the frontend.

### Frontend Development
```bash
cd frontend
python3 -m http.server 3000
```

### Database Management
```bash
cd backend/main
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
```

## 🧪 Testing

### Default Login Credentials
For testing purposes, you can use these credentials:
- **Username**: `admin`
- **Password**: `Admin123!` (meets all validation requirements)
- **Alternative Test User**: `testuser` / `TestUser123!`

Or create a new account via the registration page.

### Access Points
- **Landing Page**: http://localhost:3000/index.html
- **Login**: http://localhost:3000/login.html
- **Register**: http://localhost:3000/register.html
- **Pricing**: http://localhost:3000/pricing.html
- **Dashboard**: http://localhost:3000/dashboard.html

## 📚 API Endpoints

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout

### File Management
- `GET /api/files/` - List user files
- `POST /api/files/` - Upload file(s)
- `DELETE /api/files/<id>/` - Delete file

### User Profile
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile

### Subscriptions
- `GET /api/subscriptions/` - List available plans
- `GET /api/user-subscription/` - Get user's subscription
- `POST /api/user-subscription/` - Update user's subscription

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📝 Original Project

This is a fork of the original KellyCloud project by [COSTA300](https://github.com/COSTA300/kellycloud). The original repository can be found at: https://github.com/COSTA300/kellycloud

## 🔧 Fork Improvements

This fork includes significant enhancements:
- **Modern Cloud Provider Dashboard** - Professional KellyCloud-themed interface with comprehensive design system
- **KellyCloud Design System** - Complete color palette, typography, spacing, and component styling
- **Subscription Management** - Basic, Standard, Premium plans with storage limits and distinct color coding
- **Real File Upload** - Multi-file upload with actual file storage
- **Analytics & Charts** - Storage usage visualization with Chart.js
- **Profile Management** - User profile settings and account information
- **Enhanced Authentication** - Token-based auth with secure sessions
- **File Management** - Upload, delete, and organize files
- **Password Visibility Toggles** - Eye icons for showing/hiding passwords
- **Input Validation** - Real-time email and password validation with KellyCloud styling
- **Color-Coded Feedback** - Visual validation indicators with professional colors
- **Responsive Design** - Mobile-friendly interface
- **Better Organization** - Clean Django app structure
- **Code Optimization** - Improved performance and maintainability
- **Professional UI Components** - Equal height cards, consistent button styling, modern dropdowns
- **Fixed User Experience Issues** - Proper message positioning, consistent navigation heights
- **Complete Theme Rebrand** - KellyCloud branding throughout the entire application

## 🎯 Features

### Core Features
- ✅ User registration and authentication
- ✅ File upload and management
- ✅ Subscription plan management
- ✅ Storage usage tracking
- ✅ Profile settings
- ✅ Analytics dashboard
- ✅ Password visibility toggles
- ✅ Real-time input validation
- ✅ Color-coded validation feedback
- ✅ Logout functionality

### Subscription Plans
- **Basic**: 50GB storage, R50/month
- **Standard**: 500GB storage, R150/month  
- **Premium**: 2TB storage, R300/month

### Dashboard Sections
- **Overview** - Storage usage and recent files
- **My Files** - File management with upload/delete
- **Analytics** - Charts and statistics
- **Plans** - Subscription management
- **Profile** - Account settings

---

⭐ **Star this repository if you found the improvements helpful!**
