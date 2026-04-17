# Skill Collection

A full-stack application for managing and verifying skills. Built with Next.js (frontend) and Express.js (backend).

## Project Structure

- **Frontend**: Next.js 16 with React 19, TailwindCSS, and shadcn/ui
- **Backend**: Express.js API with MongoDB and JWT authentication
- **Database**: MongoDB

## Frontend Setup

### Prerequisites

- Node.js 18+ or Bun 1.0+
- npm or yarn

### Installation

1. Install frontend dependencies:

```bash
npm install
# or
yarn install
```

### Running the Frontend

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## Backend Setup

### Prerequisites

- Bun 1.0+ (recommended) or Node.js 18+
- MongoDB (local or remote)

### Installation

1. Navigate to the server directory:

```bash
cd server
```

2. Install backend dependencies:

```bash
bun install
# or
npm install
```

3. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://root:password@localhost:27017/skillcollection?authSource=admin

# Server Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
```

### Running the Backend

Start the development server:

```bash
bun run dev
# or
npm run dev
```

The backend API will be available at `http://localhost:8080`

### Available Scripts

- `bun run dev` - Start development server with watch mode
- `bun start` - Start production server

## MongoDB Setup (Local)

If you're running MongoDB locally, you can start it with Docker:

```bash
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=skillcollection \
  mongo:latest
```

## Adding Components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using Components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
