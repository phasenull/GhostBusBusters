import { Router } from "express";
import { QuickResponse } from "../../common/QuickResponse";
import { STATUS_CODES } from "http";
const router = Router();
const WATCH = require("./watcher");

const ROUTES: Array<{ path: string; middleware: Router }> = [
	{ path: "/watcher", middleware: WATCH },
];

ROUTES.forEach((route) => {
	router.use(route.path, route.middleware);
});
router.get("/", (req, res) => {
	const { query } = req;
	const { throw_error } = query;
	if (throw_error) {
		const code = parseInt(throw_error?.toString() || "0")
		return new QuickResponse(res)
			.WithError({ message: "Hello, World!1", key: "hello" })
			.WithStatus(code)
	} else {
		return new QuickResponse(res)
			.WithData({ message: "Hello, World!1" })
			.WithStatus(200);
	}
});

router.use("/*", (req, res) => {
	return new QuickResponse(res)
		.WithError({ message: "Invalid endpoint", key: "invalid_endpoint" })
		.WithStatus(404);
})
module.exports = router;
