import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";

interface AuthUser {
  sub: string;
  email: string;
  role: string;
}

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Current user's notifications
  @Get("mine")
  findMine(@Req() req: Request & { user: AuthUser }) {
    return this.notificationService.findMine(req.user.sub);
  }

  // Latest notifications for dropdown
  @Get("latest")
  latest(@Req() req: Request & { user: AuthUser }) {
    return this.notificationService.latest(req.user.sub);
  }

  // Current user's unread count
  @Get("unread-count")
  getUnreadCount(@Req() req: Request & { user: AuthUser }) {
    return this.notificationService.getUnreadCount(req.user.sub);
  }

  // Current user's unread notifications
  @Get("unread")
  getUnreadNotifications(@Req() req: Request & { user: AuthUser }) {
    return this.notificationService.getUnreadNotifications(req.user.sub);
  }

  // Mark a single notification as read
  @Patch("mark-read/:id")
  markRead(@Param("id") id: string) {
    return this.notificationService.markRead(id);
  }

  // Mark all notifications as read
  @Patch("mark-all-read")
  markAllRead(@Req() req: Request & { user: AuthUser }) {
    return this.notificationService.markAllRead(req.user.sub);
  }

  // Create notification
  @Post()
  create(
    @Body()
    createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.create(createNotificationDto);
  }

  // Admin/debug endpoints
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body()
    updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.notificationService.remove(id);
  }
}
