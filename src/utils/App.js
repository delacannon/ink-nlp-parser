import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import nlp from 'compromise'
import Story from ''

class App extends Component {

  constructor(props){

    super(props)
    
    this.state = { 
      output:'dog' 
    };

  }

  nlpTest(event){
    
   var output = nlp(event.target.value).nouns().out();

   // drop item 
   // get verbs var output = nlp(event.target.value).verbs().out('normal')
   // objects in room.
   // Every time it visits a new 
   
   //React vampire game - Your name inventory. Add to inventory.
   //Map. Vida. Turnos. Get elements. And enjoy

   //var output = nlp(event.target.value).verbs().out('normal')
   
   //Instead of showing options < - > Move by parser using nlp ->
   //Trying to make a request.

   //RayuelaJam testing a parser with ink 

   this.setState({
    output
   })

  }

  render() {
    return (
      <div className="App">
        <input type="text" onChange={ (e) => {this.nlpTest(e) } } />
        <p>{this.state.output}</p>
      </div>
    );
  }
}

export default App;
