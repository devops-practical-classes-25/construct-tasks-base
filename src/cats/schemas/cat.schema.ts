import { ApiProperty } from "@nestjs/swagger";
import { CreateCatSchema } from "./create-cat.schema";

export class CatSchema extends CreateCatSchema {
  @ApiProperty({ example: 1, description: 'The unique identifier of the cat' })
  id: number;
}