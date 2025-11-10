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
            ${results.map(result => `
                <p>${getTypeName(result.type)}: ${result.percentage}%</p>
            `).join('')}
            <p class="result-message">${resultMessage}</p>
            <button class="btn" onclick="location.reload()">Proovi Uuesti</button>
            <button class="btn" onclick="shareResult('${resultMessage}')">Jaga Tulemust</button>
        `;

        // Save to localStorage
        saveResult(results);
    }

    function getTypeName(type) {
        const types = {
            student: "Tartu Tudeng",
            zombie: "Zombie Tudeng",
            guru: "Õppur-Guru",
            coffee: "Kohvimasina Sõltlane"
        };
        return types[type] || type;
    }

    function generateResultMessage(results) {
        const topType = results[0];
        const secondType = results[1];

        const messages = {
            student: "Sa oled tõeline Tartu tudeng! Sinus on perfektne segu teadmishimu ja tudengimeelsust.",
            zombie: "Võta hetk puhkamiseks - isegi zombid vajavad und!",
            guru: "Õppur-Guru staatuses! Sa oled see, kellelt kõik konspekte küsivad.",
            coffee: "Su veres voolab rohkem kohvi kui vett. Kas sa elad kohvikus?"
        };

        return `${messages[topType.type]} (${topType.percentage}% ${getTypeName(topType.type)} ja ${secondType.percentage}% ${getTypeName(secondType.type)})`;
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