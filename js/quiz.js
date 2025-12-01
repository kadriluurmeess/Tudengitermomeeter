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

        // Calculate percentages
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        let results = Object.entries(scores)
            .filter(([type, score]) => score > 0)
            .map(([type, score]) => ({
                type,
                percentage: (score / totalScore) * 100
            }))
            .sort((a, b) => b.percentage - a.percentage);

        // Round percentages and ensure they sum to 100%
        let roundedResults = results.map(r => ({
            ...r,
            percentage: Math.floor(r.percentage)
        }));

        // Calculate remaining percentage to distribute
        let totalRounded = roundedResults.reduce((sum, r) => sum + r.percentage, 0);
        let remaining = 100 - totalRounded;

        // Distribute remaining percentage to top results
        for (let i = 0; i < remaining && i < roundedResults.length; i++) {
            roundedResults[i].percentage++;
        }

        results = roundedResults;

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
            tudeng: "Tartu Tudeng",
            zombie: "Zombie Tudeng",
            tuupur: "Tuupur",
            sõltlane: "Kofeiinisõltlane"
        };
        return types[type] || type;
    }

    function generateResultMessage(results) {
        const descriptions = {
            zombie: {
                title: "Zombie Tudeng",
                text: "Sa oled kõndiv sessi-vaim. Su keha liigub, aga hing on raamatukokku maha jäänud. Kohvi tase veres on kriitiline, unevõlg ehmatav ja Moodle'i avamine tekitab eksistentsiaalse paanika.",
                advice: "Soovitus: mine joo vett. Ja siis veel vett. Ja võib-olla magagi.",
                traits: {
                    high: "Sa elad zombie-režiimis",
                    medium: "Sul on zombie hetki",
                    low: "Vahel tunned end zombina"
                }
            },
            sõltlane: {
                title: "Kofeiinisõltlane",
                text: "Sa ei joo kohvi - kohv joob sind. Kohvitass on alati käes, isegi unes. Baristad tunnevad sind nimepidi ja mõni lausa vaatab murelikult.",
                advice: "Soovitus: proovi vahel ka sööki, mitte ainult kofeiini.",
                traits: {
                    high: "Kohv voolab su veresoontes",
                    medium: "Kohv on su hea sõber",
                    low: "Sa armastad kohvi"
                }
            },
            tuupur: {
                title: "Tuupur",
                text: "Sa oled see inimene, kellelt kõik küsivad konspekte. Moodle on su kodu ja loengus oled kohal enne õppejõudu. Kui TÜ-l oleks tudengitele oma superhero, siis oleksid see sina.",
                advice: "Soovitus: vahel on ka puhata vaja, muidu saad liiga võimsaks.",
                traits: {
                    high: "Sa oled tõeline õppeguru",
                    medium: "Sul on tugev õppimisvaimu",
                    low: "Sa hoolid õppimisest"
                }
            },
            tudeng: {
                title: "Tartu Tudeng",
                text: "Täiuslik tasakaal: pisut kaos, pisut motivatsiooni, palju kohvi ja natuke ellujäämist. Sa tead, kus saab tasuta pistikuid kasutada, mis on parimad Delta maja õppimise spotid ja kui palju peab õppima, et mitte läbi kukkuda ja samal ajal elus püsida.",
                advice: "Soovitus: jätka samas vaimus - sa kehastad TÜ hinge.",
                traits: {
                    high: "Sa oled klassikaline Tartu tudeng",
                    medium: "Sul on tudengivaim",
                    low: "Sa tunned tudengielu"
                }
            }
        };

        // If one type dominates (>60%), show pure description
        if (results[0].percentage > 60) {
            const mainType = descriptions[results[0].type];
            return `
                <div class="result-details">
                    <h3>${mainType.title}</h3>
                    <p><strong>Sa oled ${results[0].percentage}% ${getTypeName(results[0].type)}!</strong></p>
                    <p>${mainType.text}</p>
                    <p><em>${mainType.advice}</em></p>
                </div>
            `;
        }

        // Mixed description based on top 2-3 types
        const topTypes = results.slice(0, 2);
        let mixedText = "";
        
        topTypes.forEach((result, index) => {
            const desc = descriptions[result.type];
            if (!desc) return;
            
            let trait;
            if (result.percentage > 40) {
                trait = desc.traits.high;
            } else if (result.percentage > 25) {
                trait = desc.traits.medium;
            } else {
                trait = desc.traits.low;
            }
            
            if (index === 0) {
                mixedText += trait + ". ";
            } else {
                mixedText += "Samas " + trait.charAt(0).toLowerCase() + trait.slice(1) + ". ";
            }
        });

        // Create percentage breakdown
        const percentageText = results
            .map(r => `${r.percentage}% ${getTypeName(r.type)}`)
            .join(", ");

        return `
            <div class="result-details">
                <h3>Sinu Tudengi Vibe</h3>
                <p><strong>${percentageText}</strong></p>
                <p>${mixedText}</p>
                <p><em>Sa oled unikaalne segu - jätka samas vaimus!</em></p>
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