import { Handle } from './interfaces';
import { QueueItem, queueTask } from './queue';

function getQueueHandle(item: QueueItem): Handle {
	return {
		destroy: function () {
			this.destroy = function () {};
			item.isActive = false;
			item.callback = null;
		}
	};
}

export interface KwArgs {
	deferWhileProcessing?: boolean;
	queueFunction?: (callback: (...args: any[]) => any) => Handle;
}

export default class Scheduler {
	protected _boundDispatch: () => void;
	protected _deferred: QueueItem[];
	protected _isProcessing: boolean;
	protected _queue: QueueItem[];
	protected _task: Handle;

	/**
	 * Determines whether any callbacks registered during should be added to the current batch (`false`)
	 * or deferred until the next batch (`true`, default).
	 */
	deferWhileProcessing: boolean;

	/**
	 * Allows users to specify the function that should be used to schedule callbacks.
	 * If no function is provided, then `queueTask` will be used.
	 */
	queueFunction: (callback: (...args: any[]) => any) => Handle;

	protected _defer(item: QueueItem): Handle {
		if (!this._deferred) {
			this._deferred = [];
		}

		this._deferred.push(item);

		return getQueueHandle(item);
	}

	protected _dispatch(): void {
		this._isProcessing = true;
		this._task.destroy();
		this._task = null;

		const queue = this._queue;
		let item: QueueItem;

		while (item = queue.shift()) {
			if (item.isActive) {
				item.callback();
			}
		}

		this._isProcessing = false;

		let deferred: QueueItem[] = this._deferred;
		if (deferred && deferred.length) {
			this._deferred = null;

			let item: QueueItem;
			while (item = deferred.shift()) {
				this._enqueue(item);
			}
		}
	}

	protected _enqueue(item: QueueItem): void {
		if (!this._task) {
			this._task = this.queueFunction(this._boundDispatch);
		}

		this._queue.push(item);
	}

	protected _schedule(item: QueueItem): Handle {
		if (this._isProcessing && this.deferWhileProcessing) {
			return this._defer(item);
		}

		this._enqueue(item);

		return getQueueHandle(item);
	}

	constructor(kwArgs?: KwArgs) {
		this.deferWhileProcessing = (kwArgs && 'deferWhileProcessing' in kwArgs) ? kwArgs.deferWhileProcessing : true;
		this.queueFunction = (kwArgs && kwArgs.queueFunction) ? kwArgs.queueFunction : queueTask;

		this._boundDispatch = this._dispatch.bind(this);
		this._isProcessing = false;
		this._queue = [];
	}

	schedule(callback: (...args: any[]) => void): Handle {
		return this._schedule({
			isActive: true,
			callback: <(...args: any[]) => void> callback
		});
	}
}
