import {
  combineReducers
} from 'redux';
import customer from './customer';
import collaborator from './collaborator';


const rootReducer = combineReducers({
  customer,
  collaborator
});
export default rootReducer