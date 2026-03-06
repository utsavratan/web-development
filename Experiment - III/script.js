const quizData = [
    {
        question: "Which team won the first IPL season (2008)?",
        options: ["Chennai Super Kings", "Rajasthan Royals", "Mumbai Indians", "RCB"],
        correct: 1
    },
    {
        question: "Who is known as 'Mr. IPL'?",
        options: ["MS Dhoni", "Rohit Sharma", "Suresh Raina", "Virat Kohli"],
        correct: 2
    },
    {
        question: "Which player has scored the most IPL runs?",
        options: ["David Warner", "Virat Kohli", "Rohit Sharma", "KL Rahul"],
        correct: 1
    },
    {
        question: "Which team has won the most IPL titles?",
        options: ["CSK", "RCB", "Mumbai Indians", "KKR"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const questionCount = document.getElementById("questionCount");
const liveScore = document.getElementById("liveScore");
const bestScore = document.getElementById("bestScore");
const timerEl = document.getElementById("timer");
const resultSection = document.getElementById("resultSection");
const finalScore = document.getElementById("finalScore");
const analysis = document.getElementById("analysis");
const restartBtn = document.getElementById("restartBtn");

bestScore.textContent = "Best: " + (localStorage.getItem("bestScore") || 0);

function startTimer() {
    timeLeft = 15;
    timerEl.textContent = "⏱ " + timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = "⏱ " + timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            nextBtn.disabled = false;
        }
    }, 1000);
}

function loadQuestion() {
    clearInterval(timer);
    startTimer();

    const data = quizData[currentQuestion];
    questionEl.textContent = data.question;
    optionsEl.innerHTML = "";
    nextBtn.disabled = true;

    questionCount.textContent = `Question ${currentQuestion + 1}/${quizData.length}`;
    liveScore.textContent = "Score: " + score;

    data.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;

        btn.onclick = () => selectAnswer(btn, index);
        optionsEl.appendChild(btn);
    });

    progressBar.style.width = ((currentQuestion) / quizData.length) * 100 + "%";
}

function selectAnswer(button, index) {
    clearInterval(timer);
    const correctIndex = quizData[currentQuestion].correct;
    const buttons = optionsEl.querySelectorAll("button");

    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correctIndex) btn.classList.add("correct");
        else if (i === index) btn.classList.add("wrong");
    });

    if (index === correctIndex) score++;

    liveScore.textContent = "Score: " + score;
    nextBtn.disabled = false;
}

nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
};

function showResult() {
    clearInterval(timer);
    document.getElementById("options").innerHTML = "";
    nextBtn.classList.add("hidden");

    progressBar.style.width = "100%";
    resultSection.classList.remove("hidden");

    finalScore.textContent = `Final Score: ${score} / ${quizData.length}`;

    if (score === quizData.length)
        analysis.textContent = "🏆 IPL Expert! Outstanding Knowledge!";
    else if (score >= quizData.length / 2)
        analysis.textContent = "👏 Good Cricket Knowledge!";
    else
        analysis.textContent = "📚 Watch more IPL matches!";

    let best = localStorage.getItem("bestScore") || 0;
    if (score > best) {
        localStorage.setItem("bestScore", score);
        bestScore.textContent = "Best: " + score;
    }
}

restartBtn.onclick = () => {
    currentQuestion = 0;
    score = 0;
    nextBtn.classList.remove("hidden");
    resultSection.classList.add("hidden");
    loadQuestion();
};

loadQuestion();
