var apiBaseUrl = "https://testing.convidarte.com.ar/api/v1";

var token = "";
var tokenExpiration = "";
var adminUserId = "";
var usernameAdmin = "";

var currentTab="";

var groups =[];
var allUsers =[]; // todos los usuarios
var users =[]; // se llama users pero es una lista de usuarios con sus roles (filtrada por barrio, etc)
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
