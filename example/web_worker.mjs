export function WebWorkerMain(...args) {
	console.log("WebWorkerMain", args)

	this.on("message", msg => {
		console.log("Web Worker got a message", msg)
	})

	this.sendMessage("Hello from Web Worker!")

	setTimeout(() => {
		this.sendMessage("Hello again from Web Worker!")
	}, 1000)
}
