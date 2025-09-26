# Kelly Cloud

Kelly Cloud is a web application for a fictional cloud storage service. It is built with Django and is designed to be a simple, easy-to-use cloud storage solution.

This is a contribution by @etsibeko-dev to the original project by @COSTA300.

## Project Structure

The project is divided into several Django apps:

*   `landingpage_CLOUD`: The main landing page for the application.
*   `get_startedpage`: The page where users can choose a storage plan.
*   `landingpage_cloudMainpage`: The main dashboard for logged-in users.
*   `landingpage_cloudSecondpage`: A secondary page within the application.
*   `landingpage_logincloud`: The login page.
*   `landingpage_resertpassw`: The password reset page.

## Getting Started

To get started with Kelly Cloud, you will need to have Python installed.

1.  Clone the repository:
    ```
    git clone https://github.com/COSTA300/kellycloud
    ```
2.  Create and activate a virtual environment:
    ```
    python3 -m venv .venv
    source .venv/bin/activate
    ```
3.  Install the dependencies:
    ```
    pip install -r requirements.txt
    ```
4.  Run the development server:
    ```
    python main/manage.py runserver
    ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
