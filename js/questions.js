const questions = [
    {
        question: "Mitu tundi sa magasid?",
        answers: [
            { text: "0 - 2 tundi", score: { zombie: 30, tudeng: 10 } },
            { text: "3 - 5 tundi", score: { zombie: 20, tudeng: 15 } },
            { text: "6 - 8 tundi", score: { tudeng: 25, tuupur: 20 } },
            { text: "8+ tundi (mida??)", score: { tuupur: 35 } }
        ]
    },
    {
        question: "Mitu kohvitassi või energiajooki sa täna juba joonud oled?",
        answers: [
            { text: "0", score: { tuupur: 25, tudeng: 5 } },
            { text: "1", score: { tudeng: 15 } },
            { text: "2 - 3", score: { sõltlane: 25, tudeng: 20 } },
            { text: "Ma ei loe enam…", score: { sõltlane: 35 } }
        ]
    },
    {
        question: "Mitmes loengus oled sellel nädalal reaalselt kohal käinud?",
        answers: [
            { text: "0", score: { zombie: 35, tudeng: 20 } },
            { text: "1 - 2", score: { zombie: 20, tudeng: 15 } },
            { text: "3 - 4", score: { tudeng: 10, tuupur: 25 } },
            { text: "Kõigis (olen robot)", score: { tuupur: 35 } }
        ]
    },
    {
        question: "Kui tõenäoline on, et sa avad Moodle'i ainult eksamipäeval?",
        answers: [
            { text: "Väga tõenäoline", score: { zombie: 35 } },
            { text: "Pigem jah", score: { zombie: 25, tudeng: 15 } },
            { text: "Pigem ei", score: { tudeng: 25, tuupur: 15 } },
            { text: "Ma olen Moodle'is liiga tihti", score: { tuupur: 35 } }
        ]
    },
    {
        question: "Kas sa tead, mitmes nädal praegu on?",
        answers: [
            { text: "Jah (olen hämmastunud)", score: { tuupur: 35, tudeng: 15 } },
            { text: "Mingil määral", score: { tudeng: 25 } },
            { text: "Ei", score: { zombie: 25, tudeng: 15 } },
            { text: "Ma ei tea isegi, mis kuu praegu on", score: { zombie: 35, tudeng: 5 } }
        ]
    },
    {
        question: "Kuidas kirjeldaksid oma rahakoti seisu?",
        answers: [
            { text: "Kuu algus on", score: { tudeng: 35, zombie: 15 } },
            { text: "\"Vaatan veel korra kontot…\"", score: { zombie: 20, tudeng: 20 } },
            { text: "\"Pärast stipendiumi on elu ilus\"", score: { tuupur: 25, tudeng: 20 } },
            { text: "Toetan kohvipoode rohkem kui iseennast", score: { sõltlane: 30, tudeng: 15 } }
        ]
    },
    {
        question: "Kui palju su kodutöödest on päriselt tehtud?",
        answers: [
            { text: "0 - 25%", score: { zombie: 35 } },
            { text: "25 - 50%", score: { zombie: 20, tudeng: 20 } },
            { text: "50 - 75%", score: { tudeng: 30, tuupur: 15 } },
            { text: "100%", score: { tuupur: 40 } }
        ]
    },
    {
        question: "Mis seis on su toaga?",
        answers: [
            { text: "Kaos (loominguline)", score: { zombie: 25, tudeng: 20 } },
            { text: "Kerge segadus", score: { tudeng: 25, sõltlane: 15 } },
            { text: "Üsna korras", score: { tudeng: 20, tuupur: 20 } },
            { text: "Steriilne, nagu eksamipaanikas koristatud", score: { tuupur: 30 } }
        ]
    },
    {
        question: "Kui tihti sa sööki tellid?",
        answers: [
            { text: "Iga päev… ups", score: { zombie: 30, sõltlane: 20 } },
            { text: "Paar korda nädalas", score: { tudeng: 25 } },
            { text: "Harva", score: { tudeng: 20, tuupur: 15 } },
            { text: "Ma teen ise süüa nagu täiskasvanu", score: { tuupur: 30, tudeng: 20 } }
        ]
    },
    {
        question: "Kui motiveeritud sa praegu oled?",
        answers: [
            { text: "0/10", score: { zombie: 40 } },
            { text: "3/10", score: { zombie: 25, tudeng: 15 } },
            { text: "6/10", score: { tudeng: 30, tuupur: 15 } },
            { text: "10/10 (vale vastus)", score: { tuupur: 45 } }
        ]
    }
];

// Save questions to localStorage for persistence
localStorage.setItem('quizQuestions', JSON.stringify(questions));