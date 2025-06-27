# AI Noted Pad - Modern Note-Taking Web Application

## Overview
AI Noted Pad is a comprehensive web-based productivity application that combines traditional note-taking with modern features like AI assistance, mind mapping, and task management. This all-in-one solution helps users organize thoughts, visualize ideas, and manage tasks efficiently.

![AI Noted Pad Logo](./client/public/logo.png)

## Key Features

### 1. Intelligent Note-Taking
- Rich text editing with formatting options
- AI-powered content suggestions
- Markdown support
- Note categorization and tagging

### 2. Visual Mind Mapping
- Interactive node-based interface
- Drag-and-drop functionality
- Multiple layout options (radial, hierarchical)
- Export to image/PDF formats

### 3. Smart Task Management
- Priority-based task organization
- Due date reminders and notifications
- Progress tracking with visual indicators
- Subtask support

### 4. AI Integration
- Context-aware suggestions
- Automated note summarization
- Content generation assistance
- Natural language processing

## Project Structure

```
AI-Noted-Pad/
├── client/              # Frontend React application
│   ├── public/          # Static assets
│   └── src/             # React components and logic
│       ├── components/  # UI components
│       ├── pages/       # Application views
│       └── styles/      # CSS modules
├── server/              # Node.js backend
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   └── routes/          # API endpoints
├── assets/              # Design assets
└── docs/                # Documentation
```

## Installation Guide

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- MongoDB (for database)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/dbaidya811/AI-Noted-Pad.git
   cd AI-Noted-Pad
   ```

2. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both `client` and `server` directories
   - Configure required variables (see `.env.example` files)

4. Start the development servers:
   ```bash
   # In one terminal (server)
   cd server && npm run dev

   # In another terminal (client)
   cd client && npm start
   ```

5. Access the application at:
   ```
   http://localhost:3000
   ```

## Technology Stack

### Frontend
- React.js with Hooks
- Redux for state management
- Draft.js for rich text editing
- D3.js for mind map visualizations
- Material-UI for components

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- OpenAI API integration

### Development Tools
- Webpack
- Babel
- ESLint
- Prettier

## Usage Guide

### Creating Notes
1. Click "New Note" in the sidebar
2. Use the formatting toolbar for styling
3. Type `//` for AI suggestions
4. Save automatically or manually with Ctrl+S

### Building Mind Maps
1. Switch to Mind Map view
2. Double-click to add nodes
3. Drag between nodes to create connections
4. Right-click nodes for options (color, shape, etc.)

### Managing Tasks
1. Navigate to the To-Do section
2. Add tasks with due dates and priorities
3. Drag to reorder or create dependencies
4. Use the AI assistant for task suggestions

## API Documentation

The backend provides RESTful endpoints for:

- User authentication (`/api/auth`)
- Note operations (`/api/notes`)
- Mind map operations (`/api/mindmaps`)
- Task management (`/api/tasks`)
- AI services (`/api/ai`)

See [API Documentation](./docs/API.md) for detailed information.

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or feature requests:
- Open an issue on GitHub
- Contact the maintainer at dbaidya811@gmail.com

---

*Note: Make sure to update the logo path and contact information as needed. Include additional screenshots in the `assets` directory to showcase the application's interface.*
