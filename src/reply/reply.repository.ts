import { Repository, EntityRepository } from 'typeorm';
import { Reply } from './reply.entity';

@EntityRepository(Reply)
export class ReplyRepository extends Repository<Reply> {}
