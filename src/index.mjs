import createPromise from "@anio-js-core-foundation/create-promise"
import createTemporaryResource from "@anio-js-foundation/create-temporary-resource"
import eventEmitter from "@anio-js-core-foundation/simple-event-emitter"

import bootstrap_code from "includeStaticResource:../dist/bootstrap.mjs"

function createWebWorkerInstance({
	web_worker,
	web_worker_message_buffer
}) {
	let instance = {}
	let event_emitter = eventEmitter(["message"])

	let dispatchEvent = event_emitter.install(instance)

	web_worker.onmessage = msg => {
		dispatchEvent("message", msg.data)
	}

	/* dump message buffer on first 'message' handler installed */
	event_emitter.setOnEventHandlerAddedHandler((event_name, handler) => {
		if (event_name !== "message") return

		// dump buffer
		while (web_worker_message_buffer.length) {
			const msg = web_worker_message_buffer.shift()

			handler(msg.data)
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

export default async function browserCreateWebWorker(worker_file_url, worker_args, additional = {}) {
	let {promise, resolve, reject} = createPromise()

	const init_token = Math.random().toString(32) + "_" + Math.random().toString(32)

	const bootstrap = await createTemporaryResource(
		bootstrap_code, {type: "text/javascript"}
	)

	let web_worker = new window.Worker(bootstrap.location)
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

	return await promise
}
