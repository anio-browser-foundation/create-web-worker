import browserCreateWebWorker from "/src/index.mjs"

const worker = await browserCreateWebWorker("/example/web_worker.mjs", ["a", "b"], {
	bootstrap: "/src/bootstrap.mjs"
})

worker.sendMessage("Hello from main!")

worker.onMessage = (msg) => {
	console.log("Got message from web worker", msg)
}

setTimeout(() => {
	worker.sendMessage("Hello from main again!")
}, 1000)
