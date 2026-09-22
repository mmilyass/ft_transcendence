import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
} from "class-validator";

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(480)
  duration?: number;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
  isActive?: boolean;
}
