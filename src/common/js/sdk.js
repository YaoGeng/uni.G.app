import scan from "./scan.js";
export default {
	api: (key, callback) => {
		switch (key) {
			case "scan":
				scan.methods.scan((data) => {
					callback(data);
				})
				break;
		}
	}
}
