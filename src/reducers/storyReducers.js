import { FETCH_STORY, UPDATE_TEXT, UPDATE_CHOICES, UPDATE_IMAGE, UPDATE_ROOM,CHANGE_DISPLAY,CHANGE_LIGHT} from "../actions/types";

const initialState = {
	story:null,
  choices:[],
  image:[],
	text:[],
  room:'',
  light:false,
  display:false
}

const StoryReducer = (state = initialState, action) => {

  switch (action.type) {
  	case UPDATE_TEXT:
  		return { 
        ...state,
        text: [...state.text, action.payload]
    }
    case UPDATE_IMAGE:{
      return{
        ...state,
        image:[...state.image, action.payload]
      }
    }
    case CHANGE_DISPLAY:{
      return {...state, display:action.payload}
    }
    case CHANGE_LIGHT:{
      return {...state, light:action.payload}
    }
    case UPDATE_ROOM:{
      return {...state, room:action.payload}
    }
    case UPDATE_CHOICES:
      return { choices: action.payload }
    case FETCH_STORY:
        return {...state, story:action.payload}
    default:
      return state;
  }
};


export default StoryReducer;
