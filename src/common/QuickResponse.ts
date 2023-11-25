import { Response } from "express";
import Logger from "./Logger";

function getStatusColor(status: number) {
	switch (status) {
		case 200:
			return "\x1b[42m";
		case 201:
			return "\x1b[42m";
		case 202:
			return "\x1b[42m";
		case 203:
			return "\x1b[42m";
		case 204:
			return "\x1b[42m";
		case 400:
			return "\x1b[43m";
		case 401:
			return "\x1b[43m";
		case 402:
			return "\x1b[43m";
		case 403:
			return "\x1b[43m";
		case 404:
			return "\x1b[43m";
		case 500:
			return "\x1b[41m";
		default:
			return "\x1b[45m";
	}
}

export class QuickResponse {
	success: boolean;
	data?: any;
	cmd: string;
	server_time: number;
	error?: { message: string; key: string };
	status: number;
	_response: Response;
	constructor(res: Response) {
		this._response = res;
		this.success = false;
		this.cmd = res.req.baseUrl;
		this.server_time = Date.now();
		this.status = 500;
		return this;
	}
	ForCommand(cmd: string) {
		this.cmd = cmd;
		return this;
	}
	WithData(data: any) {
		this.success = true;
		this.data = data;
		return this;
	}
	WithError({ message, key }: { message: string; key: string }) {
		this.success = false;
		this.error = { message, key };
		return this;
	}
	WithStatus(status: number) {
		this.status = status;
		this._response.status(status).json({
			success: this.success,
			status: this.status,
			cmd: this.cmd || this._response.req.path,
			server_time: this.server_time,
			error: this.error,
			data: this.data,
		});

		const ip = this._response.req.socket.remoteAddress;
		const route = this._response.req.baseUrl;
		Logger.log(
			"MAIN",
			`${
				getStatusColor(status) || "\x1b[45m"
			}${status}\x1b[0m\t${ip}\t\x1b[33m${route}`
		);
		return;
	}
}
