import { duplicate } from './lang';

/**
 * Object with string keys and string or string array values that describes a query string.
 */
type ParamList = { [key: string]: string | string[] };

/**
 * Parses a query string, returning a ParamList object.
 */
function parseQueryString(input: string): ParamList {
	const query = <{ [key: string]: string[] }> {};
	for (const entry of input.split('&')) {
		let [ key, value ] = entry.split('=');
		key = key ? decodeURIComponent(key) : '';
		value = value ? decodeURIComponent(value) : '';

		if (key in query) {
			query[key].push(value);
		}
		else {
			query[key] = [ value ];
		}
	}
	return query;
}

/**
 * Represents a set of URL query search parameters.
 */
export default class UrlSearchParams {
	/**
	 * Constructs a new UrlSearchParams from a query string, an object of parameters and values, or another
	 * UrlSearchParams.
	 */
	constructor(input?: string | ParamList | UrlSearchParams) {
		let list: ParamList;

		if (input instanceof UrlSearchParams) {
			// Copy the incoming UrlSearchParam's internal list
			list = <ParamList> duplicate(input._list);
		}
		else if (typeof input === 'object') {
			// Copy the incoming object, assuming its property values are either arrays or strings
			list = {};
			for (const key in input) {
				const value = (<ParamList> input)[key];

				if (Array.isArray(value)) {
					list[key] = value.length ? value.slice() : [ '' ];
				}
				else if (value == null) {
					list[key] = [ '' ];
				}
				else {
					list[key] = [ <string> value ];
				}
			}
		}
		else if (typeof input === 'string') {
			// Parse the incoming string as a query string
			list = parseQueryString(input);
		}
		else {
			list = {};
		}

		Object.defineProperty(this, '_list', { value: list });
	}

	/**
	 * Maps property keys to arrays of values. The value for any property that has been set will be an array containing
	 * at least one item. Properties that have been deleted will have a value of 'undefined'.
	 */
	protected _list: { [key: string]: string[] };

	/**
	 * Appends a new value to the set of values for a key.
	 */
	append(key: string, value: string): void {
		if (!this.has(key)) {
			this.set(key, value);
		}
		else {
			this._list[key].push(value);
		}
	}

	/**
	 * Deletes all values for a key.
	 */
	delete(key: string): void {
		this._list[key] = undefined;
	}

	/**
	 * Returns the first value associated with a key.
	 */
	get(key: string): string {
		if (!this.has(key)) {
			return null;
		}
		return this._list[key][0];
	}

	/**
	 * Returns all the values associated with a key.
	 */
	getAll(key: string): string[] {
		if (!this.has(key)) {
			return null;
		}
		return this._list[key];
	}

	/**
	 * Returns true if a key has been set to any value, false otherwise.
	 */
	has(key: string): boolean {
		return Array.isArray(this._list[key]);
	}

	/**
	 * Sets the value associated with a key.
	 */
	set(key: string, value: string): void {
		this._list[key] = [ value ];
	}

	/**
	 * Returns this objects data as an encoded query string.
	 */
	toString(): string {
		const query = <string[]> [];

		for (const key in this._list) {
			if (!this.has(key)) {
				continue;
			}

			const values = this._list[key];
			const encodedKey = encodeURIComponent(key);
			for (const value of values) {
				query.push(encodedKey + (value ? ('=' + encodeURIComponent(value)) : ''));
			}
		}

		return query.join('&');
	}
}
