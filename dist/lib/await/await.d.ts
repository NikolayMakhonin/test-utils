import { TimeControllerMock } from '@flemist/time-controller';
export declare function awaitCount(timeControllerMock: TimeControllerMock, count: number): Promise<void>;
export declare function awaitTime(timeControllerMock: TimeControllerMock, time: number, countPerTime: number): Promise<void>;
