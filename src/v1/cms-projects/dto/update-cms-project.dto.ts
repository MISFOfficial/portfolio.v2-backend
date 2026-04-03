import { PartialType } from '@nestjs/swagger';
import { CreateCmsProjectDto } from './create-cms-project.dto';

export class UpdateCmsProjectDto extends PartialType(CreateCmsProjectDto) {}
