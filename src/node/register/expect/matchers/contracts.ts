import {MatcherContext} from 'expect'

export type CustomMatch = <Context extends MatcherContext = MatcherContext>(
  this: Context,
  received: unknown
) => {
  pass: boolean,
  message: string | (() => string)
}

