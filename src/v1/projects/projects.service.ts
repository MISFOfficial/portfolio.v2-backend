import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findOne(_id: string): Promise<Project> {
    const project = await this.projectModel.findOne({ _id });
    if (!project) {
      throw new NotFoundException(`Project with _ID ${_id} not found`);
    }
    return project;
  }

  async update(_id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const updatedProject = await this.projectModel
      .findOneAndUpdate({ _id }, updateProjectDto, { new: true })
      .exec();
    if (!updatedProject) {
      throw new NotFoundException(`Project with _ID ${_id} not found`);
    }
    return updatedProject;
  }

  async remove(_id: string): Promise<any> {
    const result = await this.projectModel.deleteOne({ _id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Project with _ID ${_id} not found`);
    }
    return { deleted: true };
  }
}



