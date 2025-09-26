# ☁️ KellyCloud

> **Forked cloud storage platform** with improved Django backend and modern frontend interface.

This is a fork of the original KellyCloud project, enhanced with improved user interface, better functionality, and optimized code structure. Built with Django REST Framework and vanilla JavaScript, featuring user authentication, file upload, and a clean, responsive design.

## ✨ Improvements Made

- 🎨 **Enhanced UI** - Improved interface with modern cloud-themed styling
- 🔧 **Better Organization** - Restructured Django apps for better maintainability
- 📁 **File Management** - Enhanced file upload and management functionality
- ⚡ **Optimized API** - Improved Django REST Framework implementation
- 📱 **Responsive Design** - Better mobile and desktop experience
- 🏗️ **Code Structure** - Cleaner, more organized project structure

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
│   ├── apps/                  # Django applications
│   │   ├── api/              # API endpoints
│   │   ├── accounts/         # User management
│   │   ├── storage/          # File storage
│   │   └── landing/          # Landing pages
│   ├── main/                 # Django project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   └── db.sqlite3
├── frontend/
│   ├── index.html            # Main page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── dashboard.html        # User dashboard
│   ├── style.css             # Styling
│   ├── main.js               # JavaScript
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

- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `GET /api/files/` - List user files
- `POST /api/files/` - Upload file

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
- Enhanced user interface and styling
- Better project organization
- Improved functionality
- Code optimization and cleanup

---

⭐ **Star this repository if you found the improvements helpful!**
