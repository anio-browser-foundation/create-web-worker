import fs from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

const bootstrap = (await fs.readFile(
	path.resolve(__dirname, "src", "bootstrap.mjs")
)).toString()

let index = (await fs.readFile(
	path.resolve(__dirname, "src", "index.template.mjs")
)).toString()


index = index.split("`$bootstrap.mjs_file_contents$`").join(
	JSON.stringify(bootstrap)
)

await fs.writeFile(
	path.resolve(__dirname, "src", "index.mjs"), index
)
