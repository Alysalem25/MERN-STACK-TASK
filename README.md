### Project overall

## How to start project

### Front-end

1. Open terminal
2. `cd /client`
3. `npm install`
4. Add `.env` data
5. In terminal: `npm run dev`

### Back-end

1. Open terminal
2. `cd /server`
3. `npm install`
4. Add `.env` data
5. In terminal: `npm run dev`

---

## Project

### Front-end

- The drag and drop inspiration from Jira board dashboard

#### `/App`

- **Draggable page** → Board Task Page
- **Login Page** → Login with your account and save account information to use it to fetch your data
- **TaskTable page** → Page to fetch all your tasks in table to use pagination API

#### `/Component`

- **Kanban** (Component from dnd-kit to drag and drop)
  - `Board.tsx` → Main component contains columns and items. You can switch between columns.
    - Every column contains tasks. Column represents status of task.
    - You can drag task from column to another — status changes automatically and saves in database.
    - Every column contains create task button.
    - Every task contains edit button.
  - `column.tsx` → Column component called in `Board.tsx`
  - `item.tsx` → Item component called in `Board.tsx`
  - `style.css` → All Kanban styles
  - `createTaskForm.tsx` → Made flexible so you can add or edit task on it.
    - If you click edit on task, it calls this component and sends task data to edit.
- **Navbar.tsx** → Navbar contains page navigator and logout button

#### `/context`

- **AuthContext.tsx** → Frontend authentication system used to know:
  - Who is logged in
  - Whether the user is authenticated
  - Whether authentication is still being checked
  - How to login
  - How to logout
  - How to restore the session when the page refreshes

#### `/lib`

- **api.tsx** → This file is the bridge between your frontend and backend. It also works directly with the AuthProvider.
- **auth.ts** → This is your auth storage layer

#### Dependencies

| Package | Purpose |
|---------|---------|
| `@dnd-kit/abstract` | Drag and drop component |
| `@dnd-kit/helpers` | Drag and drop component |
| `@dnd-kit/react` | Drag and drop component |
| `@headlessui/react` | UI components |
| `@heroicons/react` | Icons |
| `axios` | API requests |
| `cors` | CORS handling |
| `next` | Next.js framework |
| `react` | React library |
| `react-dom` | React DOM |

---

### Back-end

- I use Feature-Based Architecture for backend design

#### `/src`

- **auth**
  - `auth.controller.js` → Backend authentication controller (logic)
  - `auth.routes.js` → Backend authentication router — creates API endpoint (URL, method, header)
  - `auth.validator.js` → Validator to check data for API endpoint
- **config**
  - `db.js` → Database connection file. **Note: I use MongoDB Compass**
- **middlewares**
  - `authMiddleware.js` → What connects the JWT sent by your frontend to `req.user` inside your controllers
  - `errorHandler.js` → Global error-handling middleware
- **Tasks**
  - `task.controller.js` → Backend task controller (logic)
  - `task.routes.js` → Backend task router — creates API endpoint (URL, method, header)
  - `task.validator.js` → Validator to check data for API endpoint
- **users**
  - `user.controller.js` → Backend user controller (logic)
  - `user.routes.js` → Backend user router — creates API endpoint (URL, method, header)
  - `user.validator.js` → Validator to check data for API endpoint
- **app.js** → The central configuration file for your backend. It connects all the pieces.
- **server.js** → Backend start point
- **api.rest** → Used to test API

#### Dependencies

| Package | Purpose |
|---------|---------|
| `bcryptjs` | Used to hash password |
| `cors` | CORS handling |
| `dotenv` | Environment variables |
| `express` | Backend framework |
| `express-validator` | Validation |
| `helmet` | Security headers |
| `joi` | Schema validation |
| `jsonwebtoken` | JWT authentication |
| `mongodb` | MongoDB driver |
| `mongoose` | MongoDB ODM |


## Point to improve
- use cookie-parser
- use refrsh token
- use react-query
- use zod
- use zustan