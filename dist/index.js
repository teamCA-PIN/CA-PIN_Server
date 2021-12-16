"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // [1]
const app = express_1.default(); // [2]
const db_1 = __importDefault(require("./loader/db"));
const config_1 = __importDefault(require("./config"));
const { logger } = require("./modules/logger");
const morgan_1 = __importDefault(require("morgan"));
const cors = require('cors');
const whitelist = ['http://3.37.75.200', 'http://127.0.0.1'];
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
};
const morganOptions = "[:koreanDate] :method :url :status :response-time mx - :res[content-length] :remote-addr";
morgan_1.default.token('koreanDate', function (req, res) {
    return Date();
});
// Connect Database
db_1.default();
app.use(cors(corsOptions));
app.use(express_1.default.json()); // [3]
// Define Routes
app.use(morgan_1.default(morganOptions, { "stream": logger.stream.write }));
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
    .listen(config_1.default.port, () => {
    console.log(`
    ################################################
          🎄  Server listening on port: ${config_1.default.port} 🎄
    ################################################
  `);
})
    .on("error", (err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map