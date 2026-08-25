# Restaunax Full-Stack Developer Technical Assessment

Welcome to the Restaunax Technical Assessment! 🍕🚀

Thank you for your interest in joining our team at Restaunax. This assessment is designed to evaluate your essential full-stack development skills within the context of our restaurant management platform.

We've provided starter code to help you focus on implementing functionality rather than configuration. Take the time you need to showcase your skills.

---

1. **Setup Instructions**: Clear steps to run your application
2. **Implementation Notes**: Brief overview of your approach and architecture decisions
3. **Design Decisions**: Explain key technical choices you made and why
4. **Challenges**: Any interesting problems you solved or obstacles you encountered
5. **Additional Features**: If you implemented bonus features or went beyond requirements, explain what and why











---

## 🚀 Getting Started

### 1. Clone and Setup

```bash
# Clone this repository
git clone https://github.com/Restaunax/restaunax-technical-assessment.git
cd restaunax-technical-assessment

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run the Application

```bash
# Terminal 1 - Run backend (from /backend directory)
npm run dev

# Terminal 2 - Run frontend (from /frontend directory)
npm run dev
```

The backend will run on `http://localhost:3000` and frontend on `http://localhost:5173`.

## 📋 The Scenario

As a developer at Restaunax, you'll be working on our restaurant management system. Your task is to implement a **Real-time Order Management Dashboard** that allows restaurant owners to view and update orders.

## ✅ Technical Requirements

**Required:**

- ✅ **TypeScript** (strict mode) for both frontend and backend
- ✅ **React** with **Material-UI** components
- ✅ **Node.js/Express** backend
- ✅ Type-safe API contracts between frontend and backend

**Data Storage (Choose One):**

- **Highly Recommended**: PostgreSQL with Prisma running in a Docker container (demonstrates production-ready skills)
- Use the provided `mockOrders.ts` file (simplest approach, acceptable)
- In-memory data structure
- JSON file storage
- SQLite

**Note:** While we've provided mock data for quick setup, we highly value candidates who can set up a proper database with Prisma and Docker. This demonstrates real-world full-stack capabilities.

## 🎯 Your Task

### 1. Backend API

Implement endpoints in `backend/src/routes/orders.ts`. At minimum, you should implement:

**Core Requirements:**
- `GET /api/orders` — List all orders (with optional status filtering via query params)
- `GET /api/orders/:id` — Retrieve a specific order by ID

**Optional (Recommended):**
- `PATCH /api/orders/:id` — Update order status
- `POST /api/orders` — Create a new order

Feel free to add additional endpoints or functionality that you think would be useful for an order management system.

**Order Schema** (already defined in `shared/types.ts`):

| Field                | Type                                               |
| -------------------- | -------------------------------------------------- |
| id                   | string                                             |
| customerName         | string                                             |
| customerEmail        | string                                             |
| customerPhone        | string                                             |
| customerRewardPoints | number                                             |
| orderType            | "delivery" \| "pickup"                             |
| items                | OrderItem[]                                        |
| status               | "pending" \| "preparing" \| "ready" \| "delivered" |
| total                | number                                             |
| createdAt            | string (ISO format)                                |

> **💡 Data Modeling Challenge**: Notice how customer information is embedded in each order? Consider whether this is the best approach for a real-world application. How might you improve this data structure?

**Order Item Schema:**

| Field    | Type   |
| -------- | ------ |
| id       | string |
| name     | string |
| quantity | number |
| price    | number |

### 2. Frontend UI

Build a dashboard in `frontend/src/` using **React and Material-UI**. At minimum, your UI should:

**Core Requirements:**
- Display a list of orders with relevant information
- Filter or group orders by status
- Show loading and error states appropriately
- Use Material-UI components

**Get Creative:**
- Design the layout however you think works best
- Add any additional features you think would enhance the user experience
- Show us your UI/UX sensibilities
- If you implemented PATCH for status updates, add UI controls for it

### 3. Integration

- Connect your frontend to the backend API
- Ensure type safety between frontend and backend using shared types
- Handle errors appropriately (network failures, invalid data, etc.)

## 🎨 What We're Looking For

| Area                  | What We Value                                       |
| --------------------- | --------------------------------------------------- |
| **TypeScript Usage**  | Proper typing, no `any`, leveraging type inference  |
| **Code Organization** | Clean folder structure, separation of concerns      |
| **UI Implementation** | Proper use of Material-UI components                |
| **User Experience**   | Intuitive, functional, responsive interface         |
| **API Design**        | RESTful patterns, proper HTTP methods and responses |
| **Error Handling**    | Graceful handling of common errors                  |
| **Code Quality**      | Readable, maintainable code with consistent style   |

## 🌟 Bonus Ideas (Optional)

**If you've completed the core requirements and want to showcase additional skills:**

- 🐳 **Docker**: Containerize the application with docker-compose
- 📊 **Analytics**: Add order statistics or dashboard visualizations
- 🔄 **Real-time Updates**: Implement WebSocket updates with Socket.IO
- 🎨 **UX Polish**: Add animations, transitions, or advanced interactions
- 🧪 **Testing**: Add unit or integration tests
- 🔍 **Search/Filters**: Advanced filtering or search functionality
- 📱 **Mobile-First**: Exceptional mobile responsiveness
- ♿ **Accessibility**: ARIA labels and keyboard navigation
- 🎯 **Your Idea**: Surprise us with something creative!

**Note:** A solid, clean implementation of core features is more valuable than rushed bonus features.

## 📦 What's Included

This starter repository includes:

```
restaunax-technical-assessment/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server setup
│   │   ├── routes/
│   │   │   └── orders.ts         # TODO: Implement your endpoints here
│   │   └── data/
│   │       └── mockOrders.ts     # Sample data (15 orders)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # TODO: Build your UI here
│   │   ├── main.tsx
│   │   └── services/
│   │       └── api.ts            # TODO: Add API calls here
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── shared/
    └── types.ts                  # Shared TypeScript types
```

## 📤 Submission Instructions

### 1. Push to Your Own Repository

```bash
# Remove the original remote
git remote remove origin

# Create a new repository on your GitHub account restaunax-assessment
# Then add it as your remote
git remote add origin https://github.com/YOUR_USERNAME/restaunax-assessment.git

# Commit your changes
git add .
git commit -m "Complete Restaunax technical assessment"

# Push to your repository
git push -u origin main
```

### 2. Update the README

Add a section to this README with:

1. **Setup Instructions**: Clear steps to run your application
2. **Implementation Notes**: Brief overview of your approach and architecture decisions
3. **Design Decisions**: Explain key technical choices you made and why
4. **Challenges**: Any interesting problems you solved or obstacles you encountered
5. **Additional Features**: If you implemented bonus features or went beyond requirements, explain what and why

### 3. Share Your Repository

- Make sure your repository is **public** or invite `@Restaunax` as a collaborator
- Send us the link to your repository
- Ensure all your code is committed and pushed

### 4. What NOT to Include

- ❌ `node_modules/` folders (should be in .gitignore)
- ❌ Environment files with secrets
- ❌ Build artifacts (`dist/`, `build/`)
- ❌ IDE-specific files (`.vscode/`, `.idea/`)

## 💡 Tips for Success

1. **Start Simple**: Get the core GET endpoints working first, then build from there
2. **Use the Mock Data**: The provided mock data is ready to use - no need to set up a database unless you want to
3. **Type Safety First**: Leverage the shared types between frontend and backend
4. **Material-UI Docs**: Check out [MUI documentation](https://mui.com/) - their components are powerful
5. **Be Creative**: Show us your design sensibilities and problem-solving approach
6. **Test Your Work**: Make sure your implementation works end-to-end before submitting
7. **Document Decisions**: Explain your thought process - we want to understand how you think

## 🔧 Common Issues & Troubleshooting

**Port already in use?**
- Backend: Change port in `backend/src/index.ts`
- Frontend: Change port in `frontend/vite.config.ts`

**TypeScript errors?**
- Make sure you're importing types from `../../shared/types`
- Run `npm install` in both directories
- Check that you're using Node.js 18+

**Can't connect to API?**
- Check backend is running on port 3000
- Verify CORS is enabled (already configured)
- Check browser console for errors

**Build errors?**
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure both frontend and backend are using compatible TypeScript versions

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── index.ts              ✅ Express server configured
│   │   ├── routes/orders.ts      🔨 IMPLEMENT THIS
│   │   └── data/mockOrders.ts    ✅ 15 sample orders ready
│   └── package.json              ✅ Dependencies configured
├── frontend/
│   ├── src/
│   │   ├── App.tsx               🔨 BUILD YOUR UI HERE
│   │   ├── main.tsx              ✅ React + MUI configured
│   │   └── services/api.ts       🔨 ADD API CALLS HERE
│   └── package.json              ✅ Dependencies configured
└── shared/
    └── types.ts                  ✅ Shared types for both ends
```

**Legend:**
- ✅ Ready to use (no changes needed)
- 🔨 Implement your solution here

## ❓ Questions?

If you have questions about the requirements, feel free to:

- Make reasonable assumptions and document them in your README
- Implement what makes sense based on your interpretation
- Explain your decision-making process in your submission

---

Good luck! We're excited to see what you build. 🚀

**Remember**: We value clean, working code over fancy features. Focus on the fundamentals, and show us how you think and code.
