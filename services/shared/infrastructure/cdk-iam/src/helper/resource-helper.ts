const { AWS_ACCOUNT, AWS_REGION } = process.env;

function getPrefix(resourceName: string) {
    return `arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT}:`;
}

const resourcePrefix = {
    getPrefix,
};

export { resourcePrefix };
