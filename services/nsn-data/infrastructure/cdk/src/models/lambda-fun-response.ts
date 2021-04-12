import { IFunction } from '@aws-cdk/aws-lambda';

export interface LambdaFunResponse {
    name: string;
    function: IFunction;
}
