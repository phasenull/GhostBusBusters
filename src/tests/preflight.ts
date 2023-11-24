import TestCase from "../common/TestCase";

module.exports = new TestCase()
	.setName("Preflight Test")
	.setDescription("Config Checks")
	.setTask(
		({
			config,
			available_api_versions,
		}: {
			config: any;
			available_api_versions: any;
		}) => {
			if (!config) throw new Error("No config was provided");
			if (!config.PORT) throw new Error("No port was provided");
			// if (!config.PRIVATE_KEY) throw new Error("No private key was provided");
			// if (!config.CERTIFICATE) throw new Error("No certificate was provided");
			if (!available_api_versions)
				throw new Error("No available_api_versions was provided");
			if (!available_api_versions.length)
				throw new Error("No item was provided to available_api_versions");
		}
	);
