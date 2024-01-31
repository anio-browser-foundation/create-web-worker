import createPromise from "@anio-js-core-foundation/create-promise"

function createWebWorkerInstance({
	web_worker,
	web_worker_message_buffer
}) {
	let instance = {}

	Object.defineProperty(instance, "onMessage", {
		set(handler) {
			// dump message buffer first
			while (web_worker_message_buffer.length) {
				const msg = web_worker_message_buffer.shift()

				handler(msg.data)
			}

			web_worker.onmessage = (msg) => handler(msg.data)
		}
	})

	Object.defineProperty(instance, "sendMessage", {
		enumerable: true,
		get() { return (str) => web_worker.postMessage(str) }
	})

	Object.defineProperty(instance, "terminate", {
		enumerable: true,
		get() { return () => web_worker.terminate() }
	})

	return instance
}

function createBootstrapBlob() {
	const blob = new Blob([`$bootstrap.mjs_file_contents$`], {type: "text/javascript"})

	return URL.createObjectURL(blob)
}

export default function browserCreateWebWorker(worker_file_url, worker_args, additional = {}) {
	let {promise, resolve, reject} = createPromise()

	const init_token = Math.random().toString(32) + "_" + Math.random().toString(32)

	const url = createBootstrapBlob()

	let web_worker = new window.Worker(url)
	let web_worker_message_buffer = []

	web_worker.onerror = reject

	web_worker.onmessage = msg => {
		if (msg.data === init_token) {
			web_worker.onerror = undefined

			resolve(
				createWebWorkerInstance({
					web_worker,
					web_worker_message_buffer
				})
			)
		}
		// buffer other messages between web worker and main script
		else {
			web_worker_message_buffer.push(msg)
		}
	}

	web_worker.postMessage("init" + JSON.stringify({
		worker_file_url,
		worker_args,
		init_token,
		additional
	}))

	return promise
}
