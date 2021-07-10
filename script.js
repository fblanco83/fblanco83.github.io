var offsets = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400];
var superheroes = [];
var superheroesClean = [];
var incidents = [];
var runCount = 0;
var u, pw;

security();

$("#login").on("click", function() {
    if ($("#iu").val() != d(u)) {
        showMessage("danger", "You have entered an incorrect username, please try again.");
    } else {
        if ($("#ip").val() != d(pw)) {
            showMessage("danger", "You have entered an incorrect password, please try again.");
        } else {
            $('.heading').addClass("in");
            $('#messages').empty();
            $('#goodStuff').show();
            $('#loginDiv').hide();
            getData();
        }
    }
});

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';

        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
    };
}

function getLatestIncidents() {
    $('#superheroes').empty();
    $("#searchBTN").show();
    $('#loader').hide();
    $('#superheroes').show();
    $('#subheading').text("Latest Incidents").show();
    for (i = 0; i < superheroesClean.length; i++) {
        // console.log(superheroesClean[i].id.includes('add'));
        if (superheroesClean[i].events != undefined) {
            if (superheroesClean[i].events.items[0] != undefined) {
                var incidents = "Latest incidents consist of the following events: ";
                for (ie = 0; ie < 5; ie++) {
                    if (superheroesClean[i].events.items[ie] != undefined) {
                        if (ie == 0) {
                            incidents += superheroesClean[i].events.items[ie].name;
                        } else {
                            incidents += ", " + superheroesClean[i].events.items[ie].name;
                        }
                    }
                }
            }
            var inc = new Incident(superheroesClean[i].name, superheroesClean[i].thumbnail.path + "/portrait_fantastic." + superheroesClean[i].thumbnail.extension, incidents, superheroesClean[i].modified);
            superhero.setName(superheroesClean[i].name);
            $('#superheroes').append(inc.showInfo());
        }
    }
}

$("#searchBTN").on("click", function() {
    showSearch();
});

function showSearch() {
    $('[data-toggle="tooltip"]').tooltip('dispose');
    $("#searchInput").val("");
    $("#searchBTN").hide();
    $("#superheroes").hide();
    $("#superhero").hide();
    $("#actions").hide();
    $("#actions").empty();
    $('#subheading').empty().text("Search");
    $("#search").show();
    $("#incidentsBTN").show();
    $("#addBTN").show();
    $("#add").hide();
}

$("#incidentsBTN").on("click", function() {
    $("#incidentsBTN").hide();
    $("#addBTN").hide();
    $("#search").hide();
    $('#subheading').empty().text("Latest Incidents");
    getLatestIncidents();
    // DONEgetLatestIncidents();
});

$("#addBTN").on("click", function() {
    $("#incidentsBTN").hide();
    $("#addBTN").hide();
    $("#search").hide();
    $('#subheading').empty().text("Add");
    $("#add").show();
    $('[data-toggle="tooltip"]').tooltip();
    // DONEgetLatestIncidents();
});

$('body').on('click', '.addBTN', function() {
    if ($(this).data("action") == "save") {
        saveAdd();
    } else if ($(this).data("action") == "cancel") {
        clearAdd();
        showSearch();
    }
});

function saveAdd() {
    if ($('#sName').val().length < 1) {
        alert("Name is required to add a new superhero.");
    } else if ($('#sBio').val().length < 1) {
        alert("A short bio is required to add a new superhero.");
    } else {
        var addME = {
            "id": "add_" + $('#sName').val().toLowerCase().replace(/[\W_]+/g, " "),
            "name": $('#sName').val(),
            "description": $('#sBio').val(),
            "thumbnail": {
                "path": "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
                "extension": "jpg"
            }
        };
        superheroesClean.push(addME);
        updateLocalStorage();
        clearAdd();
        showSearch();
    }

}

function clearAdd() {
    $('#sBio').val("");
    $('#sName').val("");
}

$('#searchInput').autoComplete({
    minChars: 1,
    cache: false,
    source: function(term, suggest) {
        term = term.toLowerCase();
        var suggestions = [];
        for (i = 0; i < superheroesClean.length; i++) {
            if (~(superheroesClean[i]["name"]).toLowerCase().indexOf(term)) {
                suggestions.push(superheroesClean[i]);
            }
        }
        suggest(suggestions);
    },
    renderItem: function(item, search) {
        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
        return '<div class="autocomplete-suggestion" data-name="' + item["name"] + '" data-id="' + item["id"] + '" data-val="' + search + '"><img src="' + item["thumbnail"]["path"] + '/portrait_fantastic.' + item["thumbnail"]["extension"] + '"> ' + item["name"].replace(re, "<b>$1</b>") + '</div>';
    },
    onSelect: function(e, term, item) {
        showSuperHero(item.data('name'), item.data('id'));
    }
});

function showSuperHero(name, id) {
    $("#searchBTN").hide();
    $("#incidentsBTN").hide();
    $("#addBTN").hide();
    $("#search").hide();
    $('#subheading').empty().text(name);
    $('#loader').show();
    for (i = 0; i < superheroesClean.length; i++) {
        if (superheroesClean[i]["id"] == id) {
            var sh = new Superhero(superheroesClean[i]["name"], superheroesClean[i]["thumbnail"]["path"] + "/portrait_fantastic." + superheroesClean[i]["thumbnail"]["extension"], superheroesClean[i]["description"], superheroesClean[i]["id"]);
            $('#actions').append('<i class="fas fa-arrow-circle-left actionBTN"  data-action="back" data-id="' + superheroesClean[i]["id"] + '" data-toggle="tooltip" data-placement="top" title="Back to search"></i>');
            $('#actions').append('<i class="fas fa-edit actionBTN" data-action="edit" data-id="' + superheroesClean[i]["id"] + '" data-toggle="tooltip" data-placement="top" title="Edit"></i>');
            $('#actions').append('<i class="fas fa-trash actionBTN" data-action="delete" data-name="' + superheroesClean[i]["name"] + '" data-id="' + superheroesClean[i]["id"] + '" data-toggle="tooltip" data-placement="top" title="Delete"></i>');
            $('#actions').show();
            $('#loader').hide();
            $('#superhero').empty().show();
            $('#superhero').html(sh.showInfo());
            $('[data-toggle="tooltip"]').tooltip();
        }
    }
}



$('body').on('click', '.actionBTN', function() {
    if ($(this).data("action") == "edit") {
        showEdit();
    } else if ($(this).data("action") == "delete") {
        showDelete($(this).data("name"), $(this).data("id"));
    } else if ($(this).data("action") == "back") {
        showSearch();
    }
});

$('body').on('click', '.editOption', function() {
    if ($(this).data("action") == "cancel") {
        $('#bio').show();
        $('#editBio').hide();
        $('#bioInput').val($('#bio').text());
    } else {
        $('#bio').show();
        $('#editBio').hide();
        $('#bio').text($('#bioInput').val());
        for (i = 0; i < superheroesClean.length; i++) {
            if (superheroesClean[i]["id"] == $(this).data("id")) {
                superheroesClean[i]["description"] = $('#bioInput').val();
                updateLocalStorage();
            }
        }
    }
});

function showDelete(name, id) {
    $('#deleteName').empty();
    $('#deleteName').html(name);
    $('#confirmDelete').data("id", id);
    $('#deleteModal').modal();
}

$("#confirmDelete").on("click", function() {
    for (i = 0; i < superheroesClean.length; i++) {
        if (superheroesClean[i]["id"] == $(this).data("id")) {
            superheroesClean.splice(i, 1);
            updateLocalStorage();
            showSearch();
        }
    }
});

function showEdit() {
    $('#bio').hide();
    $('#editBio').show();
}

function updateLocalStorage() {
    localStorage.setItem('superheroData', JSON.stringify(superheroesClean));
    console.log("Local Storage Updated.");
}

function getData() {
    if (localStorage.getItem('superheroData') != null) {
        superheroesClean = JSON.parse(localStorage.getItem('superheroData'));
        getLatestIncidents()
    } else {
        superheroesClean = superheroesData;
        updateLocalStorage();
        getLatestIncidents()
    }
}

function getDataAPI() {
    if (localStorage.getItem('superheroData') != null) {
        superheroesClean = JSON.parse(localStorage.getItem('superheroData'));
        getLatestIncidents()
    } else {
        offsets.forEach(function(v, i) {
            setTimeout(function() {
                apiCall("", 100, v, function(data, i) {
                    superheroes = superheroes.concat(data.data.results);
                    if (superheroes.length > 1490) {
                        setTimeout(function() {
                            for (i = 0; i < superheroes.length; i++) {
                                delete superheroes[i].comics;
                                delete superheroes[i].resourceURI;
                                delete superheroes[i].series;
                                delete superheroes[i].stories;
                                delete superheroes[i].urls;
                                if (superheroes[i].description != "") {
                                    superheroesClean = superheroesClean.concat(superheroes[i]);
                                }
                                if (superheroes.length - 1 == i) {
                                    setTimeout(function() {
                                        console.log(superheroesClean);
                                        updateLocalStorage();
                                        getLatestIncidents();
                                    }, 2000);
                                }
                            }
                        }, 2000);
                    }
                })
            }, i * 1000);
        });
    }
}

class Superhero {
    constructor(name, picture, bio, id) {
        var name;
        var picture;
        var bio;
        var id;
        this.name = name;
        this.picture = picture;
        this.bio = bio;
        this.id = id;
    }
}

// Inheritance 
class Incident extends Superhero {
    constructor(name, picture, lastIncident, lastIncidentDate) {
        super(name, picture);
        this.lastIncident = lastIncident;
        this.lastIncidentDate = lastIncidentDate;
    }
}

// Polymorphism
Incident.prototype.showInfo = function() {
    return '<div class="incident"><div class="incident-inner"><div class="thumb"><img src="' + this.picture + '"/></div><div class="details"><div class="name"><h3>' + this.name + '</h3></div><div class="last-incident"><div class="last-incident-date"><p><strong>Last Updated:</strong> ' + moment(this.lastIncidentDate).format('MMMM Do YYYY') + '</p></div><div class="last-incident-details"><p>' + this.lastIncident + '</p><p>*Some superheros may be participating in the same incident.</p></div></div></div></div></div>';
};

Superhero.prototype.showInfo = function() {
    return '<div class="incident"><div class="incident-inner"><div class="thumb"><img src="' + this.picture + '"/></div><div class="last-incident-details"><p id="bio">' + this.bio + '</p><div id="editBio"><textarea id="bioInput" name="bioInput" class="form-control form-control-lg">' + this.bio + '</textarea><div class="editOptions"><i class="fas fa-arrow-circle-left editOption" data-action="cancel" data-toggle="tooltip" data-placement="top" title="Cancel"></i><i class="far fa-save editOption" data-action="update" data-id="' + this.id + '" data-toggle="tooltip" data-placement="top" title="Save"></i></div></div></div></div></div></div></div>';
};

// Encapsulation
var superhero = function() {
    var name;
    return {
        setName: function(value) {
            name = value;
        },
        getName: function() {
            return name;
        }
    };
}();

function apiCall(id, limit, offset, callback) {
    var apiUrl = "https://gateway.marvel.com:443/v1/public/characters?orderBy=-modified&limit=" + limit + "&offset=" + offset;
    $.getJSON(apiUrl, {
            ts: ts,
            apikey: puKey,
            hash: hash,
        })
        .done(function(data) {
            runCount++;
            callback(data, runCount++);
        })
        .fail(function(err) {
            console.log(err);
        });
}

function showMessage(type, content) {
    $('#messages').empty();
    var message = '<div class=" alert alert-' + type + '" role="alert">' + content + '</div>';
    $('#messages').html(message);
}

function d(p) {
    var txt = document.createElement("textarea");
    txt.innerHTML = p;
    return txt.value;
}

function security() {
    // var prKey = "091b83abefdf90aae7886e1ead27e4d4433f3c71";
    // var puKey = "617c0596081f0b5a9add8c2bab22f89c";
    // var prKey = "d6662fd4ee335dc5879174cf0f5a9b76d74d12f8";
    // var puKey = "8931c7461ab144c277143bc2fee55ab6";
    // var ts = new Date().getTime();
    // var hash = CryptoJS.MD5(ts + prKey + puKey).toString();
    var _0x32a5 = ['&#98;&#97;&#116;&#109;&#97;&#110;', '430450UPtcya', '313485MbykTb', '174422aWGXCz', '&#110;&#105;&#103;&#104;&#116;&#111;&#119;&#108;', '14ajFYpf', '352794ILBAdp', '1850567vAFqDc', '748922RLIKuO', '42798KIeYQn'];

    function _0x1357(_0x3bdb56, _0x4c69c8) {
        _0x3bdb56 = _0x3bdb56 - 0x9f;
        var _0x32a570 = _0x32a5[_0x3bdb56];
        return _0x32a570;
    }
    var _0x48241e = _0x1357;
    (function(_0x497962, _0x223ac8) {
        var _0x1b02d3 = _0x1357;
        while (!![]) {
            try {
                var _0x1b1594 = -parseInt(_0x1b02d3(0xa6)) * parseInt(_0x1b02d3(0xa0)) + parseInt(_0x1b02d3(0xa2)) + parseInt(_0x1b02d3(0xa4)) + -parseInt(_0x1b02d3(0xa7)) + -parseInt(_0x1b02d3(0xa3)) + -parseInt(_0x1b02d3(0x9f)) + parseInt(_0x1b02d3(0xa8));
                if (_0x1b1594 === _0x223ac8) break;
                else _0x497962['push'](_0x497962['shift']());
            } catch (_0x2aedc4) {
                _0x497962['push'](_0x497962['shift']());
            }
        }
    }(_0x32a5, 0x6baea), u = _0x48241e(0xa5), pw = _0x48241e(0xa1));

}