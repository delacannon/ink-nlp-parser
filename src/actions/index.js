
import { Story } from 'inkjs'
import { FETCH_STORY, UPDATE_TEXT, UPDATE_CHOICES, UPDATE_IMAGE, UPDATE_ROOM } from './types'

export const fetchStory = (storyData) => dispatch => {
	
	fetch(storyData)
		.then( result => result.text())
		.then( data => {
			const story = new Story(data)
			dispatch({
				type: FETCH_STORY,
				payload: story
			})
		})

}

export const updateRoom = (room) => dispatch => {

	dispatch({
		type:UPDATE_ROOM,
		payload: room
	})

}

export const updateImage = (newImg) => dispatch => {

	dispatch({
		type: UPDATE_IMAGE,
		payload: newImg
	})

}

export const updateText = (newText) => dispatch => {
	//if(newText.length>0){
		dispatch({
			type: UPDATE_TEXT,
			payload: newText
		})
	//}
}

export const updateChoices = (choices) => dispatch => {

	dispatch({
		type: UPDATE_CHOICES,
		payload: choices
	})

}
