({
    afterRender : function (cmp, helper){
        //default
        this.superAfterRender();
        //Custom afterRender function
        helper.mapDivInitialize(cmp);
    },
    rerender : function (cmp, helper){
        //default
        this.superRerender();
        //Custom rerender function
        if (cmp.get("v.LifeCycle") === "99"){
            helper._showAlertDiv(cmp);
        } else if (cmp.get("v.LifeCycle") === "2"){
            helper.firstGetRecord(cmp);
        } else if (cmp.get("v.LifeCycle") === "4"){
            helper.createMapMarkers(cmp);
        } else if (cmp.get("v.LifeCycle") === "5"){
            helper.moveMarkers(cmp);
        } else {
        }
    }
})