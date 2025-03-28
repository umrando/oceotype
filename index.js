const wordList = ["the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us"];

const hardToTypeWords = ["awkward","bacillus","biscuit","bizarre","blizzard","bonafide","bouquet","bufferfly","buzzkill","caffeine","circuit","cobwebby","conflate","cryptic","curmudgeon","debunked","dequeue","dubious","dyslexia","eczema","effluent","elixir","elusive","embolden","enclave","equinox","esoteric","euphoric","exorcism","fervent","fiasco","fickle","flimflam","fluently","fractal","frenzied","fugitive","gimmicky","gobsmack","grotesque","guffawed","haphazard","hemlock","hijacked","hubbub","hyperbole","impromptu","inflamed","isotope","jackpot","jaundice","jinxed","jubilant","juxtapose","kelpwort","knapsack","kowtowed","labyrinth","larynx","luminous","lymphatic","malady","maniacal","mayhem","mischief","mnemonic","mortgage","mustache","mystique","nebulous","numskull","obstinate","obscure","ogreish","opaque","palindrome","pamphlet","parallax","perplex","phalanx","phlegm","physique","pixieish","porcelain","quaintly","quizzical","quorums","rambunct","redundant","rhinestone","rhythm","sabotage","sinister","squabble","swindled","synopsis","uproar","vexation","whimsical","zealous"];

let currentWords = "";
let startTime;
let typedText = "";
let totalCharsTyped = 0;
let totalPoints = 0;
let correctionMap = {};
let allTypedTexts = [];
let nextWords = "";
let totalCorrectedChars = 0;
let isBonusMode = false;

const screens = {
    home: document.getElementById("homeScreen"),
    leaderboard: document.getElementById("leaderboardScreen"),
    customTest: document.getElementById("customTestScreen"),
    countdown: document.getElementById("countdownScreen"),
    typingTest: document.getElementById("typingTestScreen"),
    results: document.getElementById("resultsScreen"),
    signUpScreen: document.getElementById("signUpScreen"),
    logInScreen: document.getElementById("logInScreen")
};

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        if (screen) {
            screen.classList.remove('fade-in', 'fade-out');
            if (screen.style.display === 'block') {
                screen.classList.add('fade-out');
                setTimeout(() => (screen.style.display = 'none'), 500); // Wait for fade-out
            }
        }
    });
    if (screens[screenName]) {
        screens[screenName].style.display = 'block';
        screens[screenName].classList.add('fade-in');
    }
}

function getRandomWords(count) {
    let words = [];
    let previousWord = null;
    for (let i = 0; i < count; i++) {
        let randomWord;
        do {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            randomWord = wordList[randomIndex];
        } while (randomWord === previousWord);
        words.push(randomWord);
        previousWord = randomWord;
    }
    return words.join(" ");
}

function showHomeScreen() {
    const totalPoints = getTotalPointsFromStorage();
    document.querySelector("#homeScreen .points-display").textContent = `Points: ${totalPoints}`;
    document.querySelectorAll(".bonus-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            isBonusMode = this.checked;
        });
    });
    showScreen("home");
}

function startPresetTest(duration) {
    currentWords = getRandomWords(20);
    const scrollContainer = document.getElementById("testScrollContainer");
    if (scrollContainer) {
        // Trigger fade-out animation
        scrollContainer.classList.remove("fade-in");
        scrollContainer.classList.add("fade-out");

        // Wait for the fade-out animation to complete before updating content
        setTimeout(() => {
            scrollContainer.innerHTML = `
                <div id="testContent">
                    <p>Test Duration: ${duration} seconds</p>
                    <p>Words to type:</p>
                    <p>${currentWords}</p>
                </div>
            `;
            // Trigger fade-in animation
            scrollContainer.classList.remove("fade-out");
            scrollContainer.classList.add("fade-in");
        }, 500); // Match the duration of the fade-out animation
    }
    startCountdown(duration);
}

function customTest() {
    showScreen("customTest");
    const customTextContainer = document.getElementById("customTextContainer");
    if (customTextContainer) {
        customTextContainer.style.display = "block"; // Ensure visibility
    }
}

function startCountdown(duration) {
    showScreen("countdown");
    document.getElementById("reviewText").textContent = currentWords;
    let count = 5;
    const countdownInterval = setInterval(() => {
        count--;
        document.getElementById("countdown").textContent = count;
        if (count === 0) {
            clearInterval(countdownInterval);
            beginTypingTest(duration);
        }
    }, 1000);
}

function beginTypingTest(duration) {
    showScreen("typingTest");
    document.getElementById("phrase").innerHTML = `<span id="cursor"></span>${currentWords}`;
    document.getElementById("input").value = "";
    document.getElementById("input").focus();
    startTime = new Date().getTime();
    const testTimeout = setTimeout(endTest, duration * 1000);
    document.getElementById("input").addEventListener("input", (e) => {
        typedText = e.target.value;
        updateDisplay();
    });
    const updateProgress = () => {
        const elapsed = (new Date().getTime() - startTime) / 1000;
        const progress = (elapsed / duration) * 100;
        document.getElementById("progressBar").style.width = `${100 - progress}%`;
        if (elapsed < duration) {
            requestAnimationFrame(updateProgress);
        }
    };
    updateProgress();
}

function getTotalPointsFromStorage() {
    return parseInt(localStorage.getItem("totalPoints")) || 0;
}

function updateTotalPointsInStorage(points) {
    const newTotal = getTotalPointsFromStorage() + points;
    localStorage.setItem("totalPoints", newTotal);
    return newTotal;
}

document.addEventListener("DOMContentLoaded", () => {
    const displayName = localStorage.getItem("displayName");
    if (!displayName) {
        showSignUp(); // Direct new users to the sign-up screen
    } else {
        showHomeScreen();
    }
    updatePointsDisplay(0);
});

function updatePointsDisplay(points) {
    const pointsDisplay = document.querySelector(".points-display");
    if (pointsDisplay) {
        pointsDisplay.textContent = `Points: ${points.toLocaleString()}`;
    }
}

function showSignUp() {
    showScreen("signUpScreen");
}

function showLogIn() {
    showScreen("logInScreen");
}

function showHome() {
    showScreen("home");
    document.querySelectorAll(".tab-button").forEach(button => button.classList.remove("active"));
}

function showTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
    });
    document.getElementById(tabId).style.display = "block";

    // Update active tab styling
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });
    const activeButton = document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`);
    if (activeButton) {
        activeButton.classList.add("active");
    }

    if (tabId === 'leaderboardTab') {
        loadLeaderboard();
    }
}

function loadLeaderboard() {
    const leaderboardData = getLeaderboardData(); // Fetch leaderboard data dynamically
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = ''; // Clear existing entries

    leaderboardData.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="rank">#${index + 1}</span>
            <span class="name">${entry.name}</span>
            <span class="points">${entry.points.toLocaleString()} points</span>
        `;
        leaderboardElement.appendChild(li);
    });
}

function getLeaderboardData() {
    // Replace this with actual API or database call to fetch leaderboard data
    return []; // Return an empty array for now
}

function updateDisplay() {
    let coloredText = "";
    let points = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentWords[i]) {
            if (correctionMap[i] === "incorrect") {
                points += 0.75;
                correctionMap[i] = "corrected";
                totalCorrectedChars++;
            } else if (!correctionMap[i]) {
                points += 1;
                correctionMap[i] = "correct";
            }
            coloredText += `<span style='color: green;'>${currentWords[i]}</span>`;
        } else {
            if (!correctionMap[i]) {
                correctionMap[i] = "incorrect";
            }
            coloredText += `<span style='color: red;'>${currentWords[i]}</span>`;
        }
    }
    totalPoints = points;
    if (typedText.length < currentWords.length) {
        coloredText += `<span id='cursor'></span>${currentWords.slice(typedText.length)}`;
    }
    document.getElementById("phrase").innerHTML = coloredText;
}

function endTest() {
    const inputField = document.getElementById("input");
    if (inputField) {
        allTypedTexts.push({ typedText: inputField.value, paragraph: currentWords });
    }
    let endTime = new Date().getTime();
    let timeTaken = (endTime - startTime) / 1000;
    let timeInMinutes = timeTaken / 60;
    let totalCorrectChars = 0;
    let totalIncorrectChars = 0;
    allTypedTexts.forEach(({ typedText, paragraph }) => {
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === paragraph[i]) {
                totalCorrectChars++;
            } else {
                totalIncorrectChars++;
            }
        }
    });
    const combinedTypedText = allTypedTexts.map(entry => entry.typedText).join("");
    let wpm = Math.round(combinedTypedText.length / 5 / timeInMinutes);
    let accuracy = 0;
    const totalTypedChars = totalCorrectChars + totalIncorrectChars + totalCorrectedChars;
    if (totalTypedChars > 0) {
        accuracy = (((totalCorrectChars + totalCorrectedChars) / totalTypedChars) * 100).toFixed(2);
    }
    let adjustedWPM = 0;
    if (accuracy > 0) {
        adjustedWPM = Math.round(wpm * (accuracy / 100));
    }
    totalPoints = 0;
    allTypedTexts.forEach(({ typedText, paragraph }) => {
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === paragraph[i]) {
                if (correctionMap[i] === "corrected") {
                    totalPoints += 0.75;
                } else {
                    totalPoints += 1;
                }
            }
        }
    });
    if (isBonusMode) {
        totalPoints *= 5;
    }
    const updatedTotalPoints = updateTotalPointsInStorage(totalPoints);
    document.getElementById("resultsScreen").innerHTML = `
        <h1>Typing Test Results</h1>
        <p>Raw WPM: ${wpm} WPM</p>
        <p>Accuracy: ${accuracy}%</p>
        <p>Adjusted WPM: ${adjustedWPM} WPM</p>
        <p>Total characters typed correctly: ${totalCorrectChars}</p>
        <p>Total characters typed incorrectly: ${totalIncorrectChars}</p>
        <p>Total Points: +${totalPoints}</p>
        <p>Updated Total Points: ${updatedTotalPoints}</p>
        <button onclick='showHomeScreen()'>Return to Home</button>
    `;
    showScreen("results");
}

function handleSignUp(event) {
    event.preventDefault();
    const displayName = document.getElementById("signUpDisplayName").value;
    const password = document.getElementById("signUpPassword").value;

    // Save user data to the database
    saveUserToDatabase({ displayName, password, points: 0 });

    // Set user as logged in
    localStorage.setItem("displayName", displayName);
    showHomeScreen();
}

function handleLogIn(event) {
    event.preventDefault();
    const displayName = document.getElementById("logInDisplayName").value;
    const password = document.getElementById("logInPassword").value;

    // Verify user credentials
    const user = getUserFromDatabase(displayName, password);
    if (user) {
        localStorage.setItem("displayName", displayName);
        showHomeScreen();
    } else {
        alert("Invalid credentials. Please try again.");
    }
}

function saveUserToDatabase(user) {
    // Replace with actual database logic
    console.log("User saved:", user);
}

function getUserFromDatabase(displayName, password) {
    // Replace with actual database logic
    console.log("Fetching user:", displayName);
    return null; // Simulate no user found
}