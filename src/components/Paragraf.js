import React, { Component } from 'react'
import { connect } from "react-redux"

import { updateText } from "../actions";
import './Paragraf.css'


class Paragraf extends Component {
 	
constructor(props){
  	super(props)
    this.state = { 
      enabled:false,
      type:''
    }
}

componentDidMount(){

  while(this.props.story.canContinue){
    this.props.updateText(this.props.story.Continue())
  }

  if(this.props.ptext.charAt(0) == ">"){
    this.setState({
      type:'Paragrafe'
    })
  }else{
    this.setState({
      type:'Paragraf'
    })
  }

}

render() {

    return (
      <div>
      {this.props.ptext.charAt(0)=="/" &&
        <div style={{background:'black'}}>
          <img src={this.props.ptext} height='250px' style={{display:'block',margin:'auto'}}/>
        </div>
      }
      { this.props.ptext.charAt(0)!="/" &&
        <div className={this.state.type}>
            {this.props.ptext}
        </div>
      }
      </div>
    );
  }

}

const mapStateToProps = ({ story, text }) => ({ story: story.story, text: text.text});

export default connect(mapStateToProps, {updateText})(Paragraf);
