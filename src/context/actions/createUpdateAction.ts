// createUpdateAction.ts
import { Dispatch } from "react";
import _ from "lodash"; // use deep comparison
import { State, Action } from "../../utils/types";

export const createUpdateAction = <T>(type: string, getCurrent: (state: State) => T) => {
  return (dispatch: Dispatch<Action>, getState: () => State) => {
    return async (value: T) => {
      const currentValue = getCurrent(getState());

      if (_.isEqual(currentValue, value)) {
        console.log(`[createUpdateAction] ${type} skipped — values are equal.`);
        return;
      }

      try {
        console.log(`[createUpdateAction] ${type} dispatching...`);
        dispatch({ type, payload: value });
      } catch (e) {
        console.log(`AppContext::${type}:`, e);
        dispatch({
          type: "update_popup_text",
          payload: { apiError: `Error with action ${type}` },
        });
      }
    };
  };
};
