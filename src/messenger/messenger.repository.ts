import { Message } from './messenger.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Message)
export class MessengerRepository extends Repository<Message> {}
