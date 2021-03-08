import { getNsn } from './processor/nsn-routing-get-processor';
import { postNsn } from './processor/nsn-routing-create-processor';
import { deleteNsn } from './processor/nsn-routing-delete-processor';
import { putNsn } from './processor/nsn-routing-update-processor';

module.exports = {
    getNsn,
    postNsn,
    deleteNsn,
    putNsn,
};
