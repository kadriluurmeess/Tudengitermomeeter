// Tudengi Termomeetri viktoriin - peamine JavaScripti fail
// See fail haldab viktoriini loogikat, küsimuste kuvamist ja tulemuste arvutamist

// Ootame, kuni lehekülg on täielikult laetud
document.addEventListener('DOMContentLoaded', () => {
    // Hangime viited HTML elementidele
    const startContainer = document.getElementById('start-container');
    const introContainer = document.getElementById('intro-container');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const startButton = document.getElementById('start-quiz');

    // Jälgime praegust küsimust ja punkte
    let currentQuestion = 0;
    let scores = {
        tudeng: 0,      // Punktid Tartu Tudengi tüübi jaoks
        zombie: 0,      // Punktid Zombie Tudengi tüübi jaoks
        tuupur: 0,      // Punktid Tuupija tüübi jaoks
        sõltlane: 0     // Punktid Kofeiinisõltlase tüübi jaoks
    };


    startButton.addEventListener('click', startQuiz);

    // Funktsioon küsimustiku alustamiseks
    function startQuiz() {
        // Peidame tutvustuse ja alustamise nupu
        startContainer.classList.add('hidden');
        introContainer?.classList.add('hidden');
        document.querySelector('.subtitle')?.classList.add('hidden');
        document.querySelector('h1')?.classList.add('hidden');
        // Näitame küsimuste konteinerit
        quizContainer.classList.remove('hidden');
        quizContainer.classList.add('fade-in');
        setTimeout(() => quizContainer.classList.remove('fade-in'), 300);
        showQuestion();
    }

    // Funktsioon küsimuse kuvamiseks
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

        // Lisame hägustumisefekti uue küsimuse kuvamisel
        quizContainer.classList.add('fade-in');
        setTimeout(() => quizContainer.classList.remove('fade-in'), 300);

        // Lisame vastuse nuppudele sündmuste kuulajad
        document.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', () => handleAnswer(button.dataset.index));
        });
    }

    // Funktsioon vastuse töötlemiseks
    function handleAnswer(answerIndex) {
        const answer = questions[currentQuestion].answers[answerIndex];
        
        // Lisame punktid valitud vastuse põhjal
        Object.entries(answer.score).forEach(([type, score]) => {
            scores[type] = (scores[type] || 0) + score;
        });

        // Liigume järgmisele küsimusele
        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            // Hägustame praeguse küsimustiku konteinerit ja näitame 'Näita tulemusi' nuppu
            quizContainer.classList.add('fade-out');
            setTimeout(() => {
                quizContainer.classList.remove('fade-out');
                // Viimane küsimus vastatud – tühjendame küsimused ja peidame küsimustiku
                quizContainer.innerHTML = '';
                quizContainer.classList.add('hidden');
                const hero = document.querySelector('.hero-section');
                const btnWrap = document.createElement('div');
                btnWrap.className = 'get-results-wrap absolute-center fade-in';
                const getBtn = document.createElement('button');
                getBtn.id = 'get-results';
                getBtn.className = 'btn get-results-btn';
                // Nupu tekst eesti keeles
                getBtn.textContent = 'Näita tulemusi';
                btnWrap.appendChild(getBtn);
                // Eemaldame varasemad tulemuste nupud
                document.querySelectorAll('.get-results-wrap').forEach(el => el.remove());
                
                hero.appendChild(btnWrap);
               
                setTimeout(() => btnWrap.classList.remove('fade-in'), 300);
                
                getBtn.addEventListener('click', () => {
                    showResultOverlay();
                });
            }, 200);
        }
    }

    function showResult() {
        
        showResultOverlay();
    }

    function showResultOverlay() {
        // Peidame küsimustiku konteineri 
        quizContainer.classList.add('hidden');
        
        document.body.style.overflow = 'hidden';

        
        let overlay = document.createElement('div');
        overlay.className = 'results-overlay fade-in';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        // Jätame põhisisu nähtavaks; peidame ainult küsimustiku konteineri
        // Hoiame dekoratiivsed lained nähtavaks ja päise klikitavaks navigeerimiseks

        // Arvutame tulemused
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

        // Salvestame tulemused localStorage'sse
        saveResult(results);

        overlay.innerHTML = `
            <div class="result-card">
                <h2>Sinu Tudengi Vibe</h2>
                <div class="result-box">
                    ${resultMessage}
                </div>
                <div class="result-actions">
                    <button class="btn" id="try-again-overlay">Proovi Uuesti</button>
                </div>
            </div>
        `;

        
        document.body.appendChild(overlay);

       
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) : 0;
        overlay.style.top = headerHeight + 'px';
        overlay.style.height = `calc(100vh - ${headerHeight}px)`;
        

        // Proovi uuesti nupu käsitleja
        document.getElementById('try-again-overlay').addEventListener('click', () => {
            // Lähtestame oleku ja laeme lehe uuesti
            overlay.classList.add('fade-out');
            setTimeout(() => location.reload(), 300);
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

        // Kui üks tüüp domineerib (>60%), näitame puhast kirjeldust
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

        // Segatud kirjeldus põhineb 2-3 parimat tüüpi
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

        // Loome protsentuaalse jaotuse
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
});
