let length;
let specialChars;
let commonWords;
let useWords;
let onlyNumbers;
let passwordCheck;

function generatePassword(l, sc, cw, uw, on) {
  let password = "";
  let characters;

  if (!on) {
    if (sc) {
      characters =
        " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-+_+{}[],./?~|:;'";
      let test = "lol";
    } else {
      characters =
        " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }
  } else {
    characters = " 1234567890";
  }

  let i = 0;
  while (i < l * 2 - password.length) {
    i++;
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  if (cw || uw.length > 0) {
    let word = words[Math.floor(Math.random() * words.length)];
    while (word.length > password.length) {
      word = words[Math.floor(Math.random() * words.length)];
    }
    if (uw.length > 0) {
      word = uw;
    }
    let min = Math.floor(
      Math.random() * Math.abs(password.length - word.length)
    );
    let replace = password.slice(min, min + word.length);

    i = 0;
    while (i < word.length) {
      i++;

      if (Math.round(Math.random()) == 1) {
        let c = word.charAt(i);
        word = word.replace(c, c.toUpperCase());
      }
    }
    password = password.replace(replace, word);
  }
  let crackTime = "Crack Time : ";
  crackTime +=
    zxcvbn(password).crack_times_display.offline_fast_hashing_1e10_per_second;
  console.log(crackTime);
  document.getElementById("crack-time").innerHTML = crackTime;
  return password;
}

function update() {
  length = document.getElementById("length").value;
  document.getElementById("length-display").innerHTML = length;
  specialChars = document.getElementById("specialChars").checked;
  commonWords = document.getElementById("common-words").checked;
  useWords = document.getElementById("use-words").value;
  document.getElementById("use-words").maxLength = length;
  console.log(document.getElementById("use-words").maxLength);
  onlyNumbers = document.getElementById("only-numbers").checked;
  document.getElementById("output").innerHTML = generatePassword(
    length,
    specialChars,
    commonWords,
    useWords,
    onlyNumbers
  );
}

function updateCheck() {
  passwordCheck = document.getElementById("input").value;
  let display = "Crack Time : ";
  display +=
    zxcvbn(passwordCheck).crack_times_display
      .offline_fast_hashing_1e10_per_second;
  document.getElementById("passwordCheckOutput").innerHTML = display;
}

function copy() {
  navigator.clipboard.writeText(document.getElementById("output").innerHTML);
  alert("Password copied!");
}
