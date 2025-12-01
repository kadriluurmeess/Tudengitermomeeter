const questions = [
    {
        question: "Mitu tundi sa magasid?",
        answers: [
            { text: "0–2 tundi", score: { zombie: 30 } },
            { text: "3–5 tundi", score: { zombie: 20, student: 15 } },
            { text: "6–8 tundi", score: { student: 25, guru: 20 } },
            { text: "8+ tundi (mida??)", score: { guru: 30 } }
        ]
    },
    {
        question: "Mitu kohvitassi või energiajooki sa täna juba joonud oled?",
        answers: [
            { text: "0", score: { guru: 25 } },
            { text: "1", score: { student: 20 } },
            { text: "2–3", score: { coffee: 25, student: 15 } },
            { text: "Ma ei loe enam…", score: { coffee: 35 } }
        ]
    },
    {
        question: "Mitmes loengus oled sellel nädalal reaalselt kohal käinud?",
        answers: [
            { text: "0", score: { zombie: 35 } },
            { text: "1–2", score: { zombie: 20, student: 15 } },
            { text: "3–4", score: { student: 30 } },
            { text: "Kõigis (olen robot)", score: { guru: 35 } }
        ]
    },
    {
        question: "Kui tõenäoline on, et sa avad Moodle'i ainult eksamipäeval?",
        answers: [
            { text: "Väga tõenäoline", score: { zombie: 30 } },
            { text: "Pigem jah", score: { zombie: 20, student: 15 } },
            { text: "Pigem ei", score: { student: 25, guru: 15 } },
            { text: "Ma olen Moodle'is liiga tihti", score: { guru: 35 } }
        ]
    },
    {
        question: "Kas sa tead, mitmes nädal praegu on?",
        answers: [
            { text: "Jah (olen hämmastunud)", score: { guru: 30, student: 20 } },
            { text: "Mingil määral", score: { student: 25 } },
            { text: "Ei", score: { zombie: 25 } },
            { text: "Ma ei tea isegi, mis kuu praegu on", score: { zombie: 35 } }
        ]
    },
    {
        question: "Kuidas kirjeldaksid oma rahakoti seisu?",
        answers: [
            { text: "Tudengitoetus päästab", score: { student: 25, zombie: 15 } },
            { text: "\"Vaatan veel korra kontot…\"", score: { zombie: 20, student: 20 } },
            { text: "\"Pärast stipendiumi on elu ilus\"", score: { guru: 25, student: 20 } },
            { text: "Toetan kohvipoode rohkem kui iseennast", score: { coffee: 30, student: 15 } }
        ]
    },
    {
        question: "Kui palju su kodutöödest on päriselt tehtud?",
        answers: [
            { text: "0–25%", score: { zombie: 35 } },
            { text: "25–50%", score: { zombie: 20, student: 20 } },
            { text: "50–75%", score: { student: 30, guru: 15 } },
            { text: "100% (meil on ruumis geniaalne inimene!)", score: { guru: 40 } }
        ]
    },
    {
        question: "Mis seis on su toaga?",
        answers: [
            { text: "Kaos – loominguline", score: { zombie: 25, student: 20 } },
            { text: "Kerge segadus", score: { student: 25, coffee: 15 } },
            { text: "Üsna korras", score: { student: 20, guru: 20 } },
            { text: "Steriilne, nagu eksamipaanikas koristatud", score: { guru: 30 } }
        ]
    },
    {
        question: "Kui tihti sa sööki tellid?",
        answers: [
            { text: "Iga päev… ups", score: { zombie: 30, coffee: 20 } },
            { text: "Paar korda nädalas", score: { student: 25 } },
            { text: "Harva", score: { student: 20, guru: 15 } },
            { text: "Ma teen ise süüa nagu täiskasvanu", score: { guru: 30 } }
        ]
    },
    {
        question: "Kui motiveeritud sa praegu oled?",
        answers: [
            { text: "0/10", score: { zombie: 40 } },
            { text: "3/10", score: { zombie: 25, student: 15 } },
            { text: "6/10", score: { student: 30, guru: 15 } },
            { text: "10/10 (vale vastus)", score: { guru: 35 } }
        ]
    }
];

// Save questions to localStorage for persistence
localStorage.setItem('quizQuestions', JSON.stringify(questions));