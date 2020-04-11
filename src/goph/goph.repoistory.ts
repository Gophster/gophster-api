import { Repository, EntityRepository } from 'typeorm';
import { Goph } from './goph.entity';

@EntityRepository(Goph)
export class GophRepository extends Repository<Goph> {}
