-----Installation-----
1. Open a command prompt
2. CD into the client folder
3. Run 'npm cache clean --force'
4. Run 'npm install --force'
5. CD into the Ticketing System folder
6. Run 'npm cache clean --force'
7. Run 'npm install --force'

-----Database Seeding-----
1. Open a command prompt
2. CD to the Ticketing System directory
3. Run 'node server/seeder.js'
4. This will create 3 verified users, each with a different user type. They all have the same password 'Str0ng*P4sswOrd!'
4a. admin@domain.com
4b. support@domain.com
4c. customer@domain.com

-----Running------
1. Open a command prompt
2. CD into the Ticketing System directory
3. Run 'npm run server'
4. Open another command prompt
5. CD into the Ticketing System directory then the client directory
6. Run 'npm run start'
7. If a browser is not automatically opened, the system can be accessed at http://localhost:3000/

-----Demonstration Video-----
https://drive.google.com/file/d/1gTs5ITNfM4hUFOcJI7GPk3EcNcX4Gk-8/view?usp=sharing