import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {Transport} from "@nestjs/microservices";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require(`dotenv`).config();

async function bootstrap() {

	const app = await NestFactory.create(AppModule);
	app.enableCors();

	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [`amqp://192.168.50.145:5672`],
			queue: `binance`,
			queueOptions: {
				durable: false
			},
		},
	});

	await app.listen(10000, `0.0.0.0`);
}

bootstrap().then();
