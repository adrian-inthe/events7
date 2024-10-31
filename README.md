# Events7 Dashboard 

This project consists of a Single Page Application (VueJS 3) and a REST API (NestJS).

## Assumptions

This is an initial version (v0) of the dashboard, developed under tight time constraints. While I aim to cover all relevant aspects, I will prioritize certain features and mention others here, recognizing that this should be an iterative process. Below are the assumptions guiding this development:

### Data
- **Event Name Uniqueness**: While ensuring unique event names is beneficial, I will assume this is not required in v0.
- **Timestamps**: Adding created and updated timestamps to events is advisable; however, I will assume this is not required in v0.

### Roles
- **Dashboard Permissions**: All users can view 'Ads' type events. Those without the appropriate permission will be restricted from creating, updating, or deleting events of this type.
- **sure, why not/you shall not pass**: Due to the unpredictable nature of the fun7-ad-partner API, which may randomly grant or deny access (or breaks!) and exhibit inconsistent behavior with each call even when the parameter country stays the same, users may experience unexpected interactions. For instance, while the frontend might allow the creation of an Ads event based on a first permission check, the backend may subsequently refuse to persist the event following a second security permission check. I assume this scenario is intentional in the exercise, and aims to test the robustness and resilience of both the frontend and backend applications.  

### Design
- **UI/UX**: No specific UI/UX requirements have been provided. Given that this project is focused on frontend development, I will allocate time to create an appealing desktop UI. Due to timing constraints, other devices and screen sizes will not be considered.
- **Specifications**: For expediency, I will assume that all specifications and requirements have been discussed and validated with the team, including wireframes, mockups, and prototypes.
- **Libraries**: I will utilize established libraries like PrimeVue and Tailwind CSS to ensure the project's future-proofing and speed of design.
- **Responsiveness**: While crucial for good design, responsive considerations will not be included in v0 due to time constraints.
- **Theme Handling**: Light/dark mode will be implemented but may require further improvements.

### Internationalization (i18n)
- Internationalization may be relevant for teams using this dashboard globally; however, I will assume it is not needed in v0.

### Accessibility
- While accessibility is important, I will assume it is not required in v0.

### SEO
- Since this is an internal tool, SEO will not be considered.

### Documentation
- **Code Readability**: Variable and function/class/method names will be self-explanatory. Code should be simple to read and understand, with comments included only when necessary.
- **Documentation**: Since documentation hasn't been explicitly requested, I will assume it is not needed for this exercise.

### Continuous Integration
- Setting up Continuous Integration (CI) is beyond the scope of this exercise, but the foundations are in place, including a versioning tool (Git), the GitHub platform, and Docker for containerization.
- For ease of setup and testing, I am using a monorepo for this exercise. However, in a real-world scenario, I would prefer a separate repository for each project to facilitate proper CI practices.

## Instructions to Build and Run

These steps guide you through building, running, and testing the NestJS backend and Vue.js frontend applications using Docker and Docker Compose.

### Prerequisites

- **Docker** and **Docker Compose** are required to build and run the containers.
- Ensure Docker is running on your machine.

### Cloning the Repository

    git clone https://github.com/adrian-inthe/event7.git

### Project Structure

    events7
    │
    ├── backend/
    │   ├── Dockerfile
    │   ├── .env (TO BE CREATED, see below)
    │   └── (NestJS source files)
    │
    ├── frontend/
    │   ├── Dockerfile
    │   ├── .env (already included)
    │   └── (Vue.js source files)
    │
    ├── docker-compose.yml
    └── README.md


### Environment Variables

Create `/events7/backend/.env` and copy the following:


    PERMISSIONS_API_KEY={ADS_PERMISSIONS_USERNAME}
    PERMISSIONS_API_SECRET={ADS_PERMISSIONS_PASSWORD}

Replace `{ADS_PERMISSIONS_USERNAME}` and `{ADS_PERMISSIONS_PASSWORD}` by the right values.

###  Build and Run the Applications with Docker

Open a terminal and navigate to the project root directory (where the `docker-compose.yml` file is located).

    cd /events7

Build and start the Docker containers:

    docker compose up --build -d

This command will build the images for both the NestJS backend and the Vue.js frontend and start the services.

### Accessing the frontend

Open your browser and go to [http://localhost:8080](http://localhost:8080)

### Stop the Applications

    docker-compose down

### Run and Test the Applications locally

#### Prerequisites

- Up-to-date **Node.js** and **NPM** are required to build and run the applications locally.

#### Backend

Open a terminal and navigate to the project's `backend` directory.

    cd /events7/backend
    npm install
    
    # To start run:
    npm start:dev 
    # the app will be available on http://localhost:3000

    # To test run:
    npm test:watch

#### Frontend

Open a terminal and navigate to the project's `frontend` directory.

    cd /events7/frontend
    npm install
    
    # To start run:
    npm dev 
    # then open http://localhost:8080

    # To test run:
    npm test

## Thoughts on the Development Next Steps

The following are additional thoughts on useful iterative improvements for the current solution:

### Data Handling
- Implement `created` and `updated` fields for events, ensuring unique event names (update DTO and validation).
- Extract the event list functionality into an `EventsPersistence` service for improved management.
- Enhance `EventsPersistence` with a full-featured ORM like Prisma.

### Logging
- Refactor console logs into a dedicated Logging service.
- Improve logging capabilities with a comprehensive monitoring and analytics system like Datadog.

### Security
- Replace the GeoLocation API that does not handle HTTPS.
- Migrate `.env` API credentials to a secure, distributed secrets manager.

### UI Improvements
- Associate descriptive words with event priorities.
- Implement pagination for event listings.
- Add confirmation dialogs for creating, updating, or deleting events.
- Include basic statistics (e.g., total number of events, events per type).

### Testing
- Improve test coverage, particularly for complex frontend components (e.g., PrimeVue DataTable).
- Utilize Cypress for validation and acceptance (end-to-end) tests.
