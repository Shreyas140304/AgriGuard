# AgriGuard
**AgriGuard** is an analyzing app for people and especially for farmers, to know about the health of their plant and enable them to take necessary steps to protect his plant. This is an ML based project done using **CNN(Convolutional Neural Networks)**. To use this app you have to just simply add the photo of your plant and the model will analyze the photo and give the end result as if the plant is healthy or not and what has happened to it, also the confidence level will also be displayed.
To use this app you will need to follow the steps as below.

1. Create two folders separated with names frontend and backend respectively and keep these things ready.
   In backend create app.py file and in frontend create a vite react app.

2. Further to get installed all our dependencies, first create a virtual environment of anyname you want and install all dependencies.
    - run **"python -m venv environment_name"**.
    - Once created run **"pip install -r requirements.txt"** this install all the dependncies required for the project.

3. If you have created a vite react in the frontend folder 
    - Create a components folder in which create 2 files, **DashboardPage.jsx** and **HistoryPage.jsx** along with **DashboardPage.module.jsx** and **HistoryPage.module.jsx**
    - Copy all the code from the files provided in the respective code folders files.

4. Once done with all the above steps create 2 terminals and first run the backend code i.e the app.py file, to do so just type **"flask run"** and make sure you do this in your virtual environment only, to activate it type **environmentname\Scripts\Activate** for windows users and for mac users **"source venv/bin/activate"** And then in another terminal to activate reacy type **"npm run dev"**.

5. Click on the link displayed in the terminal of frontend and you will land on the home page of our app. Where you will see the upload section for the images of plant. For security purpose the we have implemented data integrity checks on the input images (e.g., using hashing or digital signatures) before passing them to the ML model, to ensure the input data hasn't been tampered with or corrupted (a basic step towards securing the input pipeline).

 
