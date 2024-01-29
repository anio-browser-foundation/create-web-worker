export function WebWorkerMain(...args) {
	console.log("WebWorkerMain", args)

	this.onMessage = data => {
		console.log("Web Worker got a message", data)
	}

	this.sendMessage("Hello from Web Worker!")

	setTimeout(() => {
		this.sendMessage("Hello again from Web Worker!")
	}, 1000)
}
