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
  //reset the background color of answer btns
  ansBtns.forEach((btn) => (btn.style.backgroundColor = ""));

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

  displayListF(list);
  const falseList = list.filter((list) => list != ans);

  displayWordText.innerText = `${ans.word}`;
  renderAnswer(falseList, list[getRandomIndex].english_translation);
}

startNextBtn.addEventListener("click", function () {
  if (startNextBtn.classList.contains("next")) {
    hasCorrect = false;
  }
  if (leftList > 0) {
    getWords(levelValue, posValue);
  } else {
    answerContainer.innerHTML = "<p>Completed!</p>";
  }
});

let hasCorrect = false;
function renderAnswer(falseList, correctAns) {
  let randomAnserBtnNum = Math.floor(Math.random() * 4 + 1);
  const ansBtnArr = Array.from(ansBtns);
  correctAnsBtnId = ansBtnArr
    .map((btn) => btn.id)
    .find((i) => Number(i) === Number(randomAnserBtnNum));
  correctAnsBtn = document.getElementById(`${correctAnsBtnId}`);
  correctAnsBtn.innerHTML = correctAns;

  const falseBtns = ansBtnArr.filter((btn) => btn != correctAnsBtn);
  for (let i = 0; i < falseBtns.length; i++) {
    const randomFalseIndex = Math.floor(Math.random() * falseList.length);
    falseBtns[i].innerHTML = falseList[randomFalseIndex].english_translation;

    falseBtns[i].addEventListener("click", function () {
      falseBtns[i].style.backgroundColor = "red";
      alert("Your answer is incorrect! Try again!");
    });
  }

  correctAnsBtn.addEventListener("click", function () {
    correctAnsBtn.style.backgroundColor = "yellow";
    hasCorrect = true;
    alert("Correct!");
  });
  if (hasCorrect === true) {
    nextBtn();
  }
}

let isDisplay = false;
seeAllWords.addEventListener("click", function () {
  isDisplay = !isDisplay;
  if (isDisplay === false) {
    displayList.style.display = "none";
  } else if (isDisplay === true) {
    displayList.style.display = "block";
  }
});

function displayListF(list) {
  for (let i = 0; i < list.length; i++) {
    displayList.innerHTML += `                
                <li>
                    <ul>
                        <li>Word in Spanish: ${list[i].word}</li>
                        <li>English translation: ${list[i].english_translation}</li>
                        <li>Example sentence in Spanish: ${list[i].example_sentence_native}</li>
                        <li>Example sentence in English: ${list[i].example_sentence_english}</li>
                    </ul>
                </li>`;
  }
}
