import React from 'react';
import {Message, List, Menu, Button, Segment, Modal} from 'semantic-ui-react';

import {indexToAlpha, answeredOnlyCorrect} from './common';

import Results from './Results';


export default function Test({test, setTest, setTestInProgress}){
    const [answers, setAnswers] = React.useState([])
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [done, setDone] = React.useState(false);
    const [openFinishEarly, setOpenFinishEarly]=React.useState(false);
    const [openQuit, setOpenQuit]=React.useState(false);

    const retakeTest = () => {
        setAnswers([]);
        setCurrentQuestion(0);
        setDone(false);
        setOpenFinishEarly(false);
        setOpenQuit(false);
    }
    
    if (done){
        return <Results answers={answers} test={test} setTest={setTest} setTestInProgress={setTestInProgress} retakeTest={retakeTest}/>
    }else{
        const question = test.questions[currentQuestion];

        const answeredAll = (answered, quest=question) => {
            if (!answered || !quest) return false;
            for (const correct of quest.correct){
                if (!answered.includes(correct)){
                    return false;
                }
            }
            return true;
        }

        const nextUnanswered = (answers) => {
            for (let i=currentQuestion;i<test.questions.length;i++){
                if (!answeredAll(answers[i], test.questions[i])) return i;
            }
            for (let i=0;i<currentQuestion;i++){
                if (!answeredAll(answers[i], test.questions[i])) return i;
            }
            return null;
        }

        const clickOn = choice => {
            const newAnswers = JSON.parse(JSON.stringify(answers));
            if (!newAnswers[currentQuestion]) newAnswers[currentQuestion]=[];

            if (answeredAll(newAnswers[currentQuestion])) return;//Cant change the past

            if (!newAnswers[currentQuestion].includes(choice)){
                newAnswers[currentQuestion].push(Number(choice));
            }

            if (answeredAll(newAnswers[currentQuestion])){
                const nextQuestion = nextUnanswered(newAnswers);
                if (nextQuestion!==null){
                    setTimeout(()=>setCurrentQuestion(nextQuestion), 500);//shouldnt have magic numbers, should move to a config file
                }else{
                    //Done with test!
                    setTimeout(()=>setDone(true), 500)
                }
            }

            setAnswers(newAnswers);
        }

        let answeredQuestionCount=0;
        for (const q of answers){
            if (q?.length>0) answeredQuestionCount++;
        }

        let correctCount=0;
        for (let i=0;i<test.questions.length;i++){
            if (answeredOnlyCorrect(answers[i], test.questions[i])) correctCount++;
        }


        return (<>

            <Modal open={openFinishEarly} onClose={()=>setOpenFinishEarly(false)}>
                <Modal.Header>
                    Are you sure?
                </Modal.Header>
                <Modal.Content>
                    Do you really want to finish early?
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={()=>setOpenFinishEarly(false)}>Cancel</Button>
                    <Button positive onClick={()=>setDone(true)}>Finish early</Button>
                </Modal.Actions>
            </Modal>

            <Modal open={openQuit} onClose={()=>setOpenQuit(false)}>
                <Modal.Header>
                    Are you sure?
                </Modal.Header>
                <Modal.Content>
                    Do you really want to quit?
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={()=>setOpenQuit(false)}>Cancel</Button>
                    <Button positive onClick={()=>setTestInProgress(false)}>Quit</Button>
                </Modal.Actions>
            </Modal>

            <Menu borderless style={{marginLeft:"-5px", marginRight:'-5px', marginBottom:'7px'}}>
                <Menu.Item position='left'>
                    <Button onClick={()=>setOpenFinishEarly(true)}>Finish early</Button>
                </Menu.Item>
                <Menu.Item position='right'>
                    <Button color="red" onClick={()=>setOpenQuit(true)} floated='right'>Quit</Button>
                </Menu.Item>
            </Menu>
            <Segment secondary style={{margin:"-5px"}}>
                <Menu secondary>
                    <Menu.Item position='left'>
                            <Button disabled={currentQuestion===0} onClick={()=>setCurrentQuestion(currentQuestion-1)}>Prev</Button>
                    </Menu.Item>
                    <div style={{textAlign:'center', width:'100%', marginTop:'auto', marginBottom:'auto', verticalAlign:'center'}}>
                        {correctCount}/{answeredQuestionCount} = {answeredQuestionCount?Math.floor(correctCount*100/answeredQuestionCount):0}%
                    </div>
                    <Menu.Item position='right'>
                            <Button disabled={currentQuestion>=test.questions.length-1} onClick={()=>setCurrentQuestion(currentQuestion+1)}>Next</Button>
                    </Menu.Item>
                </Menu>
                <Message size="large" color='white'>
                    <b>{String(currentQuestion+1)}</b>/<b>{test.questions.length}</b> {question.question}

                    <List size="mini">
                        <List.Item>
                            Ref: {question.ref}
                        </List.Item>
                        <List.Item>
                            {question.correct.length} correct answer(s)
                        </List.Item>
                    </List>
                    {
                        question.choices.map( (choice, index) => (
                            <Message className='noselect' key={'qc_'+choice+question.question+index} style={{cursor: 'pointer'}} error={answers[currentQuestion]?.includes(index) && !question.correct.includes(index)} positive={answers[currentQuestion]?.includes(index) && question.correct.includes(index)} onClick={()=>clickOn(index)}>
                                {indexToAlpha(index)+'. '+choice}
                            </Message>
                        ))
                    }
                </Message>
            </Segment>
            </>
        );
    }
}