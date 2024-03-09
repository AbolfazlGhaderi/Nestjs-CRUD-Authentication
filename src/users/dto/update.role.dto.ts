import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UpdateRoleDTO{

    @IsString()
    @IsEnum(['Admin','User'])
    role:string
}