import Promise from '@dojo/shim/Promise';
import { Require } from '@dojo/interfaces/loader';
import { isArray } from 'util';

declare const require: Require;

declare const define: {
	(...args: any[]): any;
	amd: any;
};

export interface NodeRequire {
	(moduleId: string): any;
}

export type Require = Require | NodeRequire;

export interface Load {
	(require: Require, ...moduleIds: string[]): Promise<any[]>;
	(...moduleIds: string[]): Promise<any[]>;
}

export function useDefault(modules: any[]): any[];
export function useDefault(module: any): any;
export function useDefault(modules: any | any[]): any[] | any {
	if (isArray(modules)) {
		return modules.map((module: any) => {
			return (module.__esModule && module.default) ? module.default : module;
		});
	}
	else {
		return (modules.__esModule && modules.default) ? modules.default : modules;
	}
}

const load: Load = (function (): Load {
	if (typeof module === 'object' && typeof module.exports === 'object') {
		return function (contextualRequire: any, ...moduleIds: string[]): Promise<any[]> {
			if (typeof contextualRequire === 'string') {
				moduleIds.unshift(contextualRequire);
				contextualRequire = require;
			}
			return new Promise(function (resolve, reject) {
				try {
					resolve(moduleIds.map(function (moduleId): any {
						return contextualRequire(moduleId);
					}));
				}
				catch (error) {
					reject(error);
				}
			});
		};
	}
	else if (typeof define === 'function' && define.amd) {
		return function (contextualRequire: any, ...moduleIds: string[]): Promise<any[]> {
			if (typeof contextualRequire === 'string') {
				moduleIds.unshift(contextualRequire);
				contextualRequire = require;
			}
			return new Promise(function (resolve) {
				// TODO: Error path once https://github.com/dojo/loader/issues/14 is figured out
				contextualRequire(moduleIds, function (...modules: any[]) {
					resolve(modules);
				});
			});
		};
	}
	else {
		return function () {
			return Promise.reject(new Error('Unknown loader'));
		};
	}
})();
export default load;
