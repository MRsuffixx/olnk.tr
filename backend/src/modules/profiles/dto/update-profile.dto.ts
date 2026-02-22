import { IsString, IsOptional, IsObject, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    displayName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @IsOptional()
    @IsObject()
    theme?: Record<string, unknown>;

    @IsOptional()
    @IsObject()
    layoutConfig?: Record<string, unknown>;
}
