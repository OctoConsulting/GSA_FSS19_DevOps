import * as cdk from '@aws-cdk/core';
import { BatchJobConstructParms } from '../models/batch-job-constructs';

export class BatchJobConstruct extends cdk.Construct {
    constructor(parent: cdk.Construct, id: string, props: BatchJobConstructParms) {
        super(parent, id);
    }
}
