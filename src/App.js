import {Header, Container, Divider} from 'semantic-ui-react';

import TestBuilder from "./TestBuilder";

import MQF from './mqf.json';

function App() {
  return (
    <>
        <Header as='h2' style={{textAlign:'center', paddingTop:'20px'}}>
            MQF
        </Header>
        <Divider/>
        <Container style={{maxWidth: '600px'}}>
            <TestBuilder mqf={MQF.sections}/>
            <Container textAlign='center'>
                <label className='noselect' style={{color:"#00000004"}}>Dan Teel NMANG</label>
            </Container>
        </Container>
    </>
  );
}

export default App;