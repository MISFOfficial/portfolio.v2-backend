import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill, SkillDocument, SkillCategory } from './entities/skill.entity';
import { ImageService } from 'src/image/image.service';
import { row1, row2, row3 } from 'src/config/Data';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createSkillDto: CreateSkillDto,
    logo: Express.Multer.File,
  ): Promise<Skill> {
    if (!logo) {
      throw new BadRequestException('Skill logo image is required');
    }
    const uploadedImage = await this.imageService.create(logo);
    const createdSkill = new this.skillModel({
      ...createSkillDto,
      logo: uploadedImage._id,
    });
    const savedSkill = await createdSkill.save();
    return savedSkill.populate({ path: 'logo', model: 'Image' });
  }

  async findAll(): Promise<Skill[]> {
    return this.skillModel.find().populate('logo').exec();
  }

  async findByCategory(category: SkillCategory): Promise<Skill[]> {
    return this.skillModel.find({ category }).populate('logo').exec();
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillModel.findById(id).populate('logo').exec();
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
    logo?: Express.Multer.File,
  ): Promise<Skill> {
    const skillData: any = { ...updateSkillDto };
    if (logo) {
      const uploadedImage = await this.imageService.create(logo);
      skillData.logo = uploadedImage._id;
    }

    const updatedSkill = await this.skillModel
      .findByIdAndUpdate(id, skillData, { new: true })
      .populate('logo')
      .exec();
    if (!updatedSkill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return updatedSkill;
  }

  async remove(id: string): Promise<any> {
    const result = await this.skillModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return { deleted: true };
  }

  async seed(): Promise<any> {
    const existingSkills = await this.skillModel.countDocuments();
    if (existingSkills > 0) {
      return { message: 'Database already seeded', count: existingSkills };
    }

    const skillsToSeed = [
      ...row1.map((s) => ({ ...s, category: SkillCategory.FRONTEND })),
      ...row2.map((s) => ({ ...s, category: SkillCategory.BACKEND })),
      ...row3.map((s) => ({ ...s, category: SkillCategory.SOFTSKILL })),
    ];

    await this.skillModel.insertMany(skillsToSeed);
    return {
      message: 'Database seeded successfully',
      count: skillsToSeed.length,
    };
  }
}
