import express from "express"; // [1]
const app = express(); // [2]
import connectDB from "./loader/db";
import config from "./config";
const {logger} = require("./modules/logger");
import morgan from "morgan";
const cors = require('cors');
const koreanDate = require('./modules/dateCalculate');

const whitelist = ['http://3.37.75.200','http://127.0.0.1'];

var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
}
const morganOptions = "[:koreanDate] :method :url :status :response-time mx - :res[content-length] :remote-addr";
morgan.token('koreanDate',function (req,res) {
  return koreanDate.getDate();
});
// Connect Database
connectDB();

app.use(cors(corsOptions));
app.use(express.json()); // [3]
// Define Routes
app.use(morgan(morganOptions,{"stream":logger.stream.write}));
app.use("/cafes", require("./api/cafes")); // [4]
app.use("/user", require("./api/user"));
app.use("/reviews", require("./api/reviews"));
app.use("/category", require("./api/category"));
app.use("/cafeti", require("./api/cafeti"));
app.use("/geocoder", require("./api/geocoder"));
app.use("/admin", require("./api/admin"));
app.use("/search", require("./api/search"));

// error handler
app.use(function (err, req, res, next) {
  logger.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: err.message
  });
  
});

app // [5]
  .listen(config.port, () => {
    console.log(`
    ################################################
          🎄  Server listening on port: ${config.port} 🎄
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);

    process.exit(1);
  });
