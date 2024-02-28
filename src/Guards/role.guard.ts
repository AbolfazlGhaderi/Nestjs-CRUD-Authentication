import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class roleGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        if(request.user['role']  !== 'Admin'){
            return false
        }

        return true
    }
    
}