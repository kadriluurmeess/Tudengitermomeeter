const questions = [
    {
        question: "Mitu tundi sa täna magasid?",
        answers: [
            { text: "Mis on uni?", score: { zombie: 30, student: 20 } },
            { text: "2-4 tundi", score: { zombie: 20, student: 25 } },
            { text: "5-7 tundi", score: { student: 30, guru: 20 } },
            { text: "8+ tundi", score: { guru: 30 } }
        ]
    },
    {
        question: "Kui tühi on su kohvitass praegu?",
        answers: [
            { text: "Mul on 3 tühja tassi laual", score: { coffee: 30, zombie: 20 } },
            { text: "Joon praegu", score: { coffee: 25, student: 20 } },
            { text: "Ma ei joo kohvi", score: { guru: 30 } },
            { text: "Ootan järjekorras", score: { student: 25, coffee: 20 } }
        ]
    },
    {
        question: "Mitmes loengus oled sel nädalal reaalselt kohal käinud?",
        answers: [
            { text: "Kõik!", score: { guru: 30, student: 20 } },
            { text: "Umbes pooled", score: { student: 30 } },
            { text: "Üks oli", score: { zombie: 20, student: 20 } },
            { text: "Loengud?", score: { zombie: 30 } }
        ]
    },
    {
        question: "Kas sa tead, mis nädal praegu on?",
        answers: [
            { text: "Jah, muidugi", score: { guru: 30, student: 20 } },
            { text: "Vist 6. või 7.", score: { student: 25 } },
            { text: "September?", score: { zombie: 30 } },
            { text: "Eksamiperiood?!", score: { zombie: 25, student: 15 } }
        ]
    },
    {
        question: "Kui tõenäoline on, et sa avad Moodle'i ainult eksamipäeval?",
        answers: [
            { text: "Väga tõenäoline", score: { zombie: 30, student: 15 } },
            { text: "50/50", score: { student: 25 } },
            { text: "Moodle on mu avaleht", score: { guru: 30 } },
            { text: "Mis on Moodle?", score: { zombie: 35 } }
        ]
    }
];

// Save questions to localStorage for persistence
localStorage.setItem('quizQuestions', JSON.stringify(questions));