const SKY_HASH = "AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ";
const CONTENT_SKY_HASK = '{"filename":"consensus.json"}';

function checkIsOnline(portal_url) {
    let requestPortalSkyHash = new XMLHttpRequest();
    requestPortalSkyHash.open('HEAD', portal_url + "/" + SKY_HASH);
    let startTime = (new Date()).getTime();
    requestPortalSkyHash.send();
    requestPortalSkyHash.onload = function () {

        console.debug(portal_url, this.readyState, requestPortalSkyHash.status, requestPortalSkyHash.getAllResponseHeaders(), requestPortalSkyHash.getResponseHeader("skynet-file-metadata"));

        if (this.readyState === 4 && requestPortalSkyHash.status === 200) {   
            let endTime = (new Date()).getTime();
            document.getElementById(portal_url + "-duration").innerHTML = endTime - startTime;
            if(requestPortalSkyHash.getResponseHeader("skynet-file-metadata") === CONTENT_SKY_HASK) {
                document.getElementById(portal_url + "-online").innerHTML = '&#9989;';
            }
            else {
                document.getElementById(portal_url + "-online").innerHTML = '&#128337;';
            }
        }
        else {
            document.getElementById(portal_url + "-online").innerHTML = '&#10060;';
        }
    };
}

function checkPortals(portals) {
    document.getElementById('checker').innerHTML = '';
    let html = "";
    for(let i=0; i < portals.length; ++i) {
        if((i + 1) % 2 === 0) {
            html += "<tr class=\"pure-table-odd\">";
        }
        else {
            html += "<tr>";
        }						
        html += "<td>" + portals[i].portal_url + "</td>";
        html += "<td id=\"" + portals[i].portal_url + "-online\">" + "&#128337;" + "</td>";
        html += "<td id=\"" + portals[i].portal_url + "-duration\">" + "&#128337;" + "</td>";
        html += "<td>" + (portals[i].portal_upload_path ? "&#9989;" : "&#10060") + "</td>";
        html += "<td>" + portals[i].comment + "</td>";
        html += "</tr>";

        checkIsOnline(portals[i].portal_url);
    }
    
    document.getElementById('checker').innerHTML = html;
}

function fetchPortals() {
    let requestPortalsList = new XMLHttpRequest();
    requestPortalsList.open('GET', "./portals.json");
    requestPortalsList.send();
    requestPortalsList.onload = function () {
        if (this.readyState === 4 && (requestPortalsList.status === 200 || requestPortalsList.status === 304)) {
            let portals = JSON.parse(requestPortalsList.responseText);
            checkPortals(portals);
        }
    };
}

fetchPortals();