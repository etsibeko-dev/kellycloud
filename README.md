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

## ✨ Key Features & Improvements

### 🎨 **Modern UI/UX Design**
- **Professional KellyCloud Theme** - Complete design system with color palette, typography, and spacing
- **iCloud-Style Storage Visualization** - Segmented progress bars with file type breakdown (Documents, Photos, Videos, Others)
- **Responsive Design** - Optimized for mobile and desktop experiences
- **Professional Components** - Equal height cards, consistent button styling, modern dropdowns

### 📁 **Advanced File Management**
- **Multi-file Upload** - Real file storage with proper validation
- **Download System** - File downloads with download count tracking
- **Soft Deletion** - Files marked as deleted but preserved for analytics and recovery
- **File Categorization** - Automatic categorization by file type with color coding
- **Real-time Data Display** - Actual file sizes, upload dates, and metadata

### 📊 **Analytics & Insights**
- **Real-time Analytics** - Upload, download, and deletion tracking
- **Interactive Charts** - Storage usage visualization with Chart.js
- **User Activity Metrics** - Active days, file statistics, and usage patterns

### 🔐 **Enhanced Security & Authentication**
- **Token-based Authentication** - Secure login/logout with session management
- **Input Validation** - Real-time email and password validation with visual feedback
- **Password Visibility Toggles** - Eye icons for showing/hiding passwords

### 💳 **Subscription Management**
- **Flexible Plans** - Basic (50GB), Standard (500GB), Premium (2TB) with distinct pricing
- **Storage Tracking** - Real-time usage monitoring and limit enforcement
- **Profile Management** - User account settings and subscription details

## 🎯 Dashboard Overview

### 📊 **Dashboard Sections**
- **Overview** - iCloud-style storage visualization with file type breakdown
- **My Files** - Complete file management with upload/download/delete functionality
- **Analytics** - Real-time charts and user activity statistics
- **Plans** - Subscription management and upgrade options
- **Profile** - Account settings and user preferences

### 💰 **Subscription Plans**
- **Basic**: 50GB storage, R50/month
- **Standard**: 500GB storage, R150/month  
- **Premium**: 2TB storage, R300/month

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
- `DELETE /api/files/<id>/` - Soft delete file
- `GET /api/files/<id>/download/` - Download file (tracks download count)

### User Profile
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile

### Subscriptions
- `GET /api/subscriptions/` - List available plans
- `GET /api/user-subscription/` - Get user's subscription
- `POST /api/user-subscription/` - Update user's subscription

### Analytics
- `GET /api/analytics/` - Get user analytics (uploaded, downloaded, deleted files, active days)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License & Attribution

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Original Project**: This is a fork of the original KellyCloud project by [COSTA300](https://github.com/COSTA300/kellycloud). The original repository can be found at: https://github.com/COSTA300/kellycloud

---

⭐ **Star this repository if you found the improvements helpful!**
