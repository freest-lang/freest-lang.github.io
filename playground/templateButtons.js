const code = ["main : ()\nmain = putStrLn \"Hello world!\"",
              "temp2", 
              "temp3"];

var editor = getEditor("textEditor");

document.querySelectorAll(".templatebtn").forEach((el, i) => {
  el.addEventListener('click', function () {
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: code[i] }
    });
  });
});