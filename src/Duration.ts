var unitValues = [1, 1000, 60000, 3600000, 86400000];

export default class Duration {
	public static SECOND = unitValues[1];
	public static MINUTE = unitValues[2];
	public static HOUR = unitValues[3];
	public static DAY = unitValues[4];

	public time: number = 0;

	constructor(... rest: number[]) {
		var time = 0;
		for (var i = 0; i < rest.length; i++) {
			time += rest[i] * unitValues[i];
		}
		this.time = time;
	}

	get milliseconds(): number {
		return this.time % Duration.SECOND;
	}

	get seconds(): number {
		return Math.floor(this.time % Duration.MINUTE / Duration.SECOND);
	}

	get minutes(): number {
		return Math.floor(this.time % Duration.HOUR / Duration.MINUTE);
	}

	get hours(): number {
		return Math.floor(this.time % Duration.DAY / Duration.HOUR);
	}

	get days(): number {
		return Math.floor(this.time / Duration.DAY);
	}
}
