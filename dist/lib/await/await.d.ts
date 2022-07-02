import { TimeControllerMock } from '@flemist/time-controller';
export declare function awaitCount(count: number): Promise<void>;
export declare function awaitTime(timeControllerMock: TimeControllerMock, time: number, countPerTime: number): Promise<void>;
