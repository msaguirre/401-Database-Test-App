/*
Michael Aguirre
Database/Content Management System Test Code
Written for CS 401 Spring 2013
*/

$(function(){ initDatabase();

 	// Button and link actions
	$('#clear').click(function(){ dropTables(); });
 	$('#update').click(function(){ updateContent(); });

});
	
function initDatabase() {
	try {
	    if (!window.openDatabase) {
	        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this test');
	    } else {
	        var shortName = 'content.db';
	        var version = '1.0';
	        var displayName = 'content Test';
	        var maxSize = 100000; // in bytes
	        CONTENTDB = openDatabase(shortName, version, displayName, maxSize);
			createTables();
			selectAll();
	    }
	} catch(e) {
	    if (e == 2) {
	        // Version mismatch.
	        console.log("Invalid database version.");
	    } else {
	        console.log("Unknown error "+ e +".");
	    }
	    return;
	} 
}



/***
**** CREATE TABLE ** 
***/
function createTables(){
	CONTENTDB.transaction(
        function (transaction) {
        	transaction.executeSql('CREATE TABLE IF NOT EXISTS text(id INTEGER NOT NULL PRIMARY KEY, body TEXT, section INT);', [], nullDataHandler, errorHandler);
        }
    );
	prePopulate();
}


/***
**** INSERT INTO TABLE ** 
***/
function prePopulate(){
	CONTENTDB.transaction(
	    function (transaction) {
		//Starter data when page is initialized
		var data = ['Whats happenning','3'];  
		
		transaction.executeSql("INSERT INTO text(body, section) VALUES (?, ?)", [data[0], data[1]]);
	    }
	);	
}

/***
**** UPDATE TABLE ** 
***/
function updateContent(){
	CONTENTDB.transaction(
	    function (transaction) {
	    	if($('#body').val() != '') {
	    		var body = $('#body').val();
	    	} else {
	    		var body = 'none';
	    	}
			
			var section    = $('#section').val();

			
	    	
	    	transaction.executeSql("UPDATE text SET body=?, section=? WHERE id = 1", [body, section]);
	    }
	);	
		selectAll();
}
function selectAll(){ 
	CONTENTDB.transaction(
	    function (transaction) {

	        transaction.executeSql("SELECT * FROM text;", [], dataSelectHandler, errorHandler);
	        
	    }
	);	
}

function dataSelectHandler(transaction, results){

	// Handle the results
    for (var i=0; i<results.rows.length; i++) {
        
    	var row = results.rows.item(i);
    	
        var newFeature = new Object();
    	
    	newFeature.body   = row['body'];
        newFeature.section = row['section'];

        
        $('#content').html('<h4 id="body">Say '+ newFeature.body +'</h4>');
        
        $('#greeting').html('Howdy-ho!');
       	 
        
       $('select#section').find('option[value='+newFeature.section+']').attr('selected','selected');


       
    }

}





/***
**** Save 'default' data into DB table **
***/

function saveAll(){
		prePopulate(1);
}


function errorHandler(transaction, error){
 	if (error.code==1){
 		// DB Table already exists
 	} else {
    	// Error is a human-readable string.
	    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
 	}
    return false;
}


function nullDataHandler(){
	console.log("SQL Query Succeeded");
}

/***
**** SELECT DATA **
***/
function selectAll(){ 
	CONTENTDB.transaction(
	    function (transaction) {
	        transaction.executeSql("SELECT * FROM text;", [], dataSelectHandler, errorHandler);
	    }
	);	
}

/***
**** DELETE DB TABLE ** 
***/
function dropTables(){
	CONTENTDB.transaction(
	    function (transaction) {
	    	transaction.executeSql("DROP TABLE text;", [], nullDataHandler, errorHandler);
	    }
	);
	console.log("Table 'text' has been dropped.");
	location.reload();
}

	