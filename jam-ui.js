
var jamEditor;

function setup() {
  // editor setup
  jamEditor = ace.edit("in");
  jamEditor.setAutoScrollEditorIntoView(true);
  jamEditor.setTheme("ace/theme/crimson_editor");
  jamEditor.session.setMode("ace/mode/jam");
  jamEditor.$blockScrolling = Infinity;
  // query string input handling
  var query = location.search.substr(1);
  var defs = query.split("&");
  var params = $.map(defs, function(x) { return [x.split("=")] });
  for (var i=0; i<params.length; i++) {
    var key = params[i][0];
    var value = decodeURIComponent(params[i][1]);
    switch (key) {
      case "src":
        jamEditor.setValue(value, 1);
        break;
      case "gist":
        loadGist(value);
        break;
      case "jam":
        $("#project").val(value);
        break;
      case "transform":
        $("#transformation").val(value);
        break;
      case "callc":
        $("#calling_convention").val(value);
        break;
      case "consc":
        $("#cons_convention").val(value);
        break;
      case "assoc":
        $("#associativity").val(value);
        break;
      case "list-limit":
        $("#list_limit").val(value);
        break;
    }
  }
  $("#project").change(reset_project_options);
  reset_project_options();
}

function transform_enabled() {
  return !$("#transformation").prop("disabled");
}

function type_inference_enabled() {
  return !$("#type_variant").prop("disabled");
}

function reset_project_options() {
  var options = [
      {project: "p5xc", elementID: "#type_variant"},
      {project: "p6", elementID: "#transformation"}
  ];
  var someTransformEnabled = false;
  $.each(options, function (index, target) {
    var enable = $("#project").val() == target.project;
    var $x = $(target.elementID);
    $x.prop("disabled", !enable);
    enable ? $x.show() : $x.hide();
    someTransformEnabled = someTransformEnabled || enable;
  });
  var $button = $("#transform");
  someTransformEnabled ? $button.show() : $button.hide();
}

function saveToURL() {
  var params = [
      ['jam',   $("#project").val()],
      ['callc', $("#calling_convention").val()],
      ['consc', $("#cons_convention").val()],
      ['assoc', $("#associativity").val()],
      ['list-limit', $("#list_limit").val()],
      ['src',   jamEditor.getValue()]
  ];
  if (transform_enabled()) {
    var src = params.pop();
    params.push(['transform', $("#transformation").val()], src);
  }
  else if (type_inference_enabled()) {
    var src = params.pop();
    params.push(['typing', $("#type_variant").val()], src);
  }
  var paramString = $.map(params, function (kv) {
    return kv[0] + "=" + encodeURIComponent(kv[1]);
  }).join("&");
  location.search = paramString;
}

function call_with_opts(f) {
  var program = jamEditor.getValue();
  var p = $("#project").val();
  jam_lang.compat.set_property("jam.preset", p);
  var callc = $("#calling_convention").val();
  var consc = $("#cons_convention").val();
  var assoc = $("#associativity").val();
  var list_limit = $("#list_limit").val() || "Infinity";
  var transform = transform_enabled() ? $("#transformation").val() : "";
  var typing = type_inference_enabled() ? $("#type_variant").val() : "";
  var result;
  var $out = $("#out");
  $out.val("");
  try {
    result = f(program, "call-c", callc, "cons-c", consc,
        "assoc", assoc, "list-limit", list_limit,
        "transform", transform, "typing", typing);
  }
  catch (e) {
    result = e;
  }
  $out.val(result);
}

function jam_parser() {
  call_with_opts(jam_lang.core.parse);
}

function jam_runner() {
  call_with_opts(jam_lang.core.run);
}

function jam_transformer() {
  call_with_opts(jam_lang.core.transform);
}

function loadGist(gist) {
  var url = "https://gist.githubusercontent.com/"+gist+"/raw/";
  $.get(url, function (text) {
    jamEditor.setValue(text, 1);
  });
}
