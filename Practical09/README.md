# File Upload Module (React + Express + Multer + MongoDB)

Upload files from a React UI. Files are saved to `server/uploads/`, and their
metadata (name, type, size, path, date) is stored in MongoDB.

## Requirements
- Node.js 18 or newer
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a MongoDB Atlas URI

## Run it

Terminal 1 - backend:
```bash
cd server
npm install
npm start
```
Backend runs on http://localhost:5000

Terminal 2 - frontend:
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

## Using MongoDB Atlas instead of local MongoDB
Edit `server/.env` and set:
```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/fileupload?retryWrites=true&w=majority
```

## API
| Method | Route                     | Description                         |
|--------|---------------------------|-------------------------------------|
| POST   | /api/files                | Upload up to 10 files (field: files)|
| GET    | /api/files                | List file metadata                  |
| GET    | /api/files/:id/download   | Download a file                     |
| DELETE | /api/files/:id            | Delete file and its metadata        |

## Configuration (`server/.env`)
- `PORT` - server port (default 5000)
- `MONGO_URI` - MongoDB connection string
- `MAX_FILE_SIZE_MB` - per-file limit (default 10)
- `CLIENT_ORIGIN` - allowed frontend origin (default http://localhost:5173)

## Metadata stored in MongoDB
`originalName, storedName, mimeType, size, path, uploadedAt`
