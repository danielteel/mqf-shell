export function indexToAlpha(index){
    return String.fromCharCode(65+index);
}


export function answeredOnlyCorrect(answers, question){
    if (!answers || !question) return false;
    for (const picked of answers){
        if (!question.correct.includes(picked)) return false;
    }
    if (answers.length===question.correct.length);
    return true;
}