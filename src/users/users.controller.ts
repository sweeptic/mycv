import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) { // class validator here
        console.log(body);
        this.usersService.create(body.email, body.password)
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id: string) { // class validator here
        console.log('handler is running');

        const user = await this.usersService.findOne(parseInt(id))
        if (!user) {
            throw new NotFoundException("user not found");
        }

        return user
    }

    @Get()
    findAllUser(@Query('email') email: string) { // class validator here
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) { // class validator here
        return this.usersService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) { // class validator here
        return this.usersService.update(parseInt(id), body)
    }
}
