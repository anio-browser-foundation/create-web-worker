export default function browserCreateWebWorker(worker_file_url, worker_args, additional) {
	let resolve, reject;

	/**
	 * @anio-js-core-foundation/create-promise is not
	 * used here to keep this package dependency free.
	 */
	let promise = new Promise((a, b) => {
		resolve = a; reject = b;
	})

	const init_token = Math.random().toString(32) + "_" + Math.random().toString(32)

	let web_worker = new window.Worker(additional.bootstrap)
	let web_worker_message_buffer = []

	web_worker.onerror = reject

	web_worker.onmessage = msg => {
		if (msg.data === init_token) {
			web_worker.onerror = undefined

			let web_worker_instance = {}

			Object.defineProperty(web_worker_instance, "onMessage", {
				set(v) {
					while (web_worker_message_buffer.length) {
						const msg = web_worker_message_buffer.shift()

						v(msg.data)
					}

					web_worker.onmessage = (msg) => {
						v(msg.data)
					}
				}
			})

			Object.defineProperty(web_worker_instance, "sendMessage", {
				enumerable: true,
				get() {
					return (str) => {
						web_worker.postMessage(str)
					}
				}
			})

			Object.defineProperty(web_worker_instance, "terminate", {
				enumerable: true,

				get() {
					return () => {
						web_worker.terminate()
					}
				}
			})

			resolve(web_worker_instance)
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
