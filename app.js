const express = require("express"), app = express(),
	Cors = require("cors"), morgan = require("./dev/morgan"),
	helmet = require("helmet");

const handlers = require("./handlers"), middleware = require("./middleware"), routes = require("./routes");

app.use(morgan.morganChalk);
app.use(helmet());
app.use(Cors("localhost:3000"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app, handlers, middleware);

app.use((req, res, next) => {
	res.status(404).send({ message: { page: "This page does not exists" } });
});

app.use((req, res, next) => {
	res.status(500).send({ message: { server: "Internal error" } });
});

module.exports = app;
