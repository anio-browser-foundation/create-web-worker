<?php

function handleRequest($root, $request) {
	if (str_ends_with($request, ".mjs")) {
		header("Content-Type: text/javascript");
		echo file_get_contents("$root/$request");
		exit();
	} else if (str_ends_with($request, ".html")) {
		header("Content-Type: text/html");
		echo file_get_contents("$root/$request");
		exit();
	}
}

handleRequest(__DIR__, $_SERVER["REQUEST_URI"]);
