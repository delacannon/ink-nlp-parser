import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchStory } from "./actions";
import Story from './components/Story'
import { TypographyStyle, GoogleFont } from 'react-typography'
import typography from './utils/typography'


class App extends Component {

  constructor(props){
    super(props) 
  }

  componentDidMount(){
      this.props.fetchStory('./ink/story.ink.json')
  }

  render() {
    return (
       <div>
          <TypographyStyle typography={typography} />
          <GoogleFont typography={typography} />
          {this.props.story!=null && <Story />}
      </div>
    );
  }
}

const mapStateToProps = ({ story }) => ({ story: story.story });
export default connect(mapStateToProps, { fetchStory })(App);
