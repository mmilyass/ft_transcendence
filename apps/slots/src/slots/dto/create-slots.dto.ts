import { Type } from "class-transformer";
import { IsInt, Min, IsString, IsArray, ValidateNested } from "class-validator";
class ShiftDto {
  @IsString()
  start_hour!: string;

  @IsString()
  end_hour!: string;
}

export class CreateSlotsDto {
  @IsString()
  start_date!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  number_of_days!: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShiftDto)
  shifts!: ShiftDto[];
}
