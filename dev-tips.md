## Use workspace flags:

Run commands from the root directory:
```
npm install pg --workspace=backend/api
npm install recharts --workspace=frontend
```

## Development Mode

Run both frontend and backend together:
```
npm run dev
```

Or run them separately:
```
npm run dev:api       # Starts backend from root
npm run dev:frontend  # Starts frontend from root
```