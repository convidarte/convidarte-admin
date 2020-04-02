var apiBaseUrl = "https://admin.convidarte.com.ar/api/v1";

var token = "";
var tokenExpiration = "";
var adminUserId = "";
var usernameAdmin = "";

var currentTab="";

var groups =[];
var users =[];
var neighborhoodList = [];

var map;
var markers = [];
var groupMarkers = [];

var currentGroupId=0;
var currentUserId=0;

var onlyUsersWithoutAddress = false;

// Pagination
var numberPages = 0;
var currentPage = 0;
var rowsPerPage = 15;

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
