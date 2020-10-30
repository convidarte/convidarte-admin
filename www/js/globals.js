var apiBaseUrl = "https://admin.testing.convidarte.com.ar/api/v1";

var token = "";
var tokenExpiration = "";
var adminUserId = "";
var usernameAdmin = "";

var map;
var markers = [];
var groupMarkers = [];
var currentInfoWindow = null;

var onlyUsersWithoutAddress = false;

// divide group
var currentlyDividingGroup = false;
var userRolesNewGroup = {};


function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

