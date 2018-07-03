import React, { Component } from 'react';
import { connect } from "react-redux";
import { updateText, updateChoices } from "../actions";

import './Choice.css';

class Choice extends Component {
 	
constructor(props){
  	super(props)
}

clickChoice(el,e) {

  this.props.story.ChooseChoiceIndex(e)
  this.props.updateText(this.props.story.Continue())

}

render() {

    return (
      <div className='Choice' onClick={(el,e) => this.clickChoice(el,this.props.index)}>
          {this.props.text}
      </div>
    ); 
  }
}

const mapStateToProps = ({ story }) => ({ story: story.story });

export default  connect(mapStateToProps,{updateText})(Choice);
