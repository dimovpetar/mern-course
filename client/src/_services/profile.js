export function getProfile (userId) {
    return Promise.resolve({
        username: "User" + Math.random()
    }) 
}