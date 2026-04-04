import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma:PrismaService){}

    async createUser(createUserDto: CreateUserDto):Promise<User> {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword =  await bcrypt.hash(createUserDto.password, salt);

        return this.prisma.user.create( {
            data:{
                username:createUserDto.username,
                email: createUserDto.email,
                password: hashedPassword
            }
        })    
    }

    async updateUser(params:{  where: Prisma.UserWhereUniqueInput , data: Prisma.UserUpdateInput }):Promise<User>{
        const {where, data } = params;
        return this.prisma.user.update( {where , data} );
    }

    async getAllUsers():Promise<User[]>{
        const users = await this.prisma.user.findMany({})
        return users;
    }

    async findUser( field:any , value:any ){
        const user = await this.prisma.user.findUnique({
            where:{
                [field] : value
            } as Prisma.UserWhereUniqueInput
        })
        return user;
    }

    async findUserById(id:number){
        const user = await this.prisma.user.findUnique({
            where:{
                id:id
            },
            select: {
                id: true,
                username: true,
                email: true,
                createsAt: true,
              }
        })
        return user;
    }


    async getUserByUsername(username:string){
        const user = await this.prisma.user.findUnique({
            where:{
                username:username
            }
        })
        return user;
    }

    // Delete
    async deleteUser(username:string){
        const result = await this.prisma.user.delete({
            where:{
                username:username
            }
        })
    }


}

