import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { createLogger } from "redux-logger";

const logger = createLogger({ collapsed: true });

export default createStore(rootReducer, applyMiddleware(thunk, logger));
