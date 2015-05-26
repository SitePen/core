import Promise from '../../Promise';
import { Source } from '../ReadableStream';
import ReadableStreamController from '../ReadableStreamController';
import { Readable } from 'stream';

export type NodeSourceType = Buffer | string;

export default class ReadableNodeStreamSource implements Source<NodeSourceType> {
	protected _controller: ReadableStreamController<NodeSourceType>;
	protected _isClosed: boolean;
	protected _onClose: () => void;
	protected _onError: (error: Error) => void;
	protected _nodeStream: Readable;

	constructor(nodeStream: Readable) {;
		this._isClosed = false;
		this._nodeStream = nodeStream;
	}

	// Perform internal close logic
	protected _close(): void {
		this._isClosed = true;
		this._removeListeners();
		this._nodeStream.unpipe();
	}

	// Handle external request to close
	protected _handleClose(): void {
		this._close();
		this._controller.close();
	}

	protected _handleError(error: Error): void {
		this._close();
		this._controller.error(error);
	}

	protected _removeListeners(): void {
		this._nodeStream.removeListener('close', this._onClose);
		this._nodeStream.removeListener('end', this._onClose);
		this._nodeStream.removeListener('error', this._onError);
	}

	cancel(reason?: any): Promise<void> {
		this._handleClose();

		return Promise.resolve();
	}

	pull(controller: ReadableStreamController<NodeSourceType>): Promise<void> {
		if (this._isClosed) {
			return Promise.reject(new Error('Stream is closed'));
		}

		this._nodeStream.pause();

		const chunk = this._nodeStream.read();

		if (chunk === null) {
			this._handleClose();
		}
		else {
			controller.enqueue(chunk);
		}

		this._nodeStream.resume();

		return Promise.resolve();
	}

	start(controller: ReadableStreamController<NodeSourceType>): Promise<void> {
		this._controller = controller;
		this._onClose = this._handleClose.bind(this);
		this._onError = this._handleError.bind(this);

		this._nodeStream.on('close', this._onClose);
		this._nodeStream.on('end', this._onClose);
		this._nodeStream.on('error', this._onError);

		return Promise.resolve();
	}
}
