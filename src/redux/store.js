import { reducer } from "./reducer";
import { AppState } from "./appState";
import { createStore  } from "redux";

export const store = createStore(reducer, new AppState());
