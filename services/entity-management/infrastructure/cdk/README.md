## Set environment variables

MacOs/Linux Shell:

```
export SHORT_ENV='dev' AWS_ACCOUNT='902479997164' AWS_REGION='us-east-1'

aws s3 cp ../../modules/nodejs/get-entity-details/dist/get-entity-details/index.zip s3://artifacts-902479997164-us-east-1-dev/services/entity-management/get-entity-details/index.zip --profile fss

```

Windows PowerShell:

```
$env:SHORT_ENV='qa'
```

## Deploy Stacks

```
cdk synth entity-management-api
cdk deploy entity-management-api
```

## Useful commands

-   `npm run build` compile typescript to js
-   `npm run watch` watch for changes and compile
-   `cdk deploy` deploy this stack to your default AWS account/region
-   `cdk diff` compare deployed stack with current state
-   `cdk synth` emits the synthesized CloudFormation template
