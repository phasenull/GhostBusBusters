import { Router } from "express";
import TestCase from "../../common/TestCase";

module.exports = new TestCase()
	.setName("Available API Versions")
	.setDescription("Check if all API versions are available")
	.setTask(({ available_api_versions }: { available_api_versions: Array<{key:string,router:Router,error?:boolean}> }) => {
		if (!available_api_versions)
			throw new Error("No available_api_versions was provided");
		if (!available_api_versions.length)
			throw new Error("No item was provided to available_api_versions");
		available_api_versions.forEach((data, index) => {
			if (data.error) throw new Error(`Failed to load API version ${data.key}`);
			try {
				require(`../../api/${data.key}`);
			} catch (error) {
				throw new Error(`Failed to load API version ${data.key}`);
			}
		})
	});
