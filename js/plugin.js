Blockly.Blocks['type_of'] = {
  init: function() {
    this.appendValueInput("object")
        .setCheck(null)
        .appendField("typeOf");
    this.setOutput(true, "String");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['type_of'] = function(block) {
  var value_object = Blockly.JavaScript.valueToCode(block, 'object', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'typeof ' + value_object;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
