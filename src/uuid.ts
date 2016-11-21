// implementation of v4 UUID from https://github.com/kitsonk/hokan/blob/master/util/main.js

/**
 * Returns a v4 compliant UUID.
 *
 * @returns {string}
 */
export default function uuid(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
