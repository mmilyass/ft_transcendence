import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class GetDoctorsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  speciality?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  availableToday?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  online?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
