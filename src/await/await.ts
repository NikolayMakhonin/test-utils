import {TimeControllerMock} from '@flemist/time-controller'

export async function awaitCount(count: number) {
  for (let i = 0; i < count; i++) {
    await Promise.resolve()
  }
}

export async function awaitTime(timeControllerMock: TimeControllerMock, time: number, countPerTime: number) {
  await awaitCount(countPerTime)
  for (let i = 0; i < time; i++) {
    timeControllerMock.addTime(1)
    await awaitCount(countPerTime)
  }
}
