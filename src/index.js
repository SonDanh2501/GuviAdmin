import "@iconscout/react-unicons";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { memo } from "react";
// import ReactDOM from "react-dom";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { applyMiddleware, createStore } from "redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createSagaMiddleware from "redux-saga";
import LoadingPage from "./components/LoadingPage";
import App from "./container/App";
import "./index.scss";
import "./styles/rootStyles.scss";
import reducers from "./redux/reducers/rootReducer";
import rootSaga from "./redux/sagas/rootSaga";
import { loadingSelector } from "./redux/selectors/loading";
import { createRoot } from "react-dom/client";

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(reducers, applyMiddleware(sagaMiddleware));

export const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

const AppLoading = memo(() => {
  const loading = useSelector(loadingSelector);
  return <LoadingPage loading={loading} />;
});
const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App />
        <ToastContainer autoClose={3000} />
        <AppLoading />
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // document.getElementById("root")
);
