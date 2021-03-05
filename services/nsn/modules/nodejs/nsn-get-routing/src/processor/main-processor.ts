import { MainRequest } from '../model/main-request';

function start(request: MainRequest) {
    return new Promise((resolve, reject) => {
        if (request.body == 'Good') {
            resolve('Sucesss');
        } else {
            reject('Failed');
        }
    });
}
const mainProcessor = { start };

export { mainProcessor };
