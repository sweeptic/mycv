import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {
    }
    create(email: string, password: string) {
        const user = this.repo.create({ email, password })

        return this.repo.save(user)
    }

    findOne(id: any) {

        return this.repo.findOne({ where: { id } })
        // return this.repo.findOne({ id })
    }

    find(email: any) {
        console.log('find....', email);
        // return this.repo.find({ email })
        return this.repo.find({ where: { email } })
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new Error("user not found");
        }
        Object.assign(user, attrs)
        return this.repo.save(user)
    }

    async remove(id: number) {
        const user = await this.findOne(id)
        // if (!user) {
        // throw new Error("user not found");
        // {
        //     "statusCode": 500,
        //         "message": "Internal server error"
        // }
        // }
        if (!user) {
            throw new NotFoundException("user not found");

        }
        return this.repo.remove(user)
    }

}
