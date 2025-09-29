# ☁️ KellyCloud

> Seamless, secure cloud — blazing‑fast uploads, effortless sharing, bank‑grade protection, 99.99% uptime, and real human support.

> **Forked cloud storage platform** with major UI/UX and functionality improvements by [@etsibeko-dev](https://github.com/etsibeko-dev)

## ⚠️ Development Notice

**🚧 This project is currently under active development and is NOT production-ready.**

This is a **forked contribution** where I'm exploring how far I can push the concept of a modern cloud storage platform. As a contributor, I've made significant improvements to the UI, functionality, and overall user experience, but this project serves as a **proof of concept** and **learning exercise**.

### Current Status:
- ✅ **Major UI/UX Overhaul** - Modern SaaS-style dashboard with cloud-themed styling
- ✅ **Functionality Enhancements** - Better authentication, file management, and validation
- 🚫 **Mobile Responsiveness** - Desktop-only for now; mobile is not planned by maintainer (contributions welcome)
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
- **Desktop-First Layout** - Designed for desktop screens; on small screens a friendly overlay is shown; mobile work not planned (PRs welcome)
- **Professional Components** - Equal height cards, consistent button styling, modern dropdowns

### 📁 **Advanced File Management**
- **Multi-file Upload** - Real file storage with proper validation
- **Download System** - File downloads with download count tracking and correct filenames
- **Soft Deletion** - Files marked as deleted but preserved for analytics and recovery
- **File Categorization** - Automatic categorization by file type with color coding
- **Real-time Data Display** - Actual file sizes, upload dates, and metadata
- **Table Search** - Filter by filename or type (debounced input)
- **Date Presets** - Quick filters: All time, 7 days, 30 days, 6 months, 1 year

### 📊 **Analytics & Insights**
- **Real-time Analytics** - Upload, download, and deletion tracking
- **Interactive Charts** - Storage usage visualization with Chart.js
- **User Activity Metrics** - Active days, file statistics, and usage patterns

#### How Analytics Works
- **Data source**: The frontend fetches your actual files from `GET /api/files/` and summary metrics from `GET /api/analytics/`. File downloads are streamed from `GET /api/files/<id>/download/` and increment `download_count` server‑side. Deletions are soft deletes via `DELETE /api/files/<id>/` and are reflected in analytics.
- **Key metrics (cards)**:
  - **Uploaded**: Count of non‑deleted files you have uploaded.
  - **Downloaded**: Sum of `download_count` across your files.
  - **Deleted**: Count of files with `is_deleted = true` (soft‑deleted).
  - **Active Days**: Number of distinct calendar days on which you performed an action (upload/download/delete).
- **Storage Usage Over Time (chart)**:
  - Daily series shows MB added per day from real file `upload_date` and `size`.
  - Line chart with optional **7‑day moving average** toggle (3‑day MA is always included in code for smoothing).
  - Auto-refresh: analytics re-polls every 60s when the section is visible.
- **Storage Composition (pie)**:
  - Dropdown to switch between **Categories** (Documents, Photos, Videos, Others) and **Top 10 Types** by space.
  - Uses actual uploaded files; e.g., a large `.AppImage` is grouped under Others.
- **Uploads Over the Year**: 52‑week bar chart with optional **4‑week moving average** overlay.
- **Uploads by Category (7 days)**: Stacked bars by file category for the last 7 days.
- **Storage Breakdown (panel)**: Shows the top 5 file types by percentage with mini progress bars.
- **Recent Activity**: Always shows five rows; placeholders fill if there are fewer events.

##### Current vs Planned Analytics Visuals
- ✅ Implemented:
  - Storage Usage Over Time with moving average (3‑day base, 7‑day toggle)
  - Storage Composition pie with dropdown: Categories vs Top 10 Types
  - Uploads Over the Year (52‑week) with 4‑week MA
  - Uploads by Category (last 7 days) stacked bars
  - Recent Activity fixed at five items; Storage Breakdown top five types
- 🧭 Roadmap (planned):
  - Cumulative area chart (total used over time)
  - Weekly uploads heatmap calendar (replacing legacy mock)
  - Per‑type daily stacked bars beyond 7‑day window

### 📱 Mobile/Small‑Screen Policy

This project intentionally targets desktop screens. The maintainer does not plan to build a mobile layout at this time.
- For viewports below 992px, the app hides the dashboard/sidebar and shows a friendly overlay explaining that mobile is not supported yet.
- This avoids broken layouts and unexpected interactions on phones.
- Contributions to add a proper mobile/responsive experience are welcome.

Key CSS hooks:
- `.small-screen-message` overlay with `@media (max-width: 992px)` to toggle visibility.
- High z-index on date picker (Flatpickr) to ensure it overlays without pushing content.

### 🧾 Recent Changes (Changelog)

- iCloud‑style storage bar with legend and detailed breakdown.
- File categorization audited; large binaries (e.g., `.AppImage`) rolled into Others.
- Real download tracking with original filenames via `Content-Disposition` (CORS exposed).
- Soft delete; lists and analytics filter `is_deleted`.
- Analytics auto‑refresh and new charts: Composition dropdown, Uploads by Category, Yearly Uploads trend.
- Recent Activity always five rows; Storage Breakdown shows top five types by percent.
- My Files toolbar: date presets only, unified control heights, improved spacing; Upload moved to Upload page.
- Download/Delete buttons in KellyCloud style with sharp edges, equal widths, and spacing.
- Removed redundant “File Categories” section; simplified chart controls; cache‑busting for `main.js`.
 - Branding polish: added SVG favicon; unified header spacing; gradient brand text next to logo; professional tab titles (`KellyCloud — Page`).

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
- **My Files** - File management with search, date presets, download/delete (Upload moved to Upload section)
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

### Recent UI Updates
- **Buttons**: Download/Delete now match KellyCloud colors with sharp edges
- **My Files Toolbar**: Search moved left; Upload button removed (Upload has its own section)
- **Analytics Panel**: Recent Activity and Storage Breakdown populate from real data

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
