export enum CounterActions {
    COUNTER_DECREASE = '@Counter/CounterDecrease',
    COUNTER_INCREASE = '@Counter/CounterIncrease'
}

export const counterDecrease = () => ({
    type: CounterActions.COUNTER_DECREASE
})

export const counterIncrease = () => ({
    type: CounterActions.COUNTER_INCREASE
})