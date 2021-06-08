// Liner 0.8
// Lamma Studio Design
// 12-5-2021

// Changelog
// 0.1 Initial release
// 0.2 Get Specific on page
// 0.3 Group things up if they need it and then ungroup if they need it
// 0.4 Get specific about grouped things
// 0.5 Don't create the line until late
// 0.6 Check for nothingness
// 0.7 Tint of black instead of swatch reliance - reorganisation of lots of ifs into cases 
// 0.8 Make sure spacing is done in mm. Reorg to make editing line space, thickness, colour, tint easy.  


liner ();

function liner(){
	try {
///////////////////////////////////////////////////////////////////
////////////////////// EDIT LINE THINGS HERE //////////////////////
///////////////////////////////////////////////////////////////////

//Space to left line in mm 
		var lspc = 2;
//Line weight for left line in pts
        var lwt = 0.3;
//Color name, spec & tint for left line
		var lcol = "Black";
		var lcolspec = [0,0,0,100];
        var ltnt = 100;

//Space to right line in mm 
		var rspc = 2;
//Line weight for right line in pts
        var rwt = 0.3;
//Color name, spec & tint for right line
		var rcol = "Black";
		var rcolspec = [0,0,0,100];
        var rtnt = 100;

//Space from top line in mm 
		var tspc = 3.422;
//Line weight for top line in pts
        var twt = 4.4;
//Color name, spec & tint for top line
		var tcol = "C\=0 M\=0 Y\=0 K\=40";
 		var tcolspec = [0,0,0,40];
		var ttnt = 100;

//Space from bottom line in mm 
		var bspc = 6.844;
//Line weight for bottom line in pts
        var bwt = 4.4;
//Color name, spec & tint for bottom line
		var bcol = "C\=0 M\=0 Y\=0 K\=40";
  		var bcolspec = [0,0,0,40];
    	var btnt = 100;

///////////////////////////////////////////////////////////////////
///////////////////// That's it for editables /////////////////////
///////////////////////////////////////////////////////////////////

// If the above colours don't exist, create them		

		if (!app.activeDocument.colors.itemByName(lcol).isValid) {
			app.activeDocument.colors.add({name:lcol, model:ColorModel.process, colorValue:lcolspec});
		};
		if (!app.activeDocument.colors.itemByName(rcol).isValid) {
			app.activeDocument.colors.add({name:rcol, model:ColorModel.process, colorValue:rcolspec});
		};
		if (!app.activeDocument.colors.itemByName(tcol).isValid) {
			app.activeDocument.colors.add({name:tcol, model:ColorModel.process, colorValue:tcolspec});
		};
		if (!app.activeDocument.colors.itemByName(bcol).isValid) {
			app.activeDocument.colors.add({name:bcol, model:ColorModel.process, colorValue:bcolspec});
		};

////////////// Go metric, but save weird preferences //////////////
		var OldXUnits = app.documents[0].viewPreferences.horizontalMeasurementUnits;
		var OldYUnits = app.documents[0].viewPreferences.verticalMeasurementUnits;
////////////////////////// Get it metric //////////////////////////
		app.documents[0].viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
		app.documents[0].viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;

////////// What's selected? Do we whine? Do we group it? //////////
		var boxthang = app.selection;
        switch (true) {
            case (boxthang.length==0): alert ("Nothing selected!"); return; break;
            case (boxthang.length==1): var garoupa=boxthang[0]; break;
            case (boxthang.length>1): var garoupa=app.activeWindow.activePage.groups.add(boxthang); var groupie=true; break;
        };

///////////////////////////////////////////////////////////////////
///////////// Dialogue to ask you what you want to do /////////////
///////////////////////////////////////////////////////////////////
		var dlgAd = app.dialogs.add({name:"Liner"});
		var dlcAd  = dlgAd.dialogColumns.add();

//////////////////////// Line type section ////////////////////////
		var bpnAd = dlcAd.borderPanels.add();
		bpnAd.staticTexts.add({staticLabel:"Line on:"});

//////////////////// Line type radiobuttonGroup ///////////////////
		var rbgLine = bpnAd.radiobuttonGroups.add();
		var codesinister = rbgLine.radiobuttonControls.add({staticLabel:"Left"});
		var codetopsy = rbgLine.radiobuttonControls.add({staticLabel:"Top"});
		var codedexter = rbgLine.radiobuttonControls.add({staticLabel:"Right"});
		var codekevin = rbgLine.radiobuttonControls.add({staticLabel:"Bottom"});
		codesinister.checkedState = true;

///////////// Display dialog and capture user choices /////////////
		blnResult = dlgAd.show();
		if (blnResult == false){
			alert("Operation cancelled by user.");
			exit();
		} else {
			var strLine = rbgLine.radiobuttonControls[rbgLine.selectedButton].staticLabel;
		}
		dlgAd.destroy();

///////////////////////////////////////////////////////////////////
////////////////////// Let's Draw Some Lines //////////////////////
///////////////////////////////////////////////////////////////////

/////////////////////// So Where's the box? ///////////////////////
		var topy = garoupa.geometricBounds[0];
		var lftx = garoupa.geometricBounds[1];
		var boty = garoupa.geometricBounds[2];
		var rgtx = garoupa.geometricBounds[3];

////////////// Did we group things? Let's ungroup em //////////////
        if (groupie) {garoupa.ungroup()}; 

///////////////// Setup the line type & placement /////////////////
        switch (strLine){
            case "Left": var lftx = (lftx-lspc); var rgtx = lftx; var lweight = lwt; var lcolour = lcol; var ltint = ltnt; break;
            case "Right": var rgtx = (rgtx+rspc); var lftx = rgtx; var lweight = rwt; var lcolour = rcol; var ltint = rtnt;  break;
            case "Top": var topy = (topy-tspc); var boty = topy; var lweight = twt; var lcolour = tcol; var ltint = ttnt; break;
            case "Bottom": var boty = (boty+bspc); var topy = boty; var lweight = bwt; var lcolour = bcol; var ltint = btnt; break;
        };

///////////////////////// Draw that line /////////////////////////
		var liner = app.activeWindow.activePage.graphicLines.add();
		liner.strokeWeight = lweight;
		liner.strokeColor = lcolour;
        liner.strokeTint = ltint;
		liner.paths[0].pathPoints[0].anchor = [lftx,topy];
		liner.paths[0].pathPoints[1].anchor = [rgtx,boty];

//// Not metric? Back to whatever weirdo measurements you had ////
		app.documents[0].viewPreferences.horizontalMeasurementUnits = OldXUnits;
		app.documents[0].viewPreferences.verticalMeasurementUnits = OldYUnits;

/////////////// Whine about stuff if it goes wrong ///////////////
	} catch (err) {
		alert ("Liner Error: " + [err, err.line]);
	}
};