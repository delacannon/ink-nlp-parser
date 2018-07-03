import { combineReducers } from "redux";
import StoryReducer from './storyReducers';

const rootReducer = combineReducers({
  story: StoryReducer,
  text: StoryReducer,
  image: StoryReducer,
  choices: StoryReducer,
  room: StoryReducer
});

export default rootReducer;
