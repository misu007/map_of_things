({
    //init
    doInit: function(cmp, event, helper){
        var varCheck = 999;
        varCheck = helper.doVarCheck(cmp);
        if (varCheck == 0){
            cmp.set("v.alertMessage", '');
	        helper.doHealthCheck(cmp);
        }
    },
    
    
    doneRendering: function(cmp, event, helper){
        if (cmp.get("v.alertMessage")){
            cmp.find("alertmessage").getElement().style.display = "block";
        } else if (cmp.get("v.markerStatus")){
            window.setTimeout(
                $A.getCallback(function() {
                    if (cmp.isValid()) {
                        helper.updatetarkers(cmp);
                    }
                }), cmp.get("v.syncInterval"));            
        }
    },
    
    
    
})