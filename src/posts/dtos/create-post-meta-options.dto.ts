import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMetaOptionsDtos {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
