import EventEmitter from "events";
import Logger from "./Logger";

export default class TestCase {
	private task?: Function;
	private passed: boolean = false;
	private error: unknown = null;
	public _event_emitter: EventEmitter;
	public setName(name: string) {
		this._name = name;
		return this
	}
	public setDescription(description: string) {
		this._description = description;
		return this
	}
	public setTask(task: Function) {
		this.task = task;
		return this
	}
	public on(event: "pass" | "fail", listener: (...args: any[]) => void) {
		this._event_emitter.on(event, listener);
		return this
	}
	constructor() {
		this._event_emitter = new EventEmitter();
		return this
	}
	private _fail(error: unknown) {
		this.passed = false;
		this.error = error;
		this._event_emitter.emit("fail", error);
	}
	private _pass() {
		this.passed = true;
		this._event_emitter.emit("pass");
	}
	private _run(...args: any[]) {
		if (!this.task) throw new Error("No task was defined for this test case");
		this.task(...args);
	}
	public run(...args: any[]) {
		try {
			this._run(...args);
			this._pass();
		} catch (error) {
			this._fail(error);
		}
		return this
	}
	_name: string = "Unnamed Test Case";
	_description?: string = "No description was provided";
}
