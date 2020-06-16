import { Notification } from './notification.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {}
