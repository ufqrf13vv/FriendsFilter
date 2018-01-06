export default function api(method, params) {
    return new Promise( (resolve, reject) => {
        VK.api('friends.get', { fields: 'nickname, photo_100', v: '5.69' }, data => {
            if (data.response) {
                resolve(data.response);
            } else {
                reject(new Error('Не удалось получить список друзей!'))
            }
        })
    });
}