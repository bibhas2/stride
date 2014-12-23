window.addEventListener('load', function () {
	function showResult(resultArea, resultText) {
		if (resultText === undefined) {
			resultArea.style.display = "none";

			return;
		}

		resultArea.style.display = "block";
		resultArea.textContent = resultText;
	}

	function execCode(editor, resultArea) {
		var req = new XMLHttpRequest();
		var payload = {
			version: "master",
			optimize: "0",
			code: editor.getValue()
		};
		req.open('POST', "http://play.rust-lang.org/evaluate.json", true);
		req.onload = function(e) {
			if (req.readyState !== 4) {
				return;
			}
			if (req.status === 200) {
				var response = JSON.parse(req.response);

				showResult(resultArea, response.result);
			} else {
				showResult(resultArea, 
					"Request failed with code: " + req.status);
			}
		};
		req.onerror = function(e) {
				showResult(resultArea, 
					"Failed to connect to the Playpen server.");
		}
		req.setRequestHeader("Content-Type", "application/json");
		req.send(JSON.stringify(payload));
		showResult(resultArea, "Please wait...");
	}

function createElements(code) {
		//Create the div for Ace editor	
		var div = document.createElement("div");
		div.style.width = "100%";
		code.parentNode.insertBefore(div, code);

		//Create the editor
		var editor = ace.edit(div);
		editor.setValue(code.textContent.trim(), -1);
		editor.setTheme("ace/theme/tomorrow");
		editor.getSession().setMode("ace/mode/rust");
		editor.setFontSize(24);
		editor.setOptions({ maxLines: Infinity });

		//The result area
		var resultArea = document.createElement("code");
		resultArea.style.display = "none"; //Hide
		code.parentNode.insertBefore(resultArea, code);

		//The reset code button
		var resetBtn = document.createElement("button");
		resetBtn.innerHTML = "Reset";
		resetBtn.className = "reset-button";
		resetBtn.addEventListener("click", function() {
			editor.setValue(code.textContent.trim(), -1);
			showResult(resultArea);
		});
		code.parentNode.insertBefore(resetBtn, resultArea);

		//The run button
		var runBtn = document.createElement("button");
		runBtn.innerHTML = "Run";
		runBtn.className = "run-button";
		runBtn.addEventListener("click", function() {
			execCode(editor, resultArea);
		});
		code.parentNode.insertBefore(runBtn, resetBtn);
}

    function initEditor() {
		var list = document.querySelectorAll("script[language='rust']");

		for (var i = 0; i < list.length; ++i) {
				var code = list[i];
				
				createElements(code);
		}
	}

	initEditor();
});
