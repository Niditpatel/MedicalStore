const app = require("./app");
const conncetDatabase = require("./config/database");
const dotenv = require("dotenv");


//
process.on("uncaughtException", (err) => {
   console.log(`Error ${err.message}`);
   console.log(`Shutting down the server due to Unhandled Promise Rejection.`);
   process.exit(1);
})



conncetDatabase();

dotenv.config({ path: "backend/config/config.env" })
app.listen(process.env.PORT, () => {
   console.log(`Server is running on: ${process.env.PORT}`)
})

process.on("unhandledRejection", (err) => {
   console.log(`Error ${err.message}`);
   console.log(`Shutting down the server due to Unhandled Promise Rejection.`);

   server.close(() => {
      process.exit(1);
   });
});
