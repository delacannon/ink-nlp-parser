import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateText, updateRoom } from '../actions'
import JaroWinkler from 'jaro-winkler'
import nlp from 'compromise'
import Autosuggest from 'react-autosuggest'
import _ from 'lodash'
import * as Scroll from 'react-scroll';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

const verbs_default = [
  {name: 'ask', default:'',pass:false},
  {name: 'move', default:'',pass:false},
  {name: 'touch', default:'',pass:false},
  {name: 'attack', default:'',pass:false},
  {name: 'turn', default:'',pass:false},
  {name: 'cut', default:'',pass:false},
  {name: 'put', default:'',pass:false},
  {name: 'climb', default:'',pass:false},
  {name: 'push', default:'',pass:false},
  {name: 'drop', default:'',pass:false},
  {name: 'look', default:'',pass:false},
  {name: 'read', default:'',pass:false},
  {name: 'open', default:'',pass:false},
  {name: 'say', default: '',pass:true},
  {name: 'wait', default:`Time passes.`,pass:false},
  {name: 'answer', default:'',pass:false},
  {name: 'turn on', default:'',pass:false},
  {name: 'turn off', default:'',pass:false},
  {name: 'wear', default:'',pass:false},
  {name: 'smell', default:`You smells the scent of the rain.`,pass:false},
  {name: 'show', default:'',pass:false},
  {name: 'tell', default:'',pass:false},
  {name: 'give', default:'',pass:false},
  {name: 'unwear',default:''},
  {name: 'take', default:'',pass:false},
  {name: 'examine', default:'',pass:false},
  {name: 'east',default:'',pass:false},
  {name: 'west',default:'',pass:false},
  {name: 'north',default:'',pass:false},
  {name: 'south',default:'',pass:false},
  {name: 'talk', default:`There is nobody around to talk with.`,pass:false},
  {name: 'execute', default:'',pass:false},
  {name: 'get', default:'',pass:false},
  {name: 'go', default:'',pass:false},
  {name: 'jump', default:`You jump on the spot, fuitlessly.`,pass:false},
  {name: 'sing', default:`🎶 La La La!`,pass:false}
];


const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : verbs_default.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);


class Cursor extends Component {
 	
constructor(props){
  	super(props)

    this.state = {
      value: '',
      suggestions: []
    };

    this.nameInput = '';

}

uniqeObjects = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
}

getWordsFromRooom(list,noun){
  let arr = []
  let obj = []

  _.mapValues(list,(e) => {
      arr.push(e.name.split("_"))
  })

  arr.forEach((m) =>{
      var o = null
      if(noun === false){
          o = nlp(m).verbs().out('normal').trim().replace(/ /g,',')
      }else{
          o = nlp(m).nouns().out('normal').trim().replace(/ /g,',')
      }
      if(o != ""){
          obj.push(o.split(","));
      }
  })

  return this.uniqeObjects(_.flatten(obj))
}

processDirection(str){

  let _dir = str.match('(north|south|east|west|exits)');
  return _dir;

}

scrollToBottom = () =>  {
    scroll.scrollToBottom({isDynamic:true,offset:100});
}


analizeText(event){


  if (event.key === 'Enter' && event.target.value.length>0) {
    
    this.props.updateText(`> ${event.target.value}`);

    let container = this.props.story.state.outputStream[0].parent.name,
        parentList = this.props.story.state.outputStream[0].parent.namedContent,
        getObjs = this.props.story.mainContentContainer.namedContent,
        phrase = event.target.value.replace(/ /g,'_'),
        other = {
        'open':'Verb'
        };
    let text = nlp(event.target.value,other).sentences(),
        terms = [...text.list[0].terms];

    let room_objects = this.getWordsFromRooom(parentList,true),
        room_verbs = this.getWordsFromRooom(parentList,false);

      //Global objects 
      let obj = [], get_key = _.keys(getObjs), daobject = null
      console.log(terms)
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

      let direction = this.processDirection(phrase)
  
      let keys = _.keys(parentList), actions = [];

      keys.forEach( k => {
        actions.push(k.replace(/_/g,',').split(","))
      })
      
      var destiny = null

      actions.forEach( (a,i) =>{
            if(_.intersection(a,phrase.split("_")).length>1){
              destiny = a.join("_")
            }
      })

    if(direction !== null){

      let input = nlp(direction.input.replace(/_/g,' ')).verbs().toInfinitive().out()

       if(input.length===0){

        this.props.story.ChoosePathString(`${container}.${direction[0]}`)
        this.props.updateText(this.props.story.Continue())

       }
       else if(input=='go'||input=='move'){
         this.props.story.ChoosePathString(`${container}.${direction[0]}`)
        this.props.updateText(this.props.story.Continue())
      }
      else{
        direction = null;
      }
       
    }

    else if(terms[0].tags.Verb && !daobject && terms.length>1 && destiny && direction === null){


        this.props.story.ChoosePathString(`${container}.${destiny}`)
        this.props.updateText(this.props.story.Continue())
       
    
      actions.forEach( action => {
     

        if(_.isEqual(action.join("_"),phrase) && !destiny && direction===null){
            
            this.props.story.ChoosePathString(`${container}.${action.join("_")}`)
            this.props.updateText(this.props.story.Continue())
        
        }
        else if(JaroWinkler(action.join("_"),phrase,false)>0.925 && !destiny){     

          this.props.updateText(`You mean ${action.join(",").replace(","," ")}?`)
        
        }

      })

    }
    else if(terms[0].tags.Adjective){
        
        let str = ''
        
        verbs_default.forEach( (v) => {
  
          if(_.isEqual(v.name,terms[0].normal)){
              if(v.default != ''){
                str = v.pass ? `${v.default}` : v.default
              }
          }
        })

        this.props.updateText(str);

    }
    else if(!terms[0].tags.Verb && !daobject && direction === null){

      this.props.updateText("That's not a verb I recognise.");
    
    }
    else if(terms[0].tags.Verb && terms.length==1 && !daobject && direction === null){

      let doc = nlp(terms[0].normal),
          verb_list = doc.verbs().conjugate()[0],
          infinitive = verb_list["Infinitive"],
          str = '';

      verbs_default.forEach( (v) => {
        
          if(_.isEqual(v.name,terms[0].normal)){
              console.log(v)
              if(v.default != ''){
                str = v.default
              }else{
                str = `What do you want to ${terms[0].normal}?`
              }
          }
        
        })
     
      this.props.updateText(str)
     
    }
    
    else if(terms[0].tags.Verb && terms.length>1 && !daobject && !destiny && direction === null){

          var _words = {verbs:[],nouns:[],adjectives:[]}

          terms.forEach( (t) => {
            if(t.tags.Verb){
              _words.verbs.push(t)
            }else if(t.tags.Noun){
              _words.nouns.push(t)
            }else if(t.tags.Adjective){
              _words.adjectives.push(t)
            }
          })

      let str = '', guess_word = '';
        
      if(_words.nouns.length>0){

        room_objects.forEach( ro => {
          if(JaroWinkler(ro,_words.nouns[0].normal,false)>0.90){
            guess_word = ro;
          }
        })

        if(_.indexOf(room_objects,_words.nouns[0].normal)!=-1){
          str = `You can't ${_words.verbs[0].normal} the ${_words.nouns[0].normal}.`
        }else if(guess_word==''){
          str = `You can't see ${_words.nouns[0].tags.Plural ? 'any' : 
          `${_words.nouns[0].normal.charAt(0).match(/[aeiou]/ig)!=null ? 'an' : 'a'}`} 
           ${_words.nouns[0].normal} in the ${_.startCase(container.replace(/_/g,' '))}`
        }else if(guess_word!=''){
          str= `May be you want ${_words.verbs[0].normal} the ${guess_word}?`
       }
      }else{
        str=`What do you mean?`
      }

       this.props.updateText(str);
    }

     if(daobject && !destiny && direction === null){

       this.props.story.ChoosePathString(`${daobject}`)
       this.props.updateText(this.props.story.Continue())

    }
  }
    this.scrollToBottom();
}

 onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };


componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
}

componentDidMount(){

  this.theme = {
      suggestion: {
        listStyleType:'none',
        border:'1px solid #f0f0f0',
        padding:'0.2em',
        fontSize:'1em',
        fontStyle:'italic'
      },
      suggestionHighlighted:{
        backgroundColor:'#f0f0f0'
      }
  }

  this.input.focus();

  let container = this.props.story.state.outputStream[0].parent.name;
  this.props.updateRoom(`${_.startCase(container.replace(/_/g,' '))}`);

}

componentDidUpdate() {
  this.scrollToBottom();
}

render() {
    
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: '> Enter text',
      value,
      style:{backgrounColor:'transparent', border:'none',borderBottom:'1px solid #ccc',color:'#555',
      boxSizing:'border-box',height:'50px',width:'100%',padding:'10px 0px',outilne:'none'
      },
      onChange: this.onChange,
      onKeyPress:(e) => this.analizeText(e)
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        theme={this.theme}
        ref={this.storeInputReference}
      />
    );
    
  }

}

const mapStateToProps = ({ story, text }) => ({ story: story.story, text: text.text });

export default  connect(mapStateToProps,{updateText,updateRoom})(Cursor);
