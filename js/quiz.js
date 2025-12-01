document.addEventListener('DOMContentLoaded', () => {
    const startContainer = document.getElementById('start-container');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const startButton = document.getElementById('start-quiz');

    let currentQuestion = 0;
    let scores = {
        student: 0,
        zombie: 0,
        guru: 0,
        coffee: 0
    };

    startButton.addEventListener('click', startQuiz);

    function startQuiz() {
        startContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const question = questions[currentQuestion];
        
        quizContainer.innerHTML = `
            <div class="question">
                <h2>${question.question}</h2>
                <div class="answers">
                    ${question.answers.map((answer, index) => `
                        <button class="answer-btn" data-index="${index}">
                            ${answer.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listeners to answer buttons
        document.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', () => handleAnswer(button.dataset.index));
        });
    }

    function handleAnswer(answerIndex) {
        const answer = questions[currentQuestion].answers[answerIndex];
        
        // Add scores
        Object.entries(answer.score).forEach(([type, score]) => {
            scores[type] = (scores[type] || 0) + score;
        });

        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        // Calculate highest score
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        const results = Object.entries(scores).map(([type, score]) => ({
            type,
            percentage: Math.round((score / totalScore) * 100)
        }));

        results.sort((a, b) => b.percentage - a.percentage);

        // Generate result message
        let resultMessage = generateResultMessage(results);

        resultContainer.innerHTML = `
            <h2>Sinu Tudengi Vibe:</h2>
            ${resultMessage}
            <button class="btn" onclick="location.reload()">Proovi Uuesti</button>
        `;

        // Save to localStorage
        saveResult(results);
    }

    function getTypeName(type) {
        const types = {
            student: "🎓 100% Tartu Tudeng",
            zombie: "🧟 Zombie Tudeng",
            guru: "📚 Õppur-Guru",
            coffee: "☕ Kohvimasinaga Sõltlane"
        };
        return types[type] || type;
    }

    function generateResultMessage(results) {
        const topType = results[0];
        const secondType = results[1];

        const descriptions = {
            zombie: {
                title: "🧟 Zombie Tudeng",
                text: "Sa oled kõndiv sessi-vaim. Su keha liigub, aga hing on raamatukokku maha jäänud. Kohvi tase veres on kriitiline, unevõlg ehmatav ja Moodle'i avamine tekitab eksistentsiaalse paanika.",
                advice: "Soovitus: mine joo vett. Ja siis veel vett. Ja võib-olla magagi."
            },
            coffee: {
                title: "☕ Kohvimasinaga Sõltlane",
                text: "Sa ei joo kohvi – kohv joob sind. Kohvitass on alati käes, isegi unes. Raamatukogus tunnevad baristad sind nimepidi ja mõni lausa vaatab murelikult.",
                advice: "Soovitus: proovi vahel ka sööki, mitte ainult kofeiini."
            },
            guru: {
                title: "📚 Õppur-Guru",
                text: "Sa oled see inimene, kellelt kõik küsivad konspekte. Moodle on su kodu ja loengus oled kohal enne õppejõudu. Kui TÜ-l oleks tudengitele oma superhero, siis oleksid see sina.",
                advice: "Soovitus: vahel on ka puhata vaja, muidu saad liiga võimsaks."
            },
            student: {
                title: "🎓 100% Tartu Tudeng",
                text: "Täiuslik tasakaal: pisut kaos, pisut motivatsiooni, palju kohvi ja natuke ellujäämist. Sa tead, kust saab tasuta pistikuid, millal Raatuse ühika dušš on vaba ja palju peab õppima, et mitte läbi kukkuda ja samal ajal elus püsida.",
                advice: "Soovitus: jätka samas vaimus – sa kehastad TÜ hinge."
            }
        };

        const mainType = descriptions[topType.type];
        return `
            <div class="result-details">
                <h3>${mainType.title}</h3>
                <p><strong>Sa oled ${topType.percentage}% ${getTypeName(topType.type)} ja ${secondType.percentage}% ${getTypeName(secondType.type)}.</strong></p>
                <p>${mainType.text}</p>
                <p><em>${mainType.advice}</em></p>
            </div>
        `;
    }

    function saveResult(results) {
        const previousResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        previousResults.push({
            timestamp: new Date().toISOString(),
            results: results
        });
        localStorage.setItem('quizResults', JSON.stringify(previousResults));
    }

    function shareResult(message) {
        if (navigator.share) {
            navigator.share({
                title: 'Minu Tartu Tudengi Vibe',
                text: message,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(message).then(() => {
                alert('Tulemus kopeeritud lõikelauale!');
            });
        }
    }
});