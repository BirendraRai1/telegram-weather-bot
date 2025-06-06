const dotenv = require("dotenv");
dotenv.config();

const { PORT } = process.env;
const app = require("./app");
// require("./utility/connectWithDB");
app.listen(process.env.PORT || PORT, function () {
  console.log(`server is listening to port ${PORT}`);
});