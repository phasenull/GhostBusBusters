// require modules
import Logger from "./common/Logger";
import express, { Router } from "express";
import { QuickResponse } from "./common/QuickResponse";
import TestCase from "./common/TestCase";
require("dotenv").config();
const APP = express();

const AVAILABLE_API_VERSIONS = ["v1"];
const APIS = AVAILABLE_API_VERSIONS.map((version) => {
	try {
		const to_return = { key: version, middleware: require(`./api/${version}`) };
		return to_return;
	} catch (error) {
		Logger.error("MAIN", `Failed to load API version ${version}`);
		return { key: `${version}`, middleware: Router(), error: true };
	}
});
const PREFLIGHT: TestCase = require("./tests/preflight");
const VERSION_CHECK: TestCase = require("./tests/api/version_check");
const TESTS = [PREFLIGHT, VERSION_CHECK];
function main() {
	const CONFIG = { PORT: process.env.PORT }; //PRIVATE_KEY: "privatekey.pem", CERTIFICATE: "certificate.pem" }
	const OPTIONS = {}; //{ key: CONFIG.PRIVATE_KEY, cert: CONFIG.CERTIFICATE }
	TESTS.forEach((test: TestCase, i) => {
		test
			.on("fail", (err) => {
				Logger.error(
					"MAIN",
					`❌ \x1b[41mFailed TestCase \x1b[0m \x1b[46m\x1b[4m(${i + 1}/${TESTS.length})\x1b[0m - ${test._name} - ${
						test._description
					} - ${err.message}`
				);
				throw err;
			})
			.on("pass", () => {
				Logger.info(
					"MAIN",
					`✅ \x1b[42mPassed TestCase\x1b[0m \x1b[46m\x1b[4m(${i + 1}/${TESTS.length})\x1b[0m - ${test._name} - ${
						test._description
					}`
				);
			});
	});
	PREFLIGHT.run({
		config: CONFIG,
		available_api_versions: APIS,
	});
	VERSION_CHECK.run({ available_api_versions: APIS });

	APIS.forEach((api: { key: string; middleware: Router }) => {
		Logger.info("MAIN", `Loading API version ${api.key}`);
		APP.use(`/api/${api.key}/`, api.middleware);
		APP.use(`/api/*`, (req, res) => {
			new QuickResponse(res)
				.WithError({
					message: `Invalid api version, available versions: ${AVAILABLE_API_VERSIONS}`,
					key: "invalid_api_version",
				})
				.WithStatus(404);
		});
	});

	APP.use("/*", (req, res) => {
		new QuickResponse(res)
			.WithError({
				message: "Invalid path or method",
				key: "invalid_path_or_method",
			})
			.WithStatus(404);
	});
	APP.on("error", (err) => {
		Logger.error("MAIN", err);
	}).listen(CONFIG.PORT, () => {
		Logger.info("MAIN", `Server listening on port ${CONFIG.PORT}`);
	});
}
main()
// https.createServer(OPTIONS, APP).listen(CONFIG.PORT, () => {
// 	console.log(`${getTime()} - Server listening on port ${CONFIG.PORT}`)
// })
