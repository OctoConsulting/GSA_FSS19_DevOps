## Set environment variables

MacOs/Linux Shell:

```
export SHORT_ENV='dev' AWS_ACCOUNT='902479997164' AWS_REGION='us-east-1'


aws s3 cp ../../modules/nodejs/packages/get-contract-aco-office-address-details/dist/get-contract-aco-office-address-details/index.zip s3://artifacts-902479997164-us-east-1-dev/services/contract-const/get-contract-aco-office-address-details/index.zip --profile fss

aws s3 cp ../../modules/nodejs/packages/get-contract-buyer-details/dist/get-contract-buyer-details/index.zip s3://artifacts-902479997164-us-east-1-dev/services/contract-const/get-contract-buyer-details/index.zip --profile fss

aws s3 cp ../../modules/nodejs/packages/get-contract-vendor-address-details/dist/get-contract-vendor-address-details/index.zip s3://artifacts-902479997164-us-east-1-dev/services/contract-const/get-contract-vendor-address-details/index.zip --profile fss

```

Windows PowerShell:

```
$env:SHORT_ENV='qa'
```

## Deploy Stacks

```
cdk synth nsn-api
cdk deploy nsn-api
```

## Useful commands

-   `npm run build` compile typescript to js
-   `npm run watch` watch for changes and compile
-   `cdk deploy` deploy this stack to your default AWS account/region
-   `cdk diff` compare deployed stack with current state
-   `cdk synth` emits the synthesized CloudFormation template

Testing Private Apis:

```
curl --location --request GET 'https://vpce-0e3bd8eb42ea7a5af-abcdefg.execute-api.us-east-1.vpce.amazonaws.com/qa/contractinformation/v1/contracts/c1234' \
--header 'x-apigw-api-id: 9fm5wo8et6'
x-apigw-api-id >> Api Gateway Api Id:
Host: Execute Api VPC Endpoint
```
