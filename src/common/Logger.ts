const fs = require("fs");
fs.mkdirSync("./logs", { recursive: true });
const writeStream = fs.createWriteStream("./logs/latest.log", { flags: "a" });
export default abstract class Logger {
	public static log(stack: string, ...args: any[]) {
		const text = `${getPrefix("LOG", stack)} ${args}`;
		writeStream.write(text.toString() + "\n");
		console.log(text);
	}
	public static error(stack: string, ...args: any[]) {
		const text = `${getPrefix("ERROR", stack)} ${args}`;
		writeStream.write(text.toString() + "\n");
		console.log(text);
	}
	public static warning(stack: string, ...args: any[]) {
		const text = `${getPrefix("WARNING", stack)} ${args}`;
		writeStream.write(text.toString() + "\n");
		console.log(text);
	}

	public static info(stack: string, ...args: any[]) {
		const text = `${getPrefix("INFO", stack)} ${args}`;
		writeStream.write(text.toString() + "\n");
		console.log(text);
	}
}
function getTime() {
	const date = new Date();
	return `${date.getHours().toString().padStart(2, "0")}:${date
		.getMinutes()
		.toString()
		.padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${date
		.getDate()
		.toString()
		.padStart(2, "0")}/${date.getMonth().toString().padStart(2, "0")}/${date
		.getFullYear()
		.toString()
		.padStart(4, "0")}`;
};

function getPrefix(log_type: string, stack?: string) {
	return `${getTime()} [${log_type}/${stack || "unknown"}]:`;
}
