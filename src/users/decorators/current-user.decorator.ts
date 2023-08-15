import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        // console.log('context', context);
        const request = context.switchToHttp().getRequest()

        // console.log('request.session.userId', request.session.userId);
        // return 'hi there'
        console.log('debug', request.currentUser);

        return request.currentUser
    }
)