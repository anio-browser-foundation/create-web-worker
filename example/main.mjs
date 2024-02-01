import browserCreateWebWorker from "/dist/package.mjs"

const worker = await browserCreateWebWorker(
	document.location.origin + "/example/web_worker.mjs", ["a", "b"]
)

worker.sendMessage("Hello from main!")

worker.onMessage = (msg) => {
	console.log("Got message from web worker", msg)
}

setTimeout(() => {
	worker.sendMessage("Hello from main again!")
}, 1000)
