# Image to ASCII Converter

A web application that converts images (JPG, PNG, WebP) into ASCII art with both monochrome and colored modes.

## Features

- Drag-and-drop or file picker for image upload
- Converts images to ASCII art using density map: `@%#*+=-:. `
- Monochrome and colored modes
- Adjustable output width (50-200 characters)
- Copy to clipboard
- Download as .txt (monochrome) or .html (colored)
- Dark theme UI

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Image Processing:** Sharp
- **Containerization:** Docker

## Project Structure

```
image-to-ascii/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # ASCII conversion utility
│   │   ├── App.jsx         # Main app component
│   │   └── App.css         # Styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── routes/             # API routes
│   ├── utils/              # Image processing
│   ├── server.js           # Entry point
│   └── package.json
├── Dockerfile              # Server container
├── Dockerfile.client       # Client container
├── docker-compose.yml      # Docker Compose config
└── README.md
```

## Running Locally (Without Docker)

### Prerequisites

- Node.js 18+
- npm

### Backend Setup

```bash
cd server
npm install
npm start
```

The server will run on `http://localhost:3038`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Running Both Together

Open two terminal windows:

**Terminal 1:**
```bash
cd server && npm start
```

**Terminal 2:**
```bash
cd client && npm run dev
```

Then open `http://localhost:5173` in your browser.

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Build and Run

```bash
docker-compose up --build
```

This will start:

- Server: `http://localhost:3038`
- Client: `http://localhost:5173`

### Stopping

```bash
docker-compose down
```

## API Endpoints

### POST /api/process-image

Process an image and return pixel data for ASCII conversion.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image file - JPG, PNG, WebP, max 5MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "originalWidth": 800,
    "originalHeight": 600,
    "width": 200,
    "height": 150,
    "pixels": [
      [{"r": 255, "g": 255, "b": 255}, ...],
      ...
    ]
  }
}
```

## Usage

1. Open the web app in your browser
2. Drag and drop an image or click to select
3. Wait for processing (image is resized to max 200px width)
4. Toggle between Monochrome and Colored modes
5. Adjust the output width using the slider
6. Copy to clipboard or download as .txt/.html

## ASCII Conversion Algorithm

- **Brightness formula:** `0.299*r + 0.587*g + 0.114*b`
- **Density map:** `@%#*+=-:. ` (10 levels, dark to light)
- **Aspect ratio:** Characters are approximately 2x taller than wide, compensated by sampling every 2nd column

## License

MIT
