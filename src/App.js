import {Table, Grid, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import './css/bootstrap.min.css';
//import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import contract from './contract'
import logo from './images/ekyc.jpg';
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'

class App extends Component {
 
    state = {

      ipfsHash:null,
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      home:1,
      txReceipt: '' ,
      name:'',
      email:'',
      contact: null  
    };
   
    create = async (event) => {
        event.preventDefault();
       const accounts = await web3.eth.getAccounts();
      this.setState({message1: 'Done'});

      try {
      await contract.methods.addclient(this.state.name,this.state.email,this.state.contact).send(
        {from : accounts[0]}
      );
    }catch(err){}
    }


    captureFile =(event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };

    onClick = async () => {

    try{
        this.setState({blockNumber:"waiting.."});
        this.setState({gasUsed:"waiting..."});

        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
          console.log(err,txReceipt);
          this.setState({txReceipt});
        }); //await for getTransactionReceipt

        await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
      } //try
    catch(error){
        console.log(error);
      } //catch
  } //onClick

    onSubmit = async (event) => {
      event.preventDefault();

      //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
     
      console.log('Sending from Metamask account: ' + accounts[0]);

      //obtain contract address from storehash.js
      const ethAddress= await contract.options.address;
      this.setState({ethAddress});

      //save document to IPFS,return its hash#, and set hash# to state
      //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
      await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ ipfsHash:ipfsHash[0].hash });

        // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
        //return the transaction hash from the ethereum contract
        //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
        
        contract.methods.sendHash(this.state.ipfsHash).send({
          from: accounts[0] 
        }, (error, transactionHash) => {
          console.log(transactionHash);
          this.setState({transactionHash});
        }); //storehash 
      }) //await ipfs.add 
    }; //onSubmit 

  change2 = () => {
      this.setState({home:2});
  }

  change7 = () => {
      this.setState({home:1});
  }

  change3 = () => {
      this.setState({home:3});
  }

  change4 = () => {
      this.setState({home:4});
  }

  change5 = () => {
      this.setState({home:5});
  }
  change6 = () => {
      this.setState({home:6});
  }
  
   renderhome() {
    return (
      <div className="App">
        
          <nav className="navbar navbar-expand-lg navbar-light bg-info sticky-top">
            <a className="navbar-brand" href="#"><img height="50px" width="80px" src={logo} /></a>
            <div className="navbar-nav">
              <a className="nav-item nav-link active" href="#">Home</a>
            </div>
        </nav>

        <div className="card bg-primary" align="center" style={{margin:'4%'}}>
          <div className="card-body text-center">
            <p className="card-text text-light">User Menu</p>
            <div className="card bg-info">
              <div className="card-body text-center">
                <form method="POST" action="P1.php" name="sform">
                  <a className="text-light" onClick={this.change2}><label>Create Account</label></a>
                  <br/>
                  <a className="text-light" onClick={this.change3}><label>Submit Documents</label></a>
                  <br/>
                  <a className="text-light" onClick={this.change4}><label>View and Approve Access</label></a>
                  <br/>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-dark" align="center" style={{margin:'4%'}}>
          <div className="card-body text-center">
            <p className="card-text text-light">Institution Level</p>
            <div className="card bg-secondary">
              <div className="card-body text-center text-light">
                <form method="POST" action="P1.php" name="sform">
                  <a className="text-light" onClick={this.change5}><label>Request Access</label></a>
                  <br/>
                  <a className="text-light" onClick={this.change6}><label>View Access Status</label></a>
                  <br/>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

renderca() {
  return(
    <div>
       <nav className="navbar navbar-expand-lg navbar-light bg-info sticky-top">
            <a className="navbar-brand" href="#"><img height="50px" width="80px" src={logo} /></a>
            <div className="navbar-nav">
              <a className="nav-item nav-link active" onClick={this.change7}>Home</a>
            </div>
       </nav>

        <div className="card bg-primary" align="center" style={{margin:'4%'}}>
          <div className="card-body text-center">
            <p className="card-text text-light">Create Account</p>
            <div className="card bg-info">
              <div className="card-body text-center">
              
              <form method="POST" name="sform" onSubmit={this.create}>
                    <a href="#" className="text-light"><label>Enter Your Full Name</label></a>
                    <br/>
              <FormGroup>
                <FormControl
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={event => this.setState({name: event.target.value})}/>
                </FormGroup>
                    <br/>
                    <a href="#" className="text-light"  ><label>Enter EmailID</label></a>
                    <br/>
                <FormGroup>
                  <FormControl
                    type="text"
                    name="email"
                    value={this.state.email} onChange={event => this.setState({email: event.target.value})}/>
                </FormGroup>
                      <br/>
                    <a href="#" className="text-light"><label>Enter Contact no.</label></a>
                    <br/>
                <FormGroup>
                  <FormControl
                    type="text" name="contactno" value={this.state.contact} onChange={event => this.setState({contact: event.target.value})}/>
                </FormGroup>
                    <br/>
                    <br/>
                    <label>{this.state.isMetaMask}</label>
                    <input className=" btn btn-primary" type="submit" name="submit"/> 

                    <br/>
                </form>


              </div>
            </div>
          </div>
        </div>
    </div>

    );
}

rendersd(){
  return(
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-info sticky-top">
            <a className="navbar-brand" href="#"><img height="50px" width="80px" src={logo} /></a>
            <div className="navbar-nav">
              <a className="nav-item nav-link active" onClick={this.change7}>Home</a>
            </div>
        </nav>

        <div className="card bg-primary" align="center" style={{margin: '4%'}}>
          <div className="card-body text-center">
            <p className="card-text text-light">Submit Account</p>
            <div className="card bg-info">
              <div className="card-body text-center">
                <form method="POST" action="" name="sform" onSubmit={this.onSubmit}>
                    <a href="#" className="text-light"><label>Aadhar Card Number</label></a>
                    <br/>
                    <input type="text" name="aadid"/>
                    <br/>
                    <a href="#" className="text-light"><label>Name as per Aadhar Card</label></a>
                    <br/>
                    <input type="text" name="aname"/>
                    <br/>
                    <a href="#" className="text-light"><label>DOB as per Aadhar Card</label></a>
                    <br/>
                    <input type="text" name="adob"/>
                    <br/>
                    <a href="#" className="text-light"><label>Address as per Aadhar Card</label></a>
                    <br/>
                    <textarea name="aadd"></textarea>
                    <br/>
                    <a href="#" className="text-light"><label>Attach Aadhar Card</label></a>
                    <br/>
                    <input type="file" name="apic" accept="image/*" onChange = {this.captureFile}/>
                    <br/>
                    <br/>
                    <input className=" btn btn-primary" type="submit" name="submit"/>
                    <br/>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-primary" align="center" style={{margin: '4%'}}>
          <div className="card-body text-center">
            <p className="card-text text-light">Transaction Receipt</p>
            <div className="card bg-info">
              <div className="card-body text-center">
                <Button className=" btn btn-primary" onClick = {this.onClick}> Get Transaction Receipt </Button>
                <br/>
                  <Table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Tx Receipt Category</th>
                        <th>Values</th>
                      </tr>
                    </thead>
                   
                    <tbody>
                      <tr>
                        <td>IPFS Hash # stored on Eth Contract</td>
                        <td>{this.state.ipfsHash}</td>
                      </tr>
                      <tr>
                        <td>Ethereum Contract Address</td>
                        <td>{this.state.ethAddress}</td>
                      </tr>

                      <tr>
                        <td>Tx Hash # </td>
                        <td>{this.state.transactionHash}</td>
                      </tr>

                      <tr>
                        <td>Block Number # </td>
                        <td>{this.state.blockNumber}</td>
                      </tr>

                      <tr>
                        <td>Gas Used</td>
                        <td>{this.state.gasUsed}</td>
                      </tr>                
                    </tbody>
                </Table>
                </div>
            </div>
          </div>
        </div>
    </div>
    );
}

rendervaa(){
  return(
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-info sticky-top">
            <a className="navbar-brand" href="#"><img height="50px" width="80px" src={logo}/></a>
            <div className="navbar-nav">
              <a className="nav-item nav-link active" onClick={this.change7}>Home</a>
          </div>
        </nav>

      <div className="card bg-primary" align="center" style={{margin: '4%'}}>
          <div className="card-body text-center">
            <p className="card-text text-light">View Access Request</p>
            <div className="card bg-info">
              <div className="card-body text-center">
                <form method="POST" action="P1.php" name="sform">
                    <table className="table table-bordered">
                      <tr>
                        <th>Institution Name</th>
                        <th>Approval Status</th>
                        <th>More Info</th>
                      </tr>
                      <tr>
                        <td>Alfreds Futterkiste</td>
                        <td>Maria Anders</td>
                        <td>Germany</td>
                      </tr>
                      <tr>
                        <td>Centro comercial Moctezuma</td>
                        <td>Francisco Chang</td>
                        <td>Mexico</td>
                      </tr>
                      <tr>
                        <td>Ernst Handel</td>
                        <td>Roland Mendel</td>
                        <td>Austria</td>
                      </tr>
                      <tr>
                        <td>Island Trading</td>
                        <td>Helen Bennett</td>
                        <td>UK</td>
                      </tr>
                      <tr>
                        <td>Laughing Bacchus Winecellars</td>
                        <td>Yoshi Tannamuri</td>
                        <td>Canada</td>
                      </tr>
                      <tr>
                        <td>Magazzini Alimentari Riuniti</td>
                        <td>Giovanni Rovelli</td>
                        <td>Italy</td>
                      </tr>
                    </table>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
    );
}

renderra(){
  return(
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-info sticky-top">
            <a className="navbar-brand" href="#"><img height="50px" width="80px" src={logo}/></a>
            <div className="navbar-nav">
              <a className="nav-item nav-link active" onClick={this.change7}>Home</a>
          </div>
        </nav>

        <div className="card bg-dark" align="center" style={{margin: '4%'}}>
          <div className="card-body text-center">
            <p className="card-text text-light">Request Access</p>
            <div className="card bg-secondary">
              <div className="card-body text-center">
                <form method="POST" name="sform">
                    <a href="#" className="text-light"><label>Requesting Institution name</label></a>
                    <br/>
                    <input type="text" name="riname"/>
                    <br/>
                    <a href="#" className="text-light"><label>User Blockchain ID</label></a>
                    <br/>
                    <input type="text" name="ubid"/>
                    <br/>
                    <br/>
                    <a href="#" className="text-light"><label>Select the required access</label></a>
                    <br/>
                    <input type="checkbox" name="raop1" value="acn"/> Aadhar CardNo<br/>
                    <input type="checkbox" name="raop2" value="nac"/> Name as per Aadhar Card<br/>
                    <input type="checkbox" name="raop3" value="adob"/> DOB as per Aadhar Card<br/>
                    <input type="checkbox" name="raop4" value="aadd"/> Address as per Aadhar Card<br/>
                    <input type="checkbox" name="raop5" value="dac"/> Digital Aadhar Copy<br/>
                    <br/>
                    <br/>
                    <input className=" btn btn-dark" type="submit" name="submit"/>
                    <br/>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
    );
}

rendervrq(){
  return(
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-info sticky-top">
            <a className="navbar-brand" href="#"><img height="50px" width="80px" src={logo}/></a>
            <div className="navbar-nav">
              <a className="nav-item nav-link active" onClick={this.change7}>Home</a>
          </div>
        </nav>

        <div className="card bg-dark" align="center" style={{margin: '4%'}}>
          <div className="card-body text-center">
            <p className="card-text text-light">View Requested data</p>
            <div className="card bg-secondary">
              <div className="card-body text-center">
                <form method="POST" action="P1.php" name="sform">
                    <table className="table table-bordered">
                      <tr>
                        <th>Institution Name</th>
                        <th>Approval Status</th>
                        <th>More Info</th>
                      </tr>
                      <tr>
                        <td>Alfreds Futterkiste</td>
                        <td>Maria Anders</td>
                        <td>Germany</td>
                      </tr>
                      <tr>
                        <td>Centro comercial Moctezuma</td>
                        <td>Francisco Chang</td>
                        <td>Mexico</td>
                      </tr>
                      <tr>
                        <td>Ernst Handel</td>
                        <td>Roland Mendel</td>
                        <td>Austria</td>
                      </tr>
                      <tr>
                        <td>Island Trading</td>
                        <td>Helen Bennett</td>
                        <td>UK</td>
                      </tr>
                      <tr>
                        <td>Laughing Bacchus Winecellars</td>
                        <td>Yoshi Tannamuri</td>
                        <td>Canada</td>
                      </tr>
                      <tr>
                        <td>Magazzini Alimentari Riuniti</td>
                        <td>Giovanni Rovelli</td>
                        <td>Italy</td>
                      </tr>
                    </table>
                </form>
              </div>
            </div>
          </div>
        </div>
     </div>
    );
}

render(){
 
 if(this.state.home==2)
 {
  return this.renderca();
 }
 else if(this.state.home==3)
 {
  return this.rendersd();
 }
 else if(this.state.home==4)
 {
  return this.rendervaa();
 }
 else if(this.state.home==5)
 {
  return this.renderra();
 }
 else if(this.state.home==6)
 {
  return this.rendervrq();
 }
 else
 {
  return this.renderhome();
 }

}

}

export default App;
