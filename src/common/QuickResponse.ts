export class QuickResponse {
	success: boolean
	data?: any
	cmd: string
	server_time: number
	error?: { message: string; key: string }
	status: number
	constructor() {
		this.success = false
		this.cmd = ""
		this.server_time = Date.now()
		this.status = 500
		return this
	}
	ForCommand(cmd: string) {
		this.cmd = cmd
		return this
	}
	WithData(data: any) {
		this.success = true
		this.data = data
		return this
	}

	WithError({ message, key }: { message: string; key: string }) {
		this.success = false
		this.error = { message, key }
		return this
	}
	WithStatus(status: number) {
		this.status = status
		return this
	}
}
