import { Resolver, Root, Subscription } from "type-graphql";
import {
  Notification,
  NotificationPayload,
} from "../utilities/notification.type";

@Resolver(Notification)
export class NotificationResolver {
  @Subscription({ topics: "NOTIFICATIONS" })
  newNotification(
    @Root() { field, message }: NotificationPayload
  ): Notification {
    return { field, message, createdAt: new Date() }
  }
}
