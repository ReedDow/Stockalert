import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import './contact.scss/contact.css';

class Contact extends Component{
    constructor(props){
        super(props);
        this.state = {
        name: '',
        email: '',
        feedback: ''
        }
    }

    handleSubmit(e){
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      axios({
          method: "POST", 
          url:"http://localhost:3000/send", 
          data: {
              name: name,   
              email: email,  
              messsage: message
          }
      }).then((response)=>{
          if (response.data.msg === 'success'){
              alert("Message Sent."); 
              this.resetForm()
          }else if(response.data.msg === 'fail'){
              alert("Message failed to send.")
          }
      })
  }

    render() {
        return (
          <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
            <div className="form-group">
                <label for="name">Name</label>
                <input type="text" className="form-control" id="name" />
            </div>
            <div className="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" />
            </div>
            <div className="form-group">
                <label for="message">Message</label>
                <textarea className="form-control" rows="5" id="message"></textarea>
            </div>
            <button 
              onClick={this.handleSubmit} 
              className="btn btn-primary">Submit</button>
          </form>

        )
      }
    
    //   handleChange(event) {
    //     this.setState({feedback: event.target.value})
    //   }
    
    //   handleSubmit() {
    //   }
    
}

const mapStateToProps = (reduxState) => reduxState
export default withRouter(connect(mapStateToProps)(Contact));