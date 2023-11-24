// require modules
import Logger from "./common/Logger";
import express, { Router } from "express";
import { QuickResponse } from "./common/QuickResponse";
import TestCase from "./common/TestCase";
require("dotenv").config();
const APP = express();

const AVAILABLE_API_VERSIONS = ["v1"];
const APIS = AVAILABLE_API_VERSIONS.map((version) => {
	return { key: version, middleware: require(`./api/${version}`) };
});


function main() {
	const PREFLIGHT: TestCase = require("./tests/preflight")
	
	const CONFIG = { PORT: process.env.PORT }; //PRIVATE_KEY: "privatekey.pem", CERTIFICATE: "certificate.pem" }
	const OPTIONS = {}; //{ key: CONFIG.PRIVATE_KEY, cert: CONFIG.CERTIFICATE }
	PREFLIGHT.on("pass", () => {
		Logger.info("MAIN", "✅ (Test 1/1) - Preflight passed");
	}).on("fail", (error: unknown) => {
		Logger.error("MAIN", "❌ (Test 1/1) - Preflight failed");
		throw error;
	}).run({
		config: CONFIG,
		available_api_versions: AVAILABLE_API_VERSIONS,
	})

	APIS.forEach((api: { key: string; middleware: Router }) => {
		Logger.info("MAIN", `Loading API version ${api.key}`);
		APP.use(`/api/${api.key}/`, api.middleware);
	});


	APP.get("/*", (req, res) => {
		res.json(
			new QuickResponse()
				.ForCommand(req.path)
				.WithError({ message: "Invalid path", key: "invalid_path" })
				.WithStatus(404)
		);
		const ip = req.socket.remoteAddress;
		const route = req.path;
		Logger.log("MAIN", `404\t-\t${ip}\t-\t${route}`);
	});
	APP.on("error", (err) => {
		Logger.error("MAIN", err);
	}).listen(CONFIG.PORT, () => {
		Logger.info("MAIN", `Server listening on port ${CONFIG.PORT}`);
	});
}
main();
// https.createServer(OPTIONS, APP).listen(CONFIG.PORT, () => {
// 	console.log(`${getTime()} - Server listening on port ${CONFIG.PORT}`)
// })
