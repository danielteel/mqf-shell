
import {Segment, Grid, List, Header, Button, Message} from 'semantic-ui-react';

import {indexToAlpha, answeredOnlyCorrect} from './common';


export default function Results({answers, test, setTest, setTestInProgress, retakeTest}){
    let wrongQuestions = [];
    let wrongChoices = [];
    let correct=0;
    let total=0;
    let wrong=0;
    
    for (let [index, answer] of answers.entries()){
        if (answer?.length){
            total++;
            if (!answeredOnlyCorrect(answer, test.questions[index])){
                wrongQuestions.push(test.questions[index])
                wrongChoices.push(answer);
                wrong++;
            }else{
                correct++;
            }
        }
    }

    const takeTestWithWrongOnly = () => {
        setTest({questions: wrongQuestions});
        retakeTest();
    }

    return (
        <Segment>
            <Header style={{textAlign:"center", marginTop:'30px', marginBottom:'30px'}}>
                {
                    wrong>0
                    ?
                        'Your score: '+Math.floor((correct/total)*100)+"%"
                    :
                        correct>0
                        ?
                            'You got all the questions right, good job!'
                        :
                            'You left early without answering any questions.'
                }
            </Header>
            <Grid>
                <Grid.Row only='mobile'>
                    <Grid.Column width='2'/>
                    <Grid.Column width='12'>
                        <Button fluid color="green" onClick={takeTestWithWrongOnly} disabled={wrong===0}>Take new test with questions you got wrong</Button>
                    </Grid.Column>
                    <Grid.Column width='2'/>
                </Grid.Row>
                <Grid.Row only='mobile'>
                    <Grid.Column width='2'/>
                    <Grid.Column width='12'>
                        <Button fluid onClick={retakeTest}>Retake same test</Button>
                    </Grid.Column>
                    <Grid.Column width='2'/>
                </Grid.Row>
                <Grid.Row only='mobile'>
                    <Grid.Column width='2'/>
                    <Grid.Column width='12'>
                        <Button fluid color="red" onClick={()=>setTestInProgress(false)}>Main Menu</Button>
                    </Grid.Column>
                    <Grid.Column width='2'/>
                </Grid.Row>
                <Grid.Row only='tablet computer'>
                    <Grid.Column width='1'/>

                    <Grid.Column width='4'>
                        <Button style={{height:'100%'}} fluid color="green" onClick={takeTestWithWrongOnly} disabled={wrong===0}>Take new test with questions you got wrong</Button>
                    </Grid.Column>

                    <Grid.Column width='1'/>

                    <Grid.Column width='4'>
                        <Button style={{height:'100%'}} fluid onClick={retakeTest}>Retake same test</Button>
                    </Grid.Column>

                    <Grid.Column width='1'/>

                    <Grid.Column width='4'>
                        <Button style={{height:'100%'}} fluid color="red" onClick={()=>setTestInProgress(false)}>Main Menu</Button>
                    </Grid.Column>
                    
                    <Grid.Column width='1'/>
                </Grid.Row>
            </Grid>
            <Header style={{textAlign:"center", marginTop:'30px', marginBottom:'10px'}}>
                {
                    wrong>0
                    ?
                        'Questions you got wrong and should feel bad about'
                    :
                        null
                }
            </Header>
            {
                wrongQuestions.map((question, questionIndex) => (
                    <Message key={'result_questions'+question+questionIndex}>
                        {question.question}
                        <List size="mini">
                            <List.Item>
                                Ref: {question.ref}
                            </List.Item>
                            <List.Item>
                                {question.correct.length} correct answer(s)
                            </List.Item>
                        </List>
                        {
                        question.choices.map( (choice, choiceIndex) => (
                                <Message key={'result_questions'+question+questionIndex+'_choice'+choiceIndex} 
                                error={wrongChoices[questionIndex]?.includes(choiceIndex) && !question.correct.includes(choiceIndex)} 
                                positive={wrongChoices[questionIndex]?.includes(choiceIndex) && question.correct.includes(choiceIndex)}>
                                    {indexToAlpha(choiceIndex)+'. '+choice}
                                </Message>
                            ))
                        }
                    </Message>
                ))
            }
        </Segment>
    );
}