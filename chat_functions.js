function get_color_dictionary() {
  if (!get_color_dictionary.dict) {
    get_color_dictionary.dict = {};
  }

  return get_color_dictionary.dict;
}

function get_random_color() {
  let characters = ["6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

  let result = "#";

  for (let i = 0; i < 6; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }

  return result;
}

function get_name_color(name) {
  let name_dict = get_color_dictionary();
  if (name in name_dict) {
    return name_dict[name];
  } else {
    let color = get_random_color();
    name_dict[name] = color;
    return color;
  }
}

function handle_message_string(text) {
  const opcode = text.substring(0, 1);
  const payload = text.substring(1);
  if (opcode && payload) {
    try {
      const payload_object = JSON.parse(payload);
      handle_message(opcode, payload_object);
    } finally {
    }
  }
}

function handle_chat_line(payload, bold) {
  append_message(payload.u, payload.t, payload.m, bold);
}

function handle_message(opcode, payload_object) {
  const handlers = {
    m: (object_data) => handle_chat_line(object_data, false),
    M: (object_data) => handle_chat_line(object_data, true),
  };

  if (opcode in handlers) {
    handlers[opcode](payload_object);
  }
}

function get_time_span(timestamp) {
  let span = document.createElement("span");
  span.style.fontWeight = "bold";
  let datestring = "[" + new Date(timestamp).toLocaleTimeString() + "]";
  span.appendChild(document.createTextNode(datestring));
  return span;
}

function get_name_span(name) {
  let color = get_name_color(name);
  let span = document.createElement("span");
  span.style.color = color;
  span.style.fontWeight = "bold";
  span.appendChild(document.createTextNode("[" + name + "]"));
  return span;
}

function get_message_span(message, bold) {
  let span = document.createElement("span");
  if (bold === true) {
    span.style.fontWeight = "bold";
  }
  span.appendChild(document.createTextNode(" " + message));
  return span;
}

function get_message_div(name, timestamp, message, bold) {
  let div = document.createElement("div");
  div.appendChild(get_time_span(timestamp));
  div.appendChild(get_name_span(name));
  div.appendChild(get_message_span(message, bold));
  return div;
}

function append_message(name, timestamp, message, bold) {
  let output = document.getElementById("response");
  output.appendChild(get_message_div(name, timestamp, message, bold));
}
