function get_color_dictionary() {
  if (!get_color_dictionary.dict) {
    get_color_dictionary.dict = {};
  }

  return get_color_dictionary.dict;
}

function get_random_color() {
  let characters = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];

  let result = "#";

  for (let i = 0; i < 6; i++) {
    result += characters[Math.floor(Math.random() * 16)];
  }

  return result;
}

function get_name_span(name) {}
