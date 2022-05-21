import React from 'react';
import { useEffect } from 'react/cjs/react.production.min';

import {Form, Header, Checkbox, Button, Segment, Divider, Message} from 'semantic-ui-react';

import Test from './Test';


function parseNumOfQuestions(value){
    let ret = Number.parseInt(value);
    if (!Number.isFinite(ret)) ret=0;
    return ret;
}

function buildDefaultSelectedBanks(mqf){
    let ret=[];
    mqf.forEach(()=>ret.push(true));
    return ret;
}

export default function TestBuilder({mqf}){
    const [selectedBanks, setSelectedBanks] = React.useState(buildDefaultSelectedBanks(mqf));
    const [numOfQuestions, setNumOfQuestions] = React.useState(1);
    const [randomize, setRandomize] = React.useState(true);
    const [testInProgress, setTestInProgress] = React.useState(false);
    const [test, setTest] = React.useState([]);

    const setBankSelected = (index, value) => {
        const newSelBank = [...selectedBanks];
        newSelBank[index]=Boolean(value);
        setSelectedBanks(newSelBank);
    }

    const possibleMaxQuestions = (() => {
        let questions=0;
        for (const [index, bank] of selectedBanks.entries()){
            if (bank){
                questions+=mqf[index].questions.length;
            }
        }
        return questions;
    })();

    useEffect( ()=>{
        setNumOfQuestions(possibleMaxQuestions);
    }, [mqf]);

    const clickMaxQuestions = () => {
        setNumOfQuestions(possibleMaxQuestions);
    }

    let numOfQuestionsError=false;
    if (numOfQuestions>possibleMaxQuestions){
        numOfQuestionsError="more than what exists ("+possibleMaxQuestions+")";
    }
    if (numOfQuestions===0){
        numOfQuestionsError="cant have a test with no questions";
    }
    if (possibleMaxQuestions===0){
        numOfQuestionsError="must have at least one question set with questions selected";
    }

    
    const startTest = () => {
        if (numOfQuestionsError) return;

        let possibleQuestions=[];

        for (const [index, bank] of selectedBanks.entries()){
            if (bank){
                possibleQuestions = [...possibleQuestions, ...mqf[index].questions];
            }
        }

        if (randomize){
            for (let i=0;i<possibleQuestions.length;i++){
                let item=possibleQuestions[i];
                let switchWith = Math.floor(Math.random()*possibleQuestions.length);
                possibleQuestions[i]=possibleQuestions[switchWith];
                possibleQuestions[switchWith]=item;
            }
        }
        
        while (possibleQuestions.length>numOfQuestions){
            possibleQuestions.splice(Math.floor(Math.random()*possibleQuestions.length), 1);
        }

        setTest({questions: possibleQuestions});
        setTestInProgress(true);
    }

    if (testInProgress){
        return <Test test={test} setTest={setTest} setTestInProgress={setTestInProgress}/>
    }else{
        return (
            <Segment compact style={{marginLeft:'auto', marginRight:'auto'}}>
                <Header textAlign='center'>
                    Take a test
                </Header>
                    <Form size="large" error={numOfQuestionsError}>

                        <Header as='h2'>Question sets</Header>

                        {
                            mqf.map( (bank, index) => (
                                <Form.Field key={'buildtest_questionset_'+bank.name+'_'+index} label={bank.name} control='input' type='checkbox' checked={selectedBanks[index]} onChange={(e)=>setBankSelected(index, e.target.checked)}/>
                            ))
                        }
                        

                        <Form.Group>
                            <Checkbox toggle label={"Randomize order"} control='input' type='checkbox' checked={randomize} onChange={(e)=>setRandomize(!randomize)}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Input
                                error={Boolean(numOfQuestionsError)} 
                                inline
                                label="Number of questions"
                                value={numOfQuestions}
                                onChange={e=>setNumOfQuestions(parseNumOfQuestions(e.target.value))}
                                action={<Button content="Max" onClick={clickMaxQuestions}/>}
                                labelPosition='right'
                            />
                        </Form.Group>

                        <Message error>{numOfQuestionsError}</Message>

                    </Form>
                    
                    <Divider/>

                    <Button fluid disabled={Boolean(numOfQuestionsError)} onClick={startTest} positive>Start test</Button>

            </Segment>
        );
    }
}