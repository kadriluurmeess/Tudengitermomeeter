document.addEventListener('DOMContentLoaded', () => {
    const startContainer = document.getElementById('start-container');
    const introContainer = document.getElementById('intro-container');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const startButton = document.getElementById('start-quiz');

    let currentQuestion = 0;
    let scores = {
        tudeng: 0,
        zombie: 0,
        tuupur: 0,
        sõltlane: 0
    };

    startButton.addEventListener('click', startQuiz);

    function startQuiz() {
        startContainer.classList.add('hidden');
        introContainer?.classList.add('hidden');
        document.querySelector('.subtitle')?.classList.add('hidden');
        document.querySelector('h1')?.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        quizContainer.classList.add('fade-in');
        setTimeout(() => quizContainer.classList.remove('fade-in'), 300);
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

        // Add fade when new question is shown
        quizContainer.classList.add('fade-in');
        setTimeout(() => quizContainer.classList.remove('fade-in'), 300);

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
            // Fade out current quiz container then show 'Get Results' button
            quizContainer.classList.add('fade-out');
            setTimeout(() => {
                quizContainer.classList.remove('fade-out');
                // Last question answered – clear questions and hide quiz container (avoid stray empty box)
                quizContainer.innerHTML = '';
                quizContainer.classList.add('hidden');
                const hero = document.querySelector('.hero-section');
                const btnWrap = document.createElement('div');
                btnWrap.className = 'get-results-wrap absolute-center fade-in';
                const getBtn = document.createElement('button');
                getBtn.id = 'get-results';
                getBtn.className = 'btn get-results-btn';
                // Localize to Estonian
                getBtn.textContent = 'Näita tulemusi';
                btnWrap.appendChild(getBtn);
                // remove any previous get-results wrapper (avoid duplicates)
                document.querySelectorAll('.get-results-wrap').forEach(el => el.remove());
                // append the button to the hero section so it sits between the wave lines
                hero.appendChild(btnWrap);
                // Optionally, animate the button appearance
                setTimeout(() => btnWrap.classList.remove('fade-in'), 300);
                // Attach click to show results overlay
                getBtn.addEventListener('click', () => {
                    showResultOverlay();
                });
            }, 200);
        }
    }

    function showResult() {
        // Backwards compatibility: show results directly into overlay
        showResultOverlay();
    }

    function showResultOverlay() {
        // Hide the quiz container content (questions container remains to maintain layout)
        quizContainer.classList.add('hidden');
        // Prevent background scroll while overlay is visible
        document.body.style.overflow = 'hidden';

        // Create overlay
        let overlay = document.createElement('div');
        overlay.className = 'results-overlay fade-in';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        // Leave main content visible; only hide the quiz container (we already add hidden on quizContainer at start)
        // Keep decorative waves visible and header clickable for navigation
        // (do not hide waves or header; just hide main content)

        // Calculate results (extract the logic from showResult)
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        let results = Object.entries(scores)
            .filter(([type, score]) => score > 0)
            .map(([type, score]) => ({
                type,
                percentage: (score / totalScore) * 100
            }))
            .sort((a, b) => b.percentage - a.percentage);

        let roundedResults = results.map(r => ({ ...r, percentage: Math.floor(r.percentage) }));
        let totalRounded = roundedResults.reduce((sum, r) => sum + r.percentage, 0);
        let remaining = 100 - totalRounded;
        for (let i = 0; i < remaining && i < roundedResults.length; i++) {
            roundedResults[i].percentage++;
        }
        results = roundedResults;

        const resultMessage = generateResultMessage(results);

        // Save to localStorage
        saveResult(results);

        overlay.innerHTML = `
            <div class="result-card">
                <h2>Sinu Tudengi Vibe</h2>
                <div class="result-box">
                    ${resultMessage}
                </div>
                <div class="result-actions">
                    <button class="btn" id="try-again-overlay">Proovi Uuesti</button>
                    <button class="btn btn-share" id="share-result">Jaga Tulemust</button>
                </div>
            </div>
        `;

        // Append overlay to body
        document.body.appendChild(overlay);

        // Position overlay below header so header remains visible and clickable
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) : 0;
        overlay.style.top = headerHeight + 'px';
        overlay.style.height = `calc(100vh - ${headerHeight}px)`;

        // Store results for sharing
        const resultsForSharing = results;

        // Retry button handler
        document.getElementById('try-again-overlay').addEventListener('click', () => {
            // Reset state and reload
            overlay.classList.add('fade-out');
            setTimeout(() => location.reload(), 300);
        });

        // Share button handler
        document.getElementById('share-result').addEventListener('click', () => {
            shareResult(resultsForSharing);
        });
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
                advice: "Soovitus: mine joo vett. Ja siis veel vett. Ja võib-olla mine maga ka veits.",
                traits: {
                    high: "Sa elad zombie-režiimis",
                    medium: "Sul on zombie hetki",
                    low: "Vahel tunned end zombina"
                }
            },
            sõltlane: {
                title: "Kofeiinisõltlane",
                text: "Sa ei joo kohvi vaid kohv joob sind. Kohvitass on alati käes, isegi unes. Baristad tunnevad sind nimepidi ja mõni lausa vaatab murelikult.",
                advice: "Soovitus: proovi vahel ka sööki, mitte ainult kofeiini.",
                traits: {
                    high: "Kohv voolab su veresoontes",
                    medium: "Kohv on su hea sõber",
                    low: "Sa vist ei joo kohvi liiga tihti"
                }
            },
            tuupur: {
                title: "Tuupija",
                text: "Sa oled see inimene, kellelt kõik küsivad konspekte. Moodle on su kodu ja loengus oled kohal enne õppejõudu. Kui TÜ-l oleks tudengitele oma superhero, siis oleksid see sina.",
                advice: "Soovitus: vahel on ka puhata vaja, muidu saad liiga võimsaks.",
                traits: {
                    high: "Sa oled tõeline õppija",
                    medium: "Sul on tugev õppimisvaim",
                    low: "Sa õpid vahest"
                }
            },
            tudeng: {
                title: "Tartu Tudeng",
                text: "Täiuslik tasakaal: pisut kaos, pisut motivatsiooni, palju kohvi ja natuke ellujäämist. Sa tead, kus saab tasuta pistikuid kasutada, mis on parimad Delta maja õppimise spotid ja kui palju peab õppima, et mitte läbi kukkuda ja samal ajal elus püsida.",
                advice: "Soovitus: jätka samas vaimus! Sa kehastad TÜ hinge.",
                traits: {
                    high: "Sa oled klassikaline Tartu tudeng",
                    medium: "Sul on tudengivaim ja sa tajud tudengielu",
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
                <p><em>Sa oled unikaalne segu, jätka samas vaimus!</em></p>
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