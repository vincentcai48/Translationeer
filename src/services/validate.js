const validate = {
  replaceChars: (word) => {
    var exceptions = [
      "ā",
      "ē",
      "ī",
      "ō",
      "ū",
      "ȳ",
      "ă",
      "ě",
      "ĭ",
      "ŏ",
      "ŭ",
      "Ā",
      "Ē",
      "Ī",
      "Ō",
      "Ū",
      "Ȳ",
      ".",
      ",",
    ];
    var replacements = [
      "a",
      "e",
      "i",
      "o",
      "u",
      "y",
      "a",
      "e",
      "i",
      "o",
      "u",
      "A",
      "E",
      "I",
      "O",
      "U",
      "Y",
      "",
      "",
    ];
    for (var i = 0; i < exceptions.length; i++) {
      word = word.replaceAll(exceptions[i], replacements[i]);
    }
    return word;
  },
};

export { validate };
