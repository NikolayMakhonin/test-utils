export declare function runInRealtimePriorityAsync<T>(func: () => Promise<T> | T): Promise<T>;
export declare function calcPerformanceAsync(testTimeMilliseconds: any, ...funcs: (() => any)[]): Promise<{
    calcInfo: {
        iterationCycles: number;
        iterations: number;
        funcsCount: number;
        testTime: any;
    };
    cycles: bigint[];
    absoluteDiff: number[];
    relativeDiff: number[];
}>;
