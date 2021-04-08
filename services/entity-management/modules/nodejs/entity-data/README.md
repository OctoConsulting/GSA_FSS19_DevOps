## `About`

    This function retuns nsn routing record for a give routing no

## Run locally

```
npm install -g lambda-local

lambda-local -l dist/nsn-get-routing/index.js -h handler -e test/samples/sample-request.js -t 15
```

## Build

```
With Development Profile: npm run build-dev
With Prod Profile: npm run build-prod
```
