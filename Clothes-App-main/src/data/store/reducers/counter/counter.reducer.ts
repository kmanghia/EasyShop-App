import { ActionState } from "../../action.state";
import { CounterActions } from "../../actions/counter/counter.action";

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 0
}

const CounterReducer = (state = initialState, actions: ActionState) => {
    switch (actions.type) {
        case CounterActions.COUNTER_DECREASE:
            return {
                ...state,
                count: state.count - 1
            }
        case CounterActions.COUNTER_INCREASE:
            return {
                ...state,
                count: state.count + 1
            }
        default:
            return state;
    }
}

export default CounterReducer;