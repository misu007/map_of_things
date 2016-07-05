({
    //init
    doInit: function(cmp, event, helper){
        cmp.set("v.leaflet", L);
        var varCheck = 999;
        varCheck = helper.doVarCheck(cmp);
        if (varCheck === 0){
            cmp.set("v.alertMessage", '');
            helper.doHealthCheck(cmp);
        }
        window.setInterval(
            $A.getCallback(function() {
                if (cmp.isValid() && cmp.get("v.LifeCycle") === "5") {
                    helper.updateMarkerRecords(cmp);
                }
            }), cmp.get("v.syncInterval")
        );
    }
})