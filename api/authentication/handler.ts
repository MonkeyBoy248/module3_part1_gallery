import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import {
  APIGatewayAuthorizerResult,
  APIGatewayProxyHandlerV2,
  APIGatewayTokenAuthorizerWithContextHandler
} from "aws-lambda";
import { AuthManager } from "./auth.manager";

export const signUp: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log(event);

  try {
    const manager = new AuthManager();
    const user = event.body!;

    const response = await manager.signUp(user);

    return createResponse(200, response);
  } catch (err) {
    return errorHandler(err);
  }
}

export const logIn: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log(event);

  try {
    const manager = new AuthManager();
    const user = event.body!

    const token = await manager.logIn(user);

    return createResponse(200, { token });
  } catch (err) {
    return errorHandler(err);
  }
}

export const uploadDefaultUsers: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log(event)

  try {
    const manager = new AuthManager();
    const response = await manager.uploadDefaultUsers();

    return createResponse(200, response);
  } catch (err) {
    return errorHandler(err);
  }
}

export function generatePolicy<C extends APIGatewayAuthorizerResult['context']>(
  principalId: string,
  effect: 'Allow' | 'Deny',
  resource: string,
  context: C
): APIGatewayAuthorizerResult & { context: C } {
  const authResponse: APIGatewayAuthorizerResult & { context: C } = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };

  return authResponse;
}

export const authenticate: APIGatewayTokenAuthorizerWithContextHandler<Record<string, any>> = async (event, context) => {
  console.log(event);

  try {
    const manager = new AuthManager();
    const token = event.authorizationToken;

    console.log('token', token);

    const user = await manager.authenticate(token);

    return generatePolicy('user', 'Allow', '*', {email: user.email});
  } catch (err) {
    return generatePolicy('user', 'Deny', '*', {});
  }
}



