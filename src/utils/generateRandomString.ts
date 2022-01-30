const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const getRandomString = length => {
    let result = '';
    while (result.length < length) {
        result += randomChars[Math.floor(Math.random() * randomChars.length)];
    }
    return result;
}
