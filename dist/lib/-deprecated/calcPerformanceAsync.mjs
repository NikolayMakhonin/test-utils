import { __awaiter } from 'tslib';
import { isWin, getThreadPriority, getProcessPriority, setProcessPriority, PROCESS_PRIORITY_REALTIME, setThreadPriority, THREAD_PRIORITY_REALTIME, rdtsc } from 'rdtsc';

function runInRealtimePriorityAsync(func) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isWin) {
            return func();
        }
        const previousThreadPriority = getThreadPriority();
        const previousProcessPriority = getProcessPriority();
        try {
            setProcessPriority(PROCESS_PRIORITY_REALTIME);
            setThreadPriority(THREAD_PRIORITY_REALTIME);
            return yield func();
        }
        finally {
            setProcessPriority(previousProcessPriority);
            setThreadPriority(previousThreadPriority);
        }
    });
}
function calcPerformanceAsync(testTimeMilliseconds, ...funcs) {
    return runInRealtimePriorityAsync(() => __awaiter(this, void 0, void 0, function* () {
        const testTime = testTimeMilliseconds;
        if (!testTime || testTime <= 0) {
            throw new Error(`testTime ${testTime} <= 0`);
        }
        const f = funcs.flatMap(o => {
            if (o == null) {
                return [];
            }
            if (Array.isArray(o)) {
                return o;
            }
            return [o];
        })
            .filter(o => {
            if (typeof o !== 'function') {
                throw new Error(`argument (${o}) is not a function`);
            }
            return true;
        });
        const funcsCount = f.length;
        if (!funcsCount) {
            throw new Error('functions count == 0');
        }
        const endTime = process.hrtime();
        endTime[0] += ~~(testTime / 1000);
        endTime[1] += testTime % 1000;
        let i = 0;
        let count = funcsCount;
        const startCycles = rdtsc();
        const cycles = [];
        do {
            const funcIndex = i % funcsCount;
            const fn = f[funcIndex];
            const cycles0 = rdtsc();
            yield fn();
            const cycles1 = rdtsc();
            const cyclesDiff = cycles1 - cycles0;
            if (i < funcsCount || cyclesDiff < cycles[funcIndex]) {
                cycles[funcIndex] = cyclesDiff;
            }
            i++;
            if (i >= count) {
                const time = process.hrtime(endTime);
                if (time[0] >= 0) {
                    break;
                }
                count = ~~Math.ceil(i * testTime / (testTime + time[0] * 1000 + time[1] / 1000000));
                count = (~~(count / funcsCount)) * funcsCount;
            }
        } while (true);
        const absoluteDiff = funcsCount > 1
            ? cycles.filter((o, i) => i).map(o => Number(o - cycles[0]))
            : void 0;
        const relativeDiff = funcsCount > 2 && absoluteDiff[0] > 0
            ? absoluteDiff.filter((o, i) => i).map(o => o / absoluteDiff[0])
            : void 0;
        return {
            calcInfo: {
                iterationCycles: Number(rdtsc() - startCycles) / i,
                iterations: i,
                funcsCount,
                testTime,
            },
            cycles,
            absoluteDiff,
            relativeDiff,
        };
    }));
}

export { calcPerformanceAsync, runInRealtimePriorityAsync };
