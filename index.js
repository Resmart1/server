import { WebSocketServer } from "ws";
import { writeFile, readFileSync, existsSync } from "fs";
const log = existsSync('log') && readFileSync('log');

const wss = new WebSocketServer({ port: 8080 });

const clients = new Set();
let messages = JSON.parse(log) || [];

wss.on('connection', (ws) => {
	console.log('Соединение установлено');
	clients.add(ws);
	ws.send(JSON.stringify(messages));

	ws.on('message', (message) => {
		message = JSON.parse(message);
		console.log(`Получено сообщение: ${message}`);
		messages.push(message);
		for (let client of clients) {
			client.send(JSON.stringify([message]));
		}
		if (message.toString() === `Паравозик чух-чух`) {
		writeFile('log', JSON.stringify(''), err => {
		if (err) {
			console.log(err);
		}
		});
		messages = [];
		}
	});

	ws.on('close', () => {
		console.log('Соединение закрыто');
	});
});

process.on('SIGINT', () => {
	wss.close();
	writeFile('log', JSON.stringify(messages), err => {
		if (err) {
			console.log(err);
		}
		process.exit();
	});
})
