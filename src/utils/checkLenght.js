/**
 *
 * @param {string} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean} return false if the value is not between min and max
 */
const checkLenght = (value, min, max) => {
	if (value.length < min || value.length > max) {
		return false;
	}
	return true;
};

module.exports = checkLenght;
