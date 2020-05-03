import {
  InsertEvent,
  EntitySubscriberInterface,
  RemoveEvent,
  EventSubscriber,
} from 'typeorm';

import { Follow } from 'src/follow/follow.entity';

@EventSubscriber()
export class FollowSubscriber implements EntitySubscriberInterface<Follow> {
  listenTo() {
    return Follow;
  }

  async afterInsert(event: InsertEvent<Follow>) {
    const authorFollowing = await event.manager.count(Follow, {
      where: {
        author: event.entity.author,
      },
    });
    const reciverFollowers = await event.manager.count(Follow, {
      where: {
        reciver: event.entity.reciver,
      },
    });

    event.entity.author.followingAmount = authorFollowing;
    event.entity.reciver.followersAmount = reciverFollowers;
    event.manager.save(event.entity.author);
    event.manager.save(event.entity.reciver);
  }

  async afterRemove(event: RemoveEvent<any>) {
    const authorFollowing = await event.manager.count(Follow, {
      where: {
        author: event.entity.author,
      },
    });
    const reciverFollowers = await event.manager.count(Follow, {
      where: {
        reciver: event.entity.reciver,
      },
    });

    event.entity.author.followingAmount = authorFollowing;
    event.entity.reciver.followersAmount = reciverFollowers;
    event.manager.save(event.entity.author);
    event.manager.save(event.entity.reciver);
  }
}
