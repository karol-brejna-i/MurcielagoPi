var __debug_no_server = false;

var states = {}

function handler(key, onoff, action, action_args, event) {
  if (states[key].isPressed != onoff) {
    var bid = states[key].btnId;
    console.log(bid + (onoff ? ' pressed' : '   released'));


    console.log("call macro: " + action + "/" + action_args);
    if (!__debug_no_server) webiopi().callMacro(action, action_args);

    // zmień stan przycisku
    $("#"+bid).button('toggle');
    // zapamiętaj że został już wciśnięty/puszczony
    states[key].isPressed = onoff;
  }
};

var dirs = ["left", "right", "up", "down"];

for (var i in dirs) {
  var key = dirs[i];
  states[key] = {btnId: "btn_"+key, isPressed: false, macro:"macro_"+key};
  console.log(key + " - " + states[key].btnId);

  states[key].onPress =   handler.bind(this, key, true,  states[key].macro, "on");
  states[key].onRelease = handler.bind(this, key, false, states[key].macro, "off");
  $("#"+states[key].btnId).mousedown(states[key].onPress);
  $("#"+states[key].btnId).mouseup(states[key].onRelease);
  KeyboardJS.on(key, states[key].onPress, states[key].onRelease);
}

$(document).ready(function() {
  if (!__debug_no_server) webiopi("http://localhost:8080/").init();
});
