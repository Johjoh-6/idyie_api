/**
 * Compare the id user and the id_user of the object
 * Usefull for check if the user is the owner of the object
 * @param {request} request request from the controller
 * @param {number} id id of the user of the object
 * @param {boolean} allowModerator allow moderator to pass the check
 * @returns {boolean}
 */
const checkSelf = (request, id, allowModerator = false) => {
	const { userId, isAdmin, isModerator } = request;
	if (isAdmin || (isModerator && allowModerator)) return true;
	return userId === id;
};

module.exports = checkSelf;
