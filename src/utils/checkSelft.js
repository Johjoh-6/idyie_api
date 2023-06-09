/**
 * Compare the id user and the id_user of the object
 * Usefull for check if the user is the owner of the object
 * @param {request} request request from the controller
 * @param {number} id id of the user of the object
 * @param {boolean} allowModrator is the user an admin
 * @returns {boolean} 
 */
const checkSelf = (request, id, allowModrator = false) => {
    const { idUser, isAdmin, isModerator } = request.user;
    if (isAdmin || (isModerator && allowModrator)) return true;
    return idUser === id;
}

module.exports = checkSelf