export type MatchArraySequenceOptions = {
  /** actual may not start with expected */
  actualMayNotStartWith?: boolean
  /** actual may not end with expected */
  actualMayNotEndWith?: boolean
  /** expected may not start with actual */
  expectedMayNotStartWith?: boolean
  /** expected may not end with actual */
  expectedMayNotEndWith?: boolean
  repeats?: boolean
  breaks?: boolean
}
