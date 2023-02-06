import {TimeControllerMock} from '@flemist/time-controller'

export async function awaitCount(timeControllerMock: TimeControllerMock, count: number) {
  for (let i = 0; i < count; i++) {
    timeControllerMock.addTime(0)
    await Promise.resolve()
  }
}

export async function awaitTime(timeControllerMock: TimeControllerMock, time: number, countPerTime: number) {
  await awaitCount(timeControllerMock, countPerTime)
  for (let i = 0; i < time; i++) {
    timeControllerMock.addTime(1)
    await awaitCount(timeControllerMock, countPerTime)
  }
}
