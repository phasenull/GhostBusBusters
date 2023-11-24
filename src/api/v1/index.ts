import { Router } from "express"
import { QuickResponse } from "../../common/QuickResponse"
const router = Router()
const WATCH = require("./watcher")

const ROUTES: Array<{ path: string; middleware: Router }> = [{ path: "/watcher", middleware: WATCH }]

ROUTES.forEach((route) => {
	router.use(route.path, route.middleware)
})
router.get("/", (req, res) => {
	const { query } = req
	const { throw_error } = query
	if (throw_error == "true") {
		return res.json(new QuickResponse().ForCommand("api/v1").WithError({ message: "Hello, World!", key: "hello" }).WithStatus(500))
	} else {
		return res.json(new QuickResponse().ForCommand("api/v1").WithData({ message: "Hello, World!" }).WithStatus(200))
	}
})
module.exports = router
