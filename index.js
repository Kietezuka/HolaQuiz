const response = await fetch("./data.json");
const data = await response.json();
//console.log(data);//4113

const levels = data.map(function (d) {
  return d.cefr_level;
});

const levelsUnique = [...new Set(levels)];
const wordsList = {};

levelsUnique.forEach((level) => {
  const levelLists = data.filter((w) => w.cefr_level === level);

  wordsList[level] = {
    all: levelLists,
    noun: levelLists.filter((w) => w.pos === "noun"),
    verb: levelLists.filter((w) => w.pos === "verb"),
    adjective: levelLists.filter((w) => w.pos === "adjective"),
    adverb: levelLists.filter((w) => w.pos === "adverb"),
  };
});

//button level
const levelBtns = document.querySelectorAll(".level-btn");
//button pos
const posBtns = document.querySelectorAll(".pos-btn");
const startNextBtn = document.getElementById("start-next-btn");
const startBtn = document.querySelector(".start");
const ansBtns = document.querySelectorAll(".ans-btn");
const seeAllWords = document.getElementById("see-all-words");

//Element
const displayWordText = document.getElementById("display-word-text");
const displayList = document.getElementById("display-list");
const answerContainer = document.getElementsByClassName("answer-container");
const searchContainer = document.getElementById("search-container");
const messageEl = document.getElementById("message");
//----------------------------------------------------------------<Change the selected btn>
//when user clicked the btn, remove ".level-btn selected" (alreday cliced btn),
// and then add ".level-btn selected " to the btn which user clicked

//loop all level-btn => when user cliced the any btn => remove ".level-btn selected " from all btns
// => then add ".level-btn selected " to the btn which user cliced
//same works for posBtns

let statesObj = {};

let correctAnsBtnId = "";
let correctAnsBtn = "";
function changeBtn(levelBtns, posBtns) {
  function changeState(btns) {
    btns.forEach((btn) => {
      btn.addEventListener("click", function () {
        btns.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        //.data.level ==> data-* attribute (data-level= "A1")
        //Optional Chaining (?.) ==> when the user did't select any of the btn=> return undefined
        const levelValue = document.querySelector(".level-btn.selected")
          ?.dataset.level;
        const posValue =
          document.querySelector(".pos-btn.selected")?.dataset.pos;
        statesObj.level = levelValue;
        statesObj.pos = posValue;
        startNextBtn.innerHTML = "START";

        function getCurrentAnsBtns() {
          return document.querySelectorAll(".ans-btn");
        }

        getCurrentAnsBtns().forEach((btn) => {
          btn.textContent = "❓";
          btn.style.backgroundColor = "";
        });

        messageEl.textContent = "";
        displayWordText.textContent = "";

        if (!levelValue || !posValue) {
          if (posValue && !levelValue) {
            displayWordText.textContent = `Please select a CEFR level to focus on ${posValue}s.`;
          } else if (levelValue && !posValue) {
            displayWordText.textContent = `Which part of speech would you like to focus on from the ${levelValue} level?`;
          }
        } else {
          if (posValue === "all") {
            displayWordText.textContent = `Let's explore every ${levelValue}-level word!`;
          } else {
            displayWordText.textContent = `Focusing on ${posValue}s from the ${levelValue} level.`;
          }
          startNextBtn.classList.add("start");

          startNextBtn.classList.remove("next");
          displayListF(wordsList[levelValue]?.[posValue]);
        }
      });
    });
  }
  changeState(levelBtns);
  changeState(posBtns);
}
changeBtn(levelBtns, posBtns);
// getWords(statesObj.level, statesObj.pos);

startBtn.addEventListener("click", function () {
  if (!statesObj.level || !statesObj.pos) {
    alert("Select a level and part of speech to start the quiz.");
    return;
  }
  startNextBtn.classList.remove("start");
  startNextBtn.classList.add("next");
  startNextBtn.innerHTML = "NEXT";

  correctAnsBtnId = "";
  correctAnsBtn = "";
  getWords(statesObj.level, statesObj.pos);
});

let leftList = [];
function getWords(levelValue, posValue) {
  const list = wordsList[levelValue]?.[posValue];
  let getRandomIndex = "";

  getRandomIndex = Math.floor(Math.random() * list.length);
  const ans = list[getRandomIndex];

  leftList = list.filter((list) => list != ans);

  const falseList = list.filter((list) => list != ans);

  displayWordText.innerText = `${ans.word}`;
  renderAnswer(falseList, list[getRandomIndex].english_translation);
}

startNextBtn.addEventListener("click", function () {
  if (leftList.length > 0) {
    getWords(statesObj.level, statesObj.pos);
  } else if (leftList.length === 0) {
    messageEl.textContent = "🎊 Great job! You have completed the quiz!";
  }
});

function renderAnswer(falseList, correctAns) {
  //get random number to dicide which index of btn is correct [0 - 3]
  let randomAnserBtnNum = Math.floor(Math.random() * 4);
  //get all answer btns
  const ansBtnArr = Array.from(ansBtns);
  //FOR each button in the answer buttons:
  ansBtnArr.forEach((btn) => {
    //Clone the button to remove previous event listeners.
    const newBtn = btn.cloneNode(true);
    //Replace the original with the cloned one.
    btn.replaceWith(newBtn);
  });
  //c. Store the new clean buttons in a new array.
  //querySelector => return HTML collection
  const updatedBtns = Array.from(document.querySelectorAll(".ans-btn"));

  //reset the background color of answer btns
  updatedBtns.forEach((btn) => (btn.style.backgroundColor = ""));
  messageEl.textContent = "";
  const correctAnsBtn = updatedBtns[randomAnserBtnNum];
  correctAnsBtn.textContent = correctAns;

  correctAnsBtn.addEventListener("click", () => {
    correctAnsBtn.style.backgroundColor = "#c0f2b0";
    messageEl.textContent = "✅ Correct!";
  });

  const falseBtns = updatedBtns.filter((btn) => btn !== correctAnsBtn);
  for (let i = 0; i < falseBtns.length; i++) {
    // const randomFalseIndex = Math.floor(Math.random() * falseList.length);
    const falseWord = falseList[i % falseList.length].english_translation;
    falseBtns[i].textContent = falseWord;

    falseBtns[i].addEventListener("click", () => {
      falseBtns[i].style.backgroundColor = "#f9b5ac";
      messageEl.textContent = "❌ Try again!";
    });
  }
}

let isDisplay = false;
seeAllWords.addEventListener("click", function () {
  isDisplay = !isDisplay;
  if (isDisplay === false) {
    displayList.style.display = "none";
    searchContainer.style.display = "none";
  } else if (isDisplay === true) {
    displayList.style.display = "block";
    searchContainer.style.display = "flex";
  }
});

function displayListF(list) {
  displayList.innerHTML = "";
  searchContainer.innerHTML = `
          <div id="search">
            <input type="text" id="search-input">
            <button id="search-btn">🔍</button>
          </div>`;

  renderLists(list);

  search(list);
}

function renderLists(list) {
  for (let i = 0; i < list.length; i++) {
    displayList.innerHTML += `                
                <li class="list">
                    <ul>
                        <li><span id="bold">Word in Spanish:</span> ${list[i].word}</li>
                        <li><span id="bold">English translation:</span> ${list[i].english_translation}</li>
                        <li><span id="bold">Example sentence in Spanish:</span> ${list[i].example_sentence_native}</li>
                        <li><span id="bold">Example sentence in English:</span> ${list[i].example_sentence_english}</li>
                    </ul>
                </li>`;
  }
}
//Search

function search(list) {
  const searchBtn = document.querySelector("#search-btn");
  searchBtn.addEventListener("click", function () {
    findMarchWord(list);
  });
}
//[{}.{},]
function findMarchWord(lists) {
  const searchInput = document.querySelector("#search-input");
  const keyword = searchInput.value.trim();
  const regexp = new RegExp(keyword, "gi");
  //check if there is any mached word
  const matchedWord = lists.filter(
    (list) =>
      regexp.test(list.word) ||
      regexp.test(list.english_translation) ||
      regexp.test(list.example_sentence_native) ||
      regexp.test(list.example_sentence_english)
  );

  console.log(lists);
  console.log(matchedWord);

  displayList.innerHTML = "";
  renderLists(matchedWord);
}
