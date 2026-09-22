import { IsString, IsUUID } from "class-validator";

export class BookServiceSlotDto {
  @IsUUID()
  doctorId!: string;

  @IsUUID()
  serviceId!: string;

  @IsString()
  date!: string; // "YYYY-MM-DD"

  @IsString()
  start_time!: string; // "HH:MM"
}
