import React, { Component } from 'react'
import backgroundImage from "./backgroundImage.jpg";
import {MDBJumbotron, MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCardTitle, MDBIcon, MDBInput, MDBView } from "mdbreact";
import axios from 'axios';
import { MDBSpinner } from 'mdb-react-ui-kit';
 
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { url:"" ,
                        inputURLPage:true,
                        retUrl:"",
                        successMessage:"",
                        errorMessage:"",
                        responseUrl:"",
                        inputUrlMsg:"",
                        errorPresent:false,
                        buttonToAPI:false
                    };
    }
    
    validateUrl=(e)=>{
        const url=e.target.value;
        console.log(url)
        var pat=/^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/
        
        if(url==="" || url===null){
            this.setState({errorMessage:"Url should not be blank"})
            console.log("1")
        }else if(!url.match(pat)){
            this.setState({errorMessage:"Please enter a valid url"})
            console.log("2")
        }else{
            this.setState({errorMessage:""})
            console.log("3")
        }   
    }
    handleChange=(e)=>{
        const state=this.state
        const name=e.target.name
        const val=e.target.value
        this.setState({...state,[name]:val})
        this.validateUrl(e)
    }
    getTinyUrl=()=>{
        var formJSON={
            url:this.state.url
        }
        axios.post("http://localhost:8013/api",formJSON).then(
            response=>{
                this.setState({
                 successMessage:response.data.message,retUrl:response.data.url,errorMessage:"",errorPresent:false,
                 buttonToAPI:false  
                })
                //console.log("******"+this.state.retUrl)
            }
        ).catch(
            error=>{
                if(error.response){
                
                    this.setState({
                        errorMessage:error.response.data.message,successMessage:"",inputURLPage:true,errorPresent:true,
                        buttonToAPI:false
                       })
                       console.log(this.state)
                       //alert("Error :"+this.state.errorMessage)
                }else{
                    this.setState({
                        errorMessage:error.message,successMessage:"",inputURLPage:true,errorPresent:true,
                        buttonToAPI:false
                       })
                       //alert("Connection Error: "+this.state.errorMessage)
                }   
            }
        )
        
    }

    getOrigURL=()=>{
        var retUrl=this.state.retUrl
        var s=retUrl.split("/");
        var portno=s[0].split(":")[1]
        
        console.log(s)
        retUrl="http://localhost:"+portno+"/api/"+s[s.length-1]
        axios.get(retUrl).then(
            response=>{
                this.setState({
                 successMessage:response.data.message,responseUrl:response.data.url,errorMessage:"",retUrl:"",errorPresent:false,
                 buttonToAPI:false  
                })
                if(this.state.errorPresent===false){
                    window.open("http://"+this.state.responseUrl, '_blank', 'channelmode=yes,fullscreen=yes');
                }
                //console.log(this.state)
            }
        ).catch(
            error=>{
                if(error.response){
                    this.setState({
                        errorMessage:error.response.data.message,successMessage:"",inputURLPage:true,errorPresent:true,
                        buttonToAPI:false 
                       })
                       console.log(this.state)
                       //alert("Error"+this.state.errorMessage)
                }else{
                    this.setState({
                        errorMessage:error.message,successMessage:"",inputURLPage:true,errorPresent:true,
                        buttonToAPI:false  
                       })
                      // alert("Connection Error")
                }
                
            }

        )
        
    }
    handleSubmit1=(e)=>{
        e.preventDefault();
        const state=this.state;
        //console.log(this.state)
        const {inputURLPage}=this.state;
        if(inputURLPage){
            
            this.setState({...state,inputURLPage:!inputURLPage,buttonToAPI:false})
            this.getTinyUrl()
        }else{
            this.setState({...state,inputURLPage:!inputURLPage,buttonToAPI:false}) 
            
        }
        //console.log(this.state)
        this.setState({ url:""})
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        const state=this.state;
        //console.log(this.state)
        const {inputURLPage}=this.state;
        if(inputURLPage){

            this.setState({...state,inputURLPage:!inputURLPage,buttonToAPI:true})
            this.getTinyUrl()
            
        }else{
            this.setState({...state,inputURLPage:!inputURLPage,buttonToAPI:true}) 
            
        }
        //console.log(this.state)
        this.setState({ url:""})
    }

    handleNewWindow=(e)=>{
        e.preventDefault();
        const state=this.state;
       // console.log(this.state)
        var {inputURLPage}=this.state;
        if(!inputURLPage){
            this.setState({...state,inputURLPage:!inputURLPage})
            this.setState({ url:""})
            this.getOrigURL()
            
        }else{
            this.setState({...state,inputURLPage:!inputURLPage}) 
        }
        console.log(this.state)
    }
 
    render() {
        return (
            <div  style={{
                backgroundColor:'green' ,
                backgroundImage:
                  'url('+backgroundImage+')',
                backgroundSize: "cover",
                height: "100vh"
              }}>

        <MDBContainer style={{width:'100%',height:'100%', padding:'20px'}}>
            <MDBRow>
                <MDBCol>
               
                
                <MDBView hover zoom>
                    <MDBJumbotron style={{ borderLeft:'20px solid blue', padding: '20px' ,backgroundColor:'transparent'}} className="text-black shadow-box-example rounded-square hoverable text-center py-5 px-4 my-5 bg ">
                    <MDBCol className="py-5">
                        <MDBCardTitle className="display-4 pt-3 m-5 font-bold">Make Your Life Happy<MDBIcon  icon="grin-alt"></MDBIcon>! with TinyUrl</MDBCardTitle>
                        <p className="mx-5 mb-5">
                        </p>{!this.state.buttonToAPI ?<> {this.state.inputURLPage?
                        <form noValidate className="form-group">
                        <div className="text-left">
                        <MDBInput 
                            type="text"
                            label="Enter url"
                            rows="2"
                            name="url"
                            icon='pencil-alt'
                            placeholder='ex:-www.manish.com'
                            value={this.state.url}
                            style={{color:'white'}}
                            onChange={this.handleChange.bind(this)}
                        />
                        </div>
                        <p className="red-text">{this.state.errorMessage}</p>
                        <MDBBtn outline color="white" className="mb-5" onClick={this.handleSubmit.bind(this)}><MDBIcon icon="clone" className="mr-2"></MDBIcon>Get Tiny URL</MDBBtn>
                    </form>
                        : <form noValidate className="form-group">
                        <div className="text-left">
                        <MDBInput 
                            type="textarea"
                            label="Returned url"
                            rows="2"
                            name="retUrl"
                            value={this.state.retUrl}
                            style={{color:'white'}}
                            onChange={this.handleChange.bind(this)}
                        />
                        </div>
                        <MDBBtn outline color="white" className="mb-5" onClick={this.handleSubmit1.bind(this)}><MDBIcon icon="clone" className="mr-2"></MDBIcon>Enter new URL</MDBBtn>
                        <MDBBtn outline color="white" className="mb-5" onClick={this.handleNewWindow.bind(this)}><MDBIcon icon="clone" className="mr-2"></MDBIcon>Open browser with TinyUrl</MDBBtn>
                    </form>}</>:<MDBSpinner />}            
                    
                    </MDBCol>
                    </MDBJumbotron>
                   
                </MDBView>           
                
                </MDBCol>
            </MDBRow>
        </MDBContainer>
            </div>
        );
    }
}

export default Home;