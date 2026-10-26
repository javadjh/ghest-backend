import { Log, LogAction } from "@/modules/logs/schemas/log.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export interface LogPayload {
  action: LogAction;
  entity?: string;
  entityId?: string;
  description: string;
  userId?: string;
  username?: string;
  ip?: string;
  details?: any;
}

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger("Audit");

  constructor(@InjectModel(Log.name) private readonly logModel: Model<any>) {}

  async log(payload: LogPayload): Promise<void> {
    try {
      await this.logModel.create({
        action: payload.action,
        entity: payload.entity,
        entityId: payload.entityId,
        description: payload.description,
        userId: payload.userId,
        username: payload.username,
        ip: payload.ip,
        details: payload.details,
        timestamp: new Date(),
      });
      this.logger.log(`[${payload.action}] ${payload.description}`);
    } catch (e) {
      this.logger.warn(`log write failed: ${(e as Error).message}`);
    }
  }
}
