const {
	SerialPort
} = require('serialport')

const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const app = express();
app.set("port", 3100);
const server = http.createServer(app);
const io = socketIO(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

const port = new SerialPort({
	path: '/dev/ttyUSB0',
	baudRate: 9600
})

io.on("connection", (socket) => {
	console.log("Socket Connected");

	socket.on("disconnect", () => {
		console.log("Socket Disconnected!");
	});
});

server.listen(app.get("port"), () => {
	console.log(`Dispatcher on port: ${app.get("port")}`);
});

port.on('data', (data) => {
	io.emit('qrcode', data.toString())
	console.log('QRCODE: ' + data.toString())
});