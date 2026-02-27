# Image to ASCII Converter - Specification

## 1. Project Overview

**Project Name:** Image to ASCII Converter  
**Type:** Full-stack Web Application  
**Core Functionality:** Convert uploaded images (JPG, PNG, WebP) into monochrome or colored ASCII art, display in browser, and allow downloading as .txt or .html  
**Target Users:** Developers, designers, and anyone wanting to create ASCII art from images

---

## 2. Technical Architecture

### Tech Stack
- **Frontend:** React 18+ with Vite
- **Backend:** Node.js + Express
- **Image Processing:** Sharp (server-side resizing)
- **No Database Required**
- **Containerization:** Docker

### Project Structure
```
image-to-ascii/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── AsciiDisplay.jsx
│   │   │   ├── Controls.jsx
│   │   │   └── Header.jsx
│   │   ├── utils/
│   │   │   └── asciiConverter.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── routes/
│   │   └── image.js
│   ├── utils/
│   │   └── imageProcessor.js
│   ├── server.js
│   └── package.json
├── Dockerfile                 # Backend container
├── Dockerfile.client          # Frontend container
├── docker-compose.yml
└── README.md
```

---

## 3. Backend API Specification

### Endpoints

#### POST /api/process-image
- **Input:** Multipart form data with image file
- **Request:** `file` (JPG, PNG, WebP, max 5MB)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "originalWidth": 800,
      "originalHeight": 600,
      "width": 200,
      "height": 150,
      "pixels": [[{"r": 255, "g": 255, "b": 255}, ...], ...]
    }
  }
  ```
- **Errors:**
  - 400: Invalid file type or file too large
  - 500: Processing error

### Image Processing (server/utils/imageProcessor.js)
- Resize images to max width 200px (preserve aspect ratio)
- Return raw pixel data as JSON array
- Use Sharp for efficient processing

---

## 4. ASCII Conversion Logic (Frontend)

### Density Map
```
const DENSITY = '@%#*+=-:. ';
```
Index 0 = darkest, Index 9 = lightest

### Brightness Formula
```
brightness = 0.299 * r + 0.587 * g + 0.114 * b
```

### Character Mapping
```
charIndex = Math.floor((brightness / 255) * (DENSITY.length - 1))
```

### Aspect Ratio Compensation
- Characters are approximately 2x taller than wide
- Sample every 2nd column: `xStep = 2`

### Monochrome Output
- Simple string with newline separators
- Download as .txt

### Colored Output
- Each character wrapped in span:
  ```html
  <span style="color: rgb(r,g,b)">char</span>
  ```
- Download as .html with styling

---

## 5. UI/UX Specification

### Theme
- **Background:** #0d1117 (GitHub dark)
- **Surface:** #161b22
- **Border:** #30363d
- **Text Primary:** #e6edf3
- **Text Secondary:** #8b949e
- **Accent:** #58a6ff (blue)
- **Success:** #3fb950

### Typography
- **Font Family:** 'JetBrains Mono', 'Fira Code', 'Consolas', monospace
- **ASCII Display:** 8px-12px (adjustable)

### Layout
- Max width: 1200px, centered
- Padding: 24px

### Components

#### Header
- App title: "ASCII Art Converter"
- Minimal, left-aligned

#### Image Upload
- Drag-and-drop zone (200px height)
- File input fallback
- Accept: .jpg, .jpeg, .png, .webp
- Max file size: 5MB
- Visual feedback on drag-over

#### Controls Panel
- **Mode Toggle:** Monochrome / Colored (switch)
- **Width Slider:** 50-200px (default: calculated based on original image)
- **Copy Button:** Copy ASCII to clipboard
- **Download Buttons:**
  - Download .txt (monochrome)
  - Download .html (colored)

#### ASCII Display
- Pre-formatted monospace text
- Line-height: 1 (tight)
- Background: transparent
- Overflow: auto
- Max-height: 70vh

### Responsive Breakpoints
- Desktop: Full layout
- Tablet (768px): Stack controls vertically
- Mobile (480px): Full-width controls

---

## 6. Functionality Specification

### Image Upload Flow
1. User drags/drops or selects file
2. Client validates file type (jpg, png, webp)
3. Client validates file size (max 5MB)
4. Client sends to backend via FormData
5. Backend processes with Sharp, returns pixel data
6. Client converts to ASCII using density map
7. Display renders ASCII output

### Conversion Modes
1. **Monochrome:** Uses density map characters only
2. **Colored:** Uses density map + RGB colors per character

### Download Functions
- **Download .txt:** Plain text, monospace
- **Download .html:** Styled HTML with color spans
- **Filename:** `{year}-{month}-{date}-{time}-image-to-ascii.{txt|html}`

### Error Handling
- Invalid file type: "Please upload a JPG, PNG, or WebP image"
- File too large: "Image must be under 5MB"
- Processing error: "Failed to process image. Please try again."
- Empty state: Show upload prompt

---

## 7. Docker Configuration

### Dockerfile (server)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
EXPOSE 3038
CMD ["node", "server.js"]
```

### Dockerfile.client
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### docker-compose.yml
- Combines both services
- Volume mounting for development

---

## 8. API Contract

### Request
```
POST /api/process-image
Content-Type: multipart/form-data
Body: file: <image binary>
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "originalWidth": 800,
    "originalHeight": 600,
    "width": 200,
    "height": 150,
    "pixels": [
      [{"r": 100, "g": 100, "b": 100}, ...],
      ...
    ]
  }
}
```

### Response (Error)
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 9. Acceptance Criteria

1. ✅ User can upload JPG, PNG, or WebP images via drag-drop or file picker
2. ✅ Images larger than 5MB show error message
3. ✅ Backend resizes images to max 200px width
4. ✅ Monochrome mode displays correct ASCII with density map
5. ✅ Colored mode displays ASCII with RGB colors
6. ✅ Width slider adjusts output character count
7. ✅ Copy button copies ASCII to clipboard
8. ✅ Download .txt saves monochrome version
9. ✅ Download .html saves colored version
10. ✅ UI is dark-themed and responsive
11. ✅ Docker containers build and run successfully
12. ✅ No console errors on normal operation
