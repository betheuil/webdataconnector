(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
    
    // Init function for connector, called during every phase
    myConnector.init = function(initCallback) {
      tableau.authType = tableau.authTypeEnum.basic;
      initCallback();
    }

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "companynumber",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "name",
            alias: "Name",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "companies",
            alias: "Full Company Information Report",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://gateway.perfectinfo.com/sd-api/v1/companies/02758652", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].id,
                    "mag": feat[i].properties.mag,
                    "title": feat[i].properties.title,
                    "location": feat[i].geometry
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Perfect Information Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
