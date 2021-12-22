import { Application } from '../declarations';
import users from './users/users.service';
import team from './team/team.service';
import event from './event/event.service';
import collectedPoints from './collected-points/collected-points.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(team);
  app.configure(event);
  app.configure(collectedPoints);
}
