var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(
    blocklyDiv,
    {toolbox: document.getElementById('toolbox'),
    zoom:{
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    trashcan: true
});
var myInterpreter = null;
var editor = ace.edit("editor");
var highlightPause = false;

editor.$blockScrolling = Infinity;
editor.session.setMode("ace/mode/javascript");
workspace.addChangeListener(updateCode);
window.addEventListener('resize', onresize, false);
onresize();

function initApi(interpreter, scope) {
  // Add an API function for the alert() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(alert(text));
  };
  interpreter.setProperty(scope, 'alert',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the prompt() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(prompt(text));
  };
  interpreter.setProperty(scope, 'prompt',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for highlighting blocks.
  var wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(highlightBlock(id));
  };
  interpreter.setProperty(scope, 'highlightBlock',
      interpreter.createNativeFunction(wrapper));
}

function highlightBlock(id) {
  workspace.highlightBlock(id);
  highlightPause = true;
}

function parseCode() {
  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  myInterpreter = new Interpreter(code, initApi);

  alert('Ready to execute this code:\n\n' + code);
  document.getElementById('stepButton').disabled = '';
  highlightPause = false;
  workspace.traceOn(true);
  workspace.highlightBlock(null);
}

function stepCode() {
  try {
    var ok = myInterpreter.step();
  } finally {
    if (!ok) {
      // Program complete, no more code to execute.
      document.getElementById('stepButton').disabled = 'disabled';
      return;
    }
  }
  if (highlightPause) {
    // A block has been highlighted.  Pause execution here.
    highlightPause = false;
  } else {
    // Keep executing until a highlight statement is reached.
    stepCode();
  }
}

function updateCode() {
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  editor.setValue(code);
}
function onresize(e) {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
};
