import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color
    }

    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color
    }




    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        // console.log(body);
        // this.usersService.create(body.email, body.password)
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {

        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }


    @Post('/signout')
    signOut(@Session() session: any) {
        console.log('session:', session);

        session.userId = null
    }


    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     console.log('session:', session);

    //     return this.usersService.findOne(session.userId)
    // }


    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user
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
