# DrawingApp_Backend

###### Real-Time Drawing App
 #### How to set up the application locally.

  If you have folder called Project folder inside the folder you can clone these two clientside and serverside project using terminal or command prompt i will provide the link below.

   ## Clone the Frontend Separately

    step :1    git clone https://github.com/elankathirprojects/DrawingApp_frontend.git

   ## Clone the Backend Separately

    step :1   git clone https://github.com/elankathirprojects/DrawingApp_Backend.git


 #### Steps to run the server and client.

   After cloning frontend and backend follow the steps given below .

  ##  Start the Frontend Separately

   step :1    Open terminal or command prompt in frontend folder . 

   step :2    After the terminal open Using this command (* npm install *) install a predifened packages which are imported in this project.

   step :3    npm start (This will start the frontend independently on http://localhost:3000.).

  ## Clone and Start the Backend Separately
  Prerequisites

   step :1    Before running the project, ensure you have the following installed on your system:
   step :2    Node.js (v14 or later)
   step :3    MySQL (Database setup required)
   step :4    npm or yarn package manager

   step :4    Open terminal or command prompt in backend folder . 

   step :5    After the terminal open Using this command (* npm install *) install a predifened packages which are imported in this project.

  step :6    Configure MySQL Database
          Create a new MySQL database and update the connection details in server.js
          const db = mysql.createConnection({
                host: "localhost",
                user: "root", // Your MySQL username
                password: "", // Your MySQL password
                database: "drawingapp" // Your MySQL database name
            });

   step :7    npm start (This will start the backend independently . if backend start it will show message in the terminal like (Run the backend server on port 8081).).
