## Set environment variables

MacOs/Linux Shell:

```
export SHORT_ENV='qa' AWS_ACCOUNT='111122223333' AWS_REGION='us-east-1'
```

Windows PowerShell:

```
$env:SHORT_ENV='qa'
```

## Deploy Stacks

```
cdk deploy fss-shared
cdk deploy contract-api
```

## Useful commands

-   `npm run build` compile typescript to js
-   `npm run watch` watch for changes and compile
-   `cdk deploy` deploy this stack to your default AWS account/region
-   `cdk diff` compare deployed stack with current state
-   `cdk synth` emits the synthesized CloudFormation template
