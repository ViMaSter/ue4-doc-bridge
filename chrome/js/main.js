/////////////////
//// GLOBALS ////
/////////////////
var GitHubPath = "https://github.com/EpicGames/UnrealEngine/blob/{branch}/Engine/Source/{file}";

////////////////////
//// VARIABLES /////
////////////////////
var ActiveBranchKey = -1;
var AvailableBranches = [];

var SelectElement;

function InjectHTML() {
	var newRow = $(document.querySelector("#references .normal-row").outerHTML);
		newRow.find(".name-cell p").html("Branch");
		newRow.find(".desc-cell p").html("<select style='margin:0;' id='branch-selector' onchange='SelectChange(this.value)'></select>");
		SelectElement = newRow.find("select");

	$("#references .member-list tbody").prepend(newRow);
}

function SelectChange(value) {
	ActiveBranchKey = value;
	UpdateTable();
}

function RefreshBranchList(events) {
	$.getJSON("https://api.github.com/repos/EpicGames/UnrealEngine/branches?access_token="+GitHubAccessToken, function (result) {
		AvailableBranches = [];

		result.forEach(function(item) {
			if (Object.keys(item).indexOf("name") >= 0) {
				AvailableBranches.push(item);
			}

			if (item.name == "release") {
				ActiveBranchKey = AvailableBranches.length - 1;
			}
		});

		events();
	});
}

function UpdateHTML() {
	for (var i = 0; i < AvailableBranches.length; i++) {
		SelectElement.append("<option value='{1}'{2}>{0}</option>".format(AvailableBranches[i].name, i, (i == ActiveBranchKey) ? " selected='selected'" : ""));
	}
}

function UpdateTable() {
	$("#references .member-list > table tr").each(function (index, row) {
		switch($(row).find(".name-cell").text().toLowerCase().trim()) {
			case "header":
				var filename = $(row).find(".desc-cell").text().trim();
				var newRow = $(document.querySelector(".normal-row").outerHTML);
					newRow.find(".name-cell").html("<p></p>");
					newRow.find(".desc-cell").html("<p></p>");
			case "source":
				var filename = $(row).find(".desc-cell").text().trim();
				var path = GitHubPath.format({
					"branch": AvailableBranches[ActiveBranchKey].name,
					"file": filename
				});

				$(row).find(".desc-cell").html("<a href='{1}' target='_blank'>{0}</a>".format(filename, path));
				break;
		}
	});
}

function InitTool() {
	InjectHTML();

	RefreshBranchList(function () {
		UpdateHTML();
		UpdateTable();
	});
}

InitTool();