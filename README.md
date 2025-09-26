# ☁️ KellyCloud

> **Forked cloud storage platform** with improved Django backend and modern frontend interface.

This is a fork of the original KellyCloud project, enhanced with improved user interface, better functionality, and optimized code structure. Built with Django REST Framework and vanilla JavaScript, featuring user authentication, file upload, subscription management, and a clean, responsive design.

## ✨ Improvements Made

- 🎨 **Enhanced UI** - Modern SaaS-style dashboard with cloud-themed styling
- 🔧 **Better Organization** - Restructured Django apps for better maintainability
- 📁 **File Management** - Real file upload, multi-file support, and file deletion
- ⚡ **Optimized API** - Improved Django REST Framework implementation
- 📱 **Responsive Design** - Better mobile and desktop experience
- 🏗️ **Code Structure** - Cleaner, more organized project structure
- 💳 **Subscription Plans** - Basic, Standard, and Premium plans with storage limits
- 📊 **Analytics Dashboard** - Storage usage charts and file statistics
- 👤 **Profile Management** - User profile settings and account information
- 🔐 **Authentication** - Token-based authentication with secure login/logout

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
   - Frontend: http://0.0.0.0:3000
   - Backend API: http://0.0.0.0:8000

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

This fork includes:
- **Modern SaaS Dashboard** - Professional cloud storage interface
- **Subscription Management** - Basic, Standard, Premium plans with storage limits
- **Real File Upload** - Multi-file upload with actual file storage
- **Analytics & Charts** - Storage usage visualization with Chart.js
- **Profile Management** - User profile settings and account information
- **Enhanced Authentication** - Token-based auth with secure sessions
- **File Management** - Upload, delete, and organize files
- **Responsive Design** - Mobile-friendly interface
- **Better Organization** - Clean Django app structure
- **Code Optimization** - Improved performance and maintainability

## 🎯 Features

### Core Features
- ✅ User registration and authentication
- ✅ File upload and management
- ✅ Subscription plan management
- ✅ Storage usage tracking
- ✅ Profile settings
- ✅ Analytics dashboard

### Subscription Plans
- **Basic**: 50GB storage, $50/month
- **Standard**: 500GB storage, $150/month  
- **Premium**: 2TB storage, $300/month

### Dashboard Sections
- **Overview** - Storage usage and recent files
- **My Files** - File management with upload/delete
- **Analytics** - Charts and statistics
- **Plans** - Subscription management
- **Profile** - Account settings

---

⭐ **Star this repository if you found the improvements helpful!**
