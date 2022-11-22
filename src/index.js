import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./container/App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { PersistGate } from "redux-persist/integration/react";
import reducers from "./redux/reducers/rootReducer";
import rootSaga from "./redux/sagas/rootSaga";
import "bootstrap/dist/css/bootstrap.min.css";
import "@iconscout/react-unicons";
import { persistStore } from "redux-persist";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware));

export const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
