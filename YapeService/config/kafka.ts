import { KafkaClient, Producer, Consumer, CreateTopicRequest } from 'kafka-node';
import { updateStatus } from '../controllers/dbQuerys/transactions';
import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

class KafkaProducer {
	private client: KafkaClient;
	private producer: Producer;
	private consumer: Consumer;

	constructor(kafkaHost: string, topic: string) {
		this.client = new KafkaClient({ kafkaHost });
		this.producer = new Producer(this.client);

		this.initTopics();

		this.producer.on('ready', () => {
			console.log('Producer is ready');
		});
		this.producer.on('error', (err: any) => {
			console.error('Producer error:', err);
		});

		this.consumer = new Consumer(this.client, [{ topic, partition: 0 }], { autoCommit: false });
		this.consumer.on('message', this.handleMessage.bind(this));
		this.consumer.on('error', this.handleError.bind(this));
		process.on('SIGINT', () => this.close());
	}

	private initTopics(): void {
		const antifraudServiceTopic = process.env.KAFKA_TOPIC || 'antifraud_service_responce';
		const Topics: CreateTopicRequest[] = [{ topic: antifraudServiceTopic, partitions: 1, replicationFactor: 1 }];

		this.client.createTopics(Topics, () => {
			console.log('Topics initialized');
		});
	}

	private commitResponse(): void {
		this.consumer.commit((error: any, data: any) => {
			if (error) {
				console.error('Error committing offset:', error);
			} else {
				console.log('Offset committed:', data);
			}
		});
	}

	public sendMessage(topic: string, message: Object, partition: number = 0): void {
		const payloads = [{ topic, messages: JSON.stringify(message), partition }];
		this.producer.send(payloads, (err, data) => {
			if (err) {
				console.error('Error producing message:', err);
			} else {
				console.log('Produced message:', data);
			}
		});
	}

	private async handleMessage(message: any): Promise<void> {
		if (!message.value) return this.commitResponse();
		try {
			const parsedMessage = JSON.parse(message.value);
			await updateStatus(parsedMessage);
			console.log('Received message:', parsedMessage);
		} catch (e) {
			console.error('Error on update:', e);
		} finally {
			this.commitResponse();
		}
	}

	private handleError(error: Error): void {
		console.error('Consumer error:', error);
	}

	close(): void {
		this.consumer.close(() => {
			console.log('Consumer closed');
			this.client.close();
		});
	}
}

const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';
const kafkaTopic = process.env.KAFKA_TOPIC || 'antifraud_service_responce';
console.log('VARIABLES KAFKA', kafkaHost, kafkaTopic);
export const antifraudService = new KafkaProducer(kafkaHost, kafkaTopic);
export default KafkaProducer;
