# 💃 HolaQuiz

**HolaQuiz** is interactive Spanish vocabulary quiz web app designed to help learners of all levels improve their Spanish-to-English word knowledge. Select your CEFR level, choose a part of speech, and test yourself with multiple-choice questions generated from a large word bank with example sentences!

## 🧠 Demo

<https://holaquiz.netlify.app/>

## ✨ Features

- 📚 **Vocabulary by CEFR level**: A1 to C1
- 🔤 **Filter by part of speech**: Noun, Verb, Adjective, Adverb, or All
- 🧠 **Interactive quiz**: Multiple-choice answers
- 📃 **Word list viewer**: Browse all words with example sentences
- 🔍 **Search feature**: Find words by keyword in Spanish or English

## 🛠️ Tech Stack

- **Frontend**: HTML5 + CSS3 + JavaScript (ES6)
- **Data Source**: JSON vocabulary dataset categorized by CEFR level and part of speech

## How to use

    1. Open the App
    Open the app in your browser:
    👉<https://holaquiz.netlify.app/>

    2. Select CEFR Level
    Choose from A1 to C1 to match your Spanish proficiency level.

    3. Choose Part of Speech
    Pick the type of words you want to learn: noun, verb, adjective, adverb, or all.

    4. Start the Quiz
    Click START to begin. A Spanish word will appear with 4 English options—choose the correct one!

    5. Get Instant Feedback
    - ✅ Green = correct

    - ❌ Red = incorrect

    - Message will show either "Correct!" or "Try again!"

    6. Explore Word List
    Click See all words 🔽 to browse and search the full word bank, including examples.

    7. Restart or Switch Levels Anytime
    You can change level or part of speech anytime and click START to reset.

## ⚙️ Developer Notes

- Data Expansion: You can add more vocabulary to data.json. Each word entry must follow this structure:

```
{
  "word": "palabra",
  "cefr_level": "B2",
  "english_translation": "word",
  "example_sentence_native": "Uso esta palabra a menudo.",
  "example_sentence_english": "I use this word often.",
  "pos": "noun"
}
```

## 🔐 Permissions & Privacy

- No user login is required.

- No external analytics or tracking scripts are used.

- The vocabulary data is stored locally in a static data.json file.

- All interactions stay within the user’s browser session.

## 📂 Project Structure

HolaQuiz/

│

├── index.html # Main HTML file

├── style.css # Styling with Poppins font

├── index.js # Main quiz logic script

├── data.json # Vocabulary data

└── README.md # Project documentation

## 📦 Data Format (data.json)

```
{
  "word": "libro",
  "cefr_level": "A1",
  "english_translation": "book",
  "example_sentence_native": "Leo un libro.",
  "example_sentence_english": "I read a book.",
  "pos": "noun"
}
```

## 📈 Future Ideas

- Add scoring and progress tracking

- Enable pronunciation with speech synthesis

- Add support for English-to-Spanish quizzes

- Save favorite words or export as flashcards

## 🖼️ UI Overview

- A clean and responsive interface built with **HTML**, **CSS**, and **Vanilla JavaScript**
- CEFR level and part-of-speech buttons dynamically control the quiz
- Instant color-coded feedback for answers: ✅ green for correct, ❌ red for incorrect
- View word details including:
  - Spanish word
  - English translation
  - Example sentence in Spanish
  - Example sentence in English
