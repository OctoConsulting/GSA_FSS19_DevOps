## Set environment variables

MacOs/Linux Shell:

```
export SHORT_ENV='dev' AWS_ACCOUNT='902479997164' AWS_REGION='us-east-1'

aws s3 sync ../../modules/nodejs/get-nsn-service-details/dist/get-nsn-service-details/ s3://artifacts-902479997164-us-east-1-dev/services/nsn-service/get-nsn-service-details --profile fss

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
