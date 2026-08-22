### Project over all

- How to start project
# Front-end
1- open terminal 
2- cd /client
3- npm install
4- add .env data
5- in terminal npm run dev

# Back-end
1- open terminal 
2- cd /server
3- npm install
4- add .env data
5- in terminal npm run dev

## Prject

# front-end
- the drag and drop inspairation from jira board dashboard

- /App 
  |- Draggable page => Board Task Page
  |- login Page => login with ur account and save accout information to use it to fetch ur data
  |- TaskTable page =>page to fetch all ur tasks in table to use pagination api
- /Component
  |- Kanban (Component from dnd-kit to drag and Drop)
  |- Board.tsx => main Component contain column and items you can switch between columns  
   | every column contain tasks "Column represent status of task",You can drag task from column
   | To anothe ,stasus change automatic and saved in database ,Every column contain create Task
   | ,Every task contain edit buttom
  |- column.tsx => column component been called in Board.tsx
  |- item.tsx => item component been called in Board.tsx
  |- style.css => all Kanban style
  |- createTaskForm.tsx => it's made flexable as you can add or edit task on it,If u click edit on
   | Task call this component and sent task data to edit.
  |- Navbar.tsx => navbar contain page navigator and logout buttom
- /context
  |- AuthContext.tsx => frontend authentication system used to know:
   | Who is logged in
   | Whether the user is authenticated
   | Whether authentication is still being checked
   | How to login
   | How to logout
   | How to restore the session when the page refreshes
- /lib
  |- api.tsx => this file is the bridge between your frontend and backend.
   |It also works directly with the AuthProvider.
  |- auth.ts => This is your auth.ts storage layer

# dependencies
    @dnd-kit/abstract => drag and drop component
    @dnd-kit/helpers => drag and drop component
    @dnd-kit/react => drag and drop component
    @headlessui/react => drag and drop component
    @heroicons/react => drag and drop component
    axios => api req
    cors
    next
    react
    react-do

# Backend
- I use Feature-Based Architecture to backend design

- /src
   |-auth 
     |- auth.controller.js => backend authentication controller (logic)
     |- auth.routes.js => backend authentication router create api endpoint (url ,method ,header)
     |- auth.validator.js => validator to check data for api endpoint
   |-config
     |-db.js =>Database connection file **Note: I use mongodb compass**
   |-middlewares
     |-authMiddelware.js => what connects the JWT sent by your frontend to req.user inside  
      |your controllers.
     |-errorHandler.js => global error-handling middleware
    |-Tasks
     |- task.controller.js => backend task controller (logic)
     |- task.routes.js => backend task router create api endpoint (url ,method ,header)
     |- task.validator.js => validator to check data for api endpoint
    |-users
     |- user.controller.js => backend user controller (logic)
     |- user.routes.js => backend user router create api endpoint (url ,method ,header)
     |- user.validator.js => validator to check data for api endpoint
    |-app.js => the central configuration file for your backend. It connects all the pieces.
    |-server.js => backend start point.
- api.rest => use to test api 

# dependencies
    bcryptjs: use to hash password
    cors
    dotenv
    express: dackend library
    express-validator
    helmet: to secure from
    joi
    jsonwebtoken
    mongodb
    mongoose


## Point to improve 

- use cookie-parser
- use refrsh token
- use react-query
- use zod
- use zustan