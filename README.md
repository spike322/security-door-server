# Secure Door IoT application - Server

Secure Door is an IoT application built with Arduino. This is the server for the application that is built with Node.js and it interacts with Postersql and CloudMQTT.


Clone the server by using the git clone command

    git clone https://github.com/spike322/secure-door-server.git
  
Then move to the project folder and run this command to start the server

    npm run localStart
  
The server will be listening on port 3000

## Database instructions

In dumpDB folder you will find a dump.tar file in which is contained the database backup.

In order to restore it with data, first extract dump.tar, and then run this command

    pg_restore -h localhost -d secure_door dump.tar -U root

To restore it without data, first extract dump.tar, and then run this command

    psql -h localhost -U root secure_door < dump.sql

To backup the database run the command written down below

    pg_dump -h localhost -U root -F t secure_door > dump.tar
