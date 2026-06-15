import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { UpdateProfileBody, UserProfileResponse } from '../dto/user.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    find(criteria: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: criteria });
    }

    create(data: Partial<UserEntity>): Promise<UserEntity> {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async update(data: Partial<UserEntity> & Pick<UserEntity, 'id'>): Promise<UserEntity | null> {
        const { id, ...fields } = data;
        await this.userRepository.update(id, fields);
        return this.find({ id });
    }

    async getUserProfile(userId: string): Promise<UserProfileResponse> {
        const profile = await this.find({ id: userId });
        if (!profile) {
            throw new NotFoundException('User not found');
        }
        const { password, refreshToken, ...user } = profile;
        return user;
    }


}
