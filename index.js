// Entry point: asynchronously fetch data from JSON and initialize the quiz
async function init() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("There was a problem with the API");
    }
    const data = await response.json();

    setupQuiz(data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

init(); // Call the init function

// --------------------------------------------------
// Initialize the quiz functionality with loaded data
function setupQuiz(data) {
  const levels = data.map(function (d) {
    return d.cefr_level;
  });
  // Extract unique CEFR levels and categorize words by level and part of speech
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

  // Element references
  const levelBtns = document.querySelectorAll(".level-btn");
  const posBtns = document.querySelectorAll(".pos-btn");
  const startNextBtn = document.getElementById("start-next-btn");
  const startBtn = document.querySelector(".start");
  const ansBtns = document.querySelectorAll(".ans-btn");
  const seeAllWords = document.getElementById("see-all-words");
  const displayWordText = document.getElementById("display-word-text");
  const displayList = document.getElementById("display-list");
  const searchContainer = document.getElementById("search-container");
  const messageEl = document.getElementById("message");

  //when user clicked the btn, remove ".level-btn selected" (alreday cliced btn),
  // and then add ".level-btn selected " to the btn which user clicked

  //loop all level-btn => when user cliced the any btn => remove ".level-btn selected " from all btns
  // => then add ".level-btn selected " to the btn which user cliced
  //same works for posBtns

  // Stores current selected level and part of speech
  let statesObj = {};

  // ------------------ Handle CEFR level and POS button states ------------------
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
          // Reset the answer buttons and display
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

  // ------------------ Start quiz logic ------------------
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

  function getWords(levelValue, posValue) {
    const list = wordsList[levelValue]?.[posValue];
    let getRandomIndex = "";

    getRandomIndex = Math.floor(Math.random() * list.length);
    const ans = list[getRandomIndex];
    const falseList = list.filter((list) => list != ans);

    displayWordText.innerText = `${ans.word}`;
    renderAnswer(falseList, list[getRandomIndex].english_translation);
  }

  // ------------------ Render multiple choice answers ------------------
  function renderAnswer(falseList, correctAns) {
    //get random number to dicide which index of btn is correct [0 - 3]
    let randomAnserBtnNum = Math.floor(Math.random() * 4);
    const ansBtnArr = Array.from(ansBtns);

    // Clean up previous event listeners
    ansBtnArr.forEach((btn) => {
      //Clone the button to remove previous event listeners.
      const newBtn = btn.cloneNode(true);
      //Replace the original with the cloned one.
      btn.replaceWith(newBtn);
    });
    //Store the new clean buttons in a new array.
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
      const randomFalseIndex = Math.floor(Math.random() * falseList.length);
      const falseWord = falseList[randomFalseIndex].english_translation;
      falseBtns[i].textContent = falseWord;

      falseBtns[i].addEventListener("click", () => {
        falseBtns[i].style.backgroundColor = "#f9b5ac";
        messageEl.textContent = "❌ Try again!";
      });
    }
  }

  // ------------------ Toggle word list display ------------------
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

  // ------------------ Display word list with search ------------------
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

  // ------------------ Word search logic ------------------
  function search(list) {
    const searchBtn = document.querySelector("#search-btn");
    searchBtn.addEventListener("click", function () {
      findMarchWord(list);
    });
  }

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
}
