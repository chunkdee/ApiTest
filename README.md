# JSON Server TypeScript with Swagger UI

A TypeScript-based REST API server with auto-generated Swagger documentation for a CRM system.

## Features

- 🚀 TypeScript support
- 📚 Swagger UI documentation
- 🔄 Hot reload during development
- 💾 Sample CRM data generation
- 🔌 RESTful API endpoints
- 🎯 React Admin compatible

## Available Endpoints

- `/api/users` - User management
- `/api/profiles` - User profiles
- `/api/companies` - Company records
- `/api/contacts` - Contact management
- `/api/opportunities` - Sales opportunities
- `/api/activities` - Activity tracking
- `/api/notes` - Notes management
- `/api/tasks` - Task management

Each endpoint supports full CRUD operations:
- `GET /api/{resource}` - List all
- `GET /api/{resource}/:id` - Get one
- `POST /api/{resource}` - Create
- `PUT /api/{resource}/:id` - Update
- `DELETE /api/{resource}/:id` - Delete

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd JSONSERVER
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:3030`

### API Documentation

Access the Swagger UI documentation at:
```
http://localhost:3030/api-docs
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build for production

## Project Structure

```
JSONSERVER/
├── src/
│   ├── index.ts              # Server entry point
│   └── datagenerator/
│       ├── generateSampleData2.ts  # Sample data generation
│       └── types/
│           └── crmTypes.ts   # TypeScript type definitions
├── package.json
└── tsconfig.json
```

## Technologies Used

- Express.js - Web framework
- TypeScript - Programming language
- Swagger UI - API documentation
- ra-data-fakerest - Fake REST data provider
- Morgan - HTTP request logger

## License

This project is licensed under the MIT License - see the LICENSE file for details.