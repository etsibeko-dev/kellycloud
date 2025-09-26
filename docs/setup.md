# KellyCloud Setup Guide

This guide will help you set up KellyCloud on your local machine.

## Prerequisites

- Python 3.13 or higher
- Git
- A modern web browser

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/etsibeko-dev/kellycloud.git
cd kellycloud
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Navigate to Django project
cd main

# Run migrations
python3 manage.py migrate

# Create superuser (optional)
python3 manage.py createsuperuser

# Start the backend server
python3 manage.py runserver 0.0.0.0:8000
```

### 3. Frontend Setup

Open a new terminal and run:

```bash
# Navigate to frontend directory
cd frontend

# Start the frontend server
python3 -m http.server 3000
```

### 4. Access the Application

- **Frontend**: http://0.0.0.0:3000
- **Backend API**: http://0.0.0.0:8000
- **Admin Panel**: http://0.0.0.0:8000/admin

## Project Structure

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
    └── setup.md              # This file
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Kill the process using the port: `lsof -ti:8000 | xargs kill -9`
   - Or use a different port: `python3 manage.py runserver 0.0.0.0:8001`

2. **Module not found errors**
   - Make sure the virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

3. **Database errors**
   - Delete `db.sqlite3` and run migrations again
   - Check database permissions

### Getting Help

If you encounter issues:

1. Check the [README.md](../README.md) for general information
2. Review the error messages in the terminal
3. Ensure all prerequisites are installed
4. Try the troubleshooting steps above

## Development

### Making Changes

1. Make your changes to the code
2. Test locally using the setup above
3. Commit your changes with descriptive messages
4. Push to your fork
5. Create a pull request

### Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Contributing

We welcome contributions! Please see the main [README.md](../README.md) for contribution guidelines.
