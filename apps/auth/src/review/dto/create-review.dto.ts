import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CreateReviewDto {
  @IsInt({ message: "Rating must be a whole number" })
  @Min(1, { message: "Rating must be between 1 and 5" })
  @Max(5, { message: "Rating must be between 1 and 5" })
  rating: number;

  @IsOptional()
  @IsString({ message: "Comment must be text" })
  @MaxLength(1000, { message: "Comment must be 1000 characters or fewer" })
  comment?: string;
}
