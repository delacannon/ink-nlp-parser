import React, { Component } from 'react'
import { connect } from "react-redux"
import { updateText, updateChoices } from "../actions"
import { Grid, Row, Col } from 'react-flexbox-grid'
import nlp from 'compromise'
import * as Scroll from 'react-scroll'
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import _ from 'lodash'

import Paragraf from './Paragraf'
import Choice from './Choices'
import Cursor from './Cursor'

import './Buttons.css'

class Story extends Component {
 	
constructor(props){
  	super(props)
}

componentDidMount(){
  
  this.props.updateText(this.props.story.Continue())  

}

scrollToBottom(){
    scroll.scrollToBottom({isDynamic:true});
}

renderChoices(){

  let {currentChoices} = this.props.story

  return currentChoices
      .map( choice => {
       return  (
          <div key={choice.index} style={{marginTop:'0.5em'}}>
            <Choice {...choice} />
          </div> 
          )
      })

}

getTags(){

  let {currentTags} = this.props.story
  
  if(currentTags[0] === "parser"){
    return (
       <div key={Math.floor(Math.random()*9999)} style={{marginTop:'0.5em', display:'block'}}>
          <Cursor />
       </div>
      )
   }
}

renderParagrafs(){

let {text} = this.props
return text
      .map( txt => {
        if(txt.length>0){
       return  (   
          <div key={Math.random()*99999} style={{marginTop:'0.5em', display:'block'}}>
            <Paragraf ptext={txt}/>
          </div> 
          )
      }
    })
}

getObjectFromRoom(list){

  let arr = [], obj = []

  _.mapValues(list,(e) => {
      arr.push(e.name.split("_"))
  })

  arr.forEach((m) =>{
      var o = nlp(m).nouns().out('normal').trim().replace(/ /g,',')
        if(o != ""){
            obj.push(o.split(","));
        }
  })

  return this.uniqeObjects(_.flatten(obj))

}


uniqeObjects = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
}

clickInventoryItems(e){


    let container = this.props.story.state.outputStream[0].parent.name,
        parentList = this.props.story.state.outputStream[0].parent.namedContent,
        getObjs = this.props.story.mainContentContainer.namedContent,
        phrase = `examine_${e.target.innerHTML.replace(" ","_")}`;

    
    let text = nlp(`examine ${e.target.innerHTML}`).sentences(),
        terms = [...text.list[0].terms]


    let room_objects = this.getObjectFromRoom(parentList);

      //Global objects 
      let obj = [], get_key = _.keys(getObjs), daobject = null
  
      get_key.forEach((k) => {
         obj.push(k.replace(/_/g,',').split(","))
      })

      obj.forEach( (a,i) =>{

          let _terms = []
          terms.forEach( (t) => {
            if(t.tags.Verb || t.tags.Noun || t.tags.Adjective){
              _terms.push(t)
            }
          })

          if(_.intersection(a,phrase.split("_")).length>Math.floor(_terms.length-1)){

            if(terms[0].tags.Verb && terms.length>1){
              daobject = a.join("_")
            }
          
          }
      })
  
  this.props.updateText(`> examine ${e.target.innerHTML}`)
  this.props.story.ChoosePathString(`${daobject}`)
  this.props.updateText(this.props.story.Continue())
  this.scrollToBottom()

}

getInventoryItems(){

 let listData = this.props.story.variablesState.$("currentInventory")._keys,
      items = _.values(listData)
 
 return items.map( item =>  {
      return (
      <a className="Button" key={item.itemName}>
        <span className="away">{item.itemName.replace(/_/g,' ')}</span>
        <span className="over" onClick={(e) => this.clickInventoryItems(e)}>{item.itemName.replace(/_/g,' ')}</span>
      </a>
        )
  })

}



getStoryMap(){ }

render() {

 
  
    return (

      <Grid> 
          <Row style={{borderBottom:'1px #eee solid', background:'#555' }}>
            <Col xs={12}>
              <Row center="xs">
                <h2 style={{color:'white', padding:'0.5em'}}>Cloak of Darkness<br/>
                <small style={{fontSize:'0.6em'}}><i>Ink parser test</i></small></h2>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={8} style={{paddingTop:'1em'}}>
              <div style={{background:'white'}}>
                <div style={{position: '-webkit-sticky',position:'sticky',top: 0, background:'white'}}>
              <h3 style={{textAlign:'center',background:'white',color:'black',padding:'1em'}}>
              {this.props.room}
              </h3>
              <hr/>
              </div>
                <div>
                {this.renderParagrafs()}
                {this.getTags()}
                {this.renderChoices()}
                <div style={{ float:"left", clear: "both" }} ref={(el) => {this.bottomElement = el }}></div>
                </div>
              </div>
            </Col>
             <Col xs={4} style={{paddingTop:'1em'}} >
                <div style={{position: '-webkit-sticky',position:'sticky',top: 0}}>
                <div>
                  <h3  style={{textAlign:'center',background:'white',color:'black',padding:'1em'}}>Inventory</h3>
                  <hr/>
                  {this.props.room != '' && this.getInventoryItems()}
                </div>
                <div>
                  <h3>Score: {this.props.story.variablesState.$("score")}</h3>
                  <hr/>
                  {this.getStoryMap()}
                </div>
                </div>
              </Col>
          </Row>          
      </Grid>
    );
  }

}

const mapStateToProps = ({ story, text, choices, image, room }) => ({ 
      story: story.story, 
      text:text.text, 
      room:room.room,
      choices:choices.choices 
    });

export default connect(mapStateToProps, {updateText, updateChoices})(Story);
