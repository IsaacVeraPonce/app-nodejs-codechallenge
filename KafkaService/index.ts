import { KafkaClient, Producer, Consumer, CreateTopicRequest } from 'kafka-node';
import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

// Definición de los topics a crear
const Topics: CreateTopicRequest[] = [
	{
		topic: 'antifraud_service',
		partitions: 1,
		replicationFactor: 1,
	},
	{
		topic: 'antifraud_service_responce',
		partitions: 1,
		replicationFactor: 1,
	},
];

class KafkaConsumer {
	private client: KafkaClient;
	private consumer: Consumer;
	private producer: Producer;

	constructor(client: KafkaClient, producer: Producer, topic: string) {
		this.client = client;
		this.producer = producer;

		// Crear los topics si no existen
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

	private commitResponse(): void {
		this.consumer.commit((error: any, data: any) => {
			if (error) {
				console.error('Error committing offset:', error);
			} else {
				console.log('Offset committed:', data);
			}
		});
	}

	private handleMessage(message: any): void {
		if (!message.value) return this.commitResponse();

		try {
			const parsedMessage = JSON.parse(message.value);
			console.log('Received message:', parsedMessage);

			const response = {
				transaction_external_id: parsedMessage.transaction_external_id,
				status: parsedMessage.value > 1000 ? 3 : 2,
			};

			this.sendMessage('antifraud_service_responce', response);
			console.log('Sending response:', response);
		} catch (error) {
			console.error('Error parsing message:', error);
		} finally {
			return this.commitResponse();
		}
	}

	private handleError(error: Error): void {
		console.error('Consumer error:', error);
	}

	public close(): void {
		this.consumer.close(() => {
			console.log('Consumer closed');
			this.client.close();
		});
	}
}

// Obtener configuración de variables de entorno
const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';
const topic = process.env.KAFKA_TOPIC || Topics[0].topic; // LOCAL TOPIC

// Crear instancias de KafkaClient y Producer
const kafkaClient = new KafkaClient({ kafkaHost });
const kafkaProducer = new Producer(kafkaClient);

// Crear instancia de KafkaConsumer
const kafkaConsumer = new KafkaConsumer(kafkaClient, kafkaProducer, topic);
console.log('SERVICE RUNNING');
