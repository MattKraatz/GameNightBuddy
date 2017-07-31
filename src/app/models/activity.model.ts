import {User} from './user.model';

export class Activity {
  ActivityId: number;
  UserId: string;
  GameNightId?: string;
  ActivityType: string;
  EntityType: string;
  EntityId: string;
  DateCreated: Date;
  Entity: any;
  User: User;
}