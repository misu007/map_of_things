({    
    //initialize map and markers
    initializeMapMarkers: function(cmp) {
        this._mapDivInitialize(cmp);
        var action = cmp.get("c.getTargets");
        action.setParams({ 
            objectName : cmp.get("v.targetObj"),
            LatName : cmp.get("v.targetLat"),
            LngName : cmp.get("v.targetLng"),
            ExplainName : cmp.get("v.targetExplain"),
            ImgName : cmp.get("v.targetImg")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.tarkers", response.getReturnValue());
                
                var map;
                var markers;
                map = this.initMap(cmp);
                cmp.set("v.map", map);
                markers = this.createMarkers(cmp, map);
                cmp.set("v.markers", markers);
                cmp.set("v.markerStatus", "true");
            } 
        });
        $A.enqueueAction(action);
    },
    
    _mapDivInitialize: function(cmp) {
        var globalId = cmp.getGlobalId();
        var target = document.getElementById(globalId + '_map');
        target.style.width = cmp.get("v.mapSizeX");
        target.style.height = cmp.get("v.mapSizeY") + 'px';        
    },

    //check variables
    doVarCheck: function(cmp) {
        var regex = {
            tileServerUrl: /^https?:\/\/.{4,250}$/,
            tileServerAttribution: /^.{1,50}$/,
            mapSizeY: /^[1-9][0-9]{0,3}$/,
            targetObj: /^.{3,200}$/,
            targetLat: /^.{3,200}$/,
            targetLng: /^.{3,200}$/,
            targetExplain: /^.{3,200}$/,
            targetImg: /^.{0,200}$/,
            iconSizeX: /^[1-9][0-9]{0,2}$/,
            iconSizeY: /^[1-9][0-9]{0,2}$/,
            syncInterval: /^$|^[1-9][0-9]{3,7}$/,
            moveDuration: /^[1-9][0-9]{0,4}$/
        	};
        
        var poorNumber = 0;
        var errorMessage = "Some property values are seen to be invalid:  ";

        for(key in regex){
            if (!(regex[key].test(cmp.get("v." + key)))){
                poorNumber += 1;
                errorMessage += "  " + cmp.get("v." + key + "_mean");
            }            
        }

        if (poorNumber){
            cmp.set("v.alertMessage", errorMessage);
        }
        return poorNumber;
    }, 


    
    //check object and fields by apex
    doHealthCheck: function(cmp) {
        var action = cmp.get("c.healthCheck");
        action.setParams({ 
            objectName : cmp.get("v.targetObj"),
            LatName : cmp.get("v.targetLat"),
            LngName : cmp.get("v.targetLng"),
            ExplainName : cmp.get("v.targetExplain"),
            ImgName : cmp.get("v.targetImg")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var alertMessage = response.getReturnValue();
                if(alertMessage === "success"){
                    cmp.set("v.componentStatus", "true");
                    this.initializeMapMarkers(cmp);
                } else {
                    cmp.set("v.alertMessage", alertMessage);

                }
            } else {
            }
        });
        $A.enqueueAction(action);
    }, 
    
    
    //initialize map   
    initMap: function(cmp){
        var globalId = cmp.getGlobalId();
        var mapId = globalId + "_map";
        var tileServerUrl = cmp.get("v.tileServerUrl");
        var tileServerAttribution = cmp.get("v.tileServerAttribution");
        map = L.map(mapId, {
            zoomControl: true,
        }).setView([cmp.get("v.mapCenterLat"), cmp.get("v.mapCenterLng")], cmp.get("v.mapInitialZoom"));
        L.tileLayer(tileServerUrl,{
            minZoom:5,
            attribution: tileServerAttribution,
            unloadInvisibleTiles: true
        }).addTo(map);
        return map;
    },
    
    //create markers
    createMarkers: function(cmp, map){
        var tarkers = cmp.get("v.tarkers");
        var markers = [];
        for (key in tarkers){
            var tarker = tarkers[key];
            this.newMarker(cmp, markers, tarker, map);
        }
        this.setMapCenter(cmp, map);
        return markers;
    },
    
    //new marker
    newMarker: function(cmp, markers, tarker, map){
        var iconSizeX = cmp.get("v.iconSizeX");
        var iconSizeY = cmp.get("v.iconSizeY");;
        var iconImgClm = cmp.get("v.targetImg");
        var iconImgUrl;
        if (iconImgClm){
            iconImgUrl = tarker[iconImgClm];
        } else {
            iconImgUrl = '/resource/misu007__mapofthings_leaflet/images/marker-icon.png';
        }
        var lat = tarker[cmp.get("v.targetLat")];
        var lng = tarker[cmp.get("v.targetLng")];
        if(!isNaN(lat) && !isNaN(lng)){
            markers[tarker["Id"]] = [];
            markers[tarker["Id"]]["lat"] = tarker[cmp.get("v.targetLat")];
            markers[tarker["Id"]]["lng"] = tarker[cmp.get("v.targetLng")];
            markers[tarker["Id"]]["angle"] = 0;
            markers[tarker["Id"]]["imgurl"] = iconImgUrl;
            var mIcon = L.icon({
                iconUrl: iconImgUrl,
                iconSize: [iconSizeX, iconSizeY],
                iconAnchor: [(iconSizeX / 2), (iconSizeY / 2)],
                popupAnchor:  [0, -(iconSizeY / 4)]
            });
            markers[tarker["Id"]]["popup"] = L.popup().setContent(
                tarker[cmp.get("v.targetExplain")]
            );
            markers[tarker["Id"]]["marker"] = L.marker([markers[tarker["Id"]]["lat"], markers[tarker["Id"]]["lng"]], {
                icon: mIcon,
                iconAngle: 0
            }).addTo(map).bindPopup(markers[tarker["Id"]]["popup"]);
        }
    },
    
    
    // calculate distance between 2 points
    getDistance: function(cmp, lat0, lng0, lat1, lng1){
        var round = cmp.get("v.circumference");
        var x = Math.cos((lat1 - lat0) * Math.PI / 360) * (lng1 - lng0);
        var dy = round * (lat1 - lat0) / 360;
        var dx = round * x / 360;
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
        return distance;
    },
    
    // set center point of map
    setMapCenter: function(cmp, map){
        var tarkers = cmp.get("v.tarkers");
        var nums = 0;
        var latSum = 0;
        var lngSum = 0;
        for (key in tarkers){
            var tarker = tarkers[key];
            
            var lat = tarker[cmp.get("v.targetLat")];
            var lng = tarker[cmp.get("v.targetLng")];
            if(!isNaN(lat) && !isNaN(lng)){
                nums += 1;
                latSum += lat * 1;
                lngSum += lng * 1;
            }
        }
        if (nums > 0){
            var latAvr = latSum / nums;
            var lngAvr = lngSum / nums;
            map.setView([latAvr, lngAvr], cmp.get("v.mapInitialZoom"));
        }
    },
    
    
    
    //update markers
    updatetarkers: function(cmp) {
        var map = cmp.get("v.map");
        var markers = cmp.get("v.markers");
        var action = cmp.get("c.getTargets");
        action.setAbortable();
        action.setParams({
            objectName : cmp.get("v.targetObj"),
            LatName : cmp.get("v.targetLat"),
            LngName : cmp.get("v.targetLng"),
            ExplainName : cmp.get("v.targetExplain"),
            ImgName : cmp.get("v.targetImg")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.tarkers", response.getReturnValue());
                this._moveMarkers(cmp, markers, map);
            }
        });
        $A.enqueueAction(action);
    },
    
    //change markers
    _moveMarkers: function(cmp, markers, map){
        
        var tarkers = cmp.get("v.tarkers");
        var isNeedMove = "false";
        for (key in markers){
            markers[key]["delete_flag"] = "true";
        }
        
        for (key in tarkers){
            var tarker = tarkers[key];
            if (!markers[tarker["Id"]]){
                this.newMarker(cmp, markers, tarker, map);
            } else {
                var nowlat = markers[tarker["Id"]]["lat"];
                var nowlng = markers[tarker["Id"]]["lng"];
                var newlat = tarker[cmp.get("v.targetLat")];
                var newlng = tarker[cmp.get("v.targetLng")];
                var distance = this.getDistance(cmp, nowlat, nowlng, newlat, newlng);
                
                markers[tarker["Id"]]["delete_flag"] = "false";	

                var popupContent = tarker[cmp.get("v.targetExplain")];
                if(markers[tarker["Id"]]["popupContent"] != popupContent){
                    markers[tarker["Id"]]["marker"].setPopupContent(popupContent);
                    markers[tarker["Id"]]["popupContent"] = popupContent;
                }
                
                var iconImgClm = cmp.get("v.targetImg");
                if (iconImgClm){
                    var iconImgUrl = tarker[iconImgClm];
                    var orgIconImgUrl = markers[tarker["Id"]]["imgurl"];
                    if (orgIconImgUrl != iconImgUrl){
                        var iconSizeX = cmp.get("v.iconSizeX");
                        var iconSizeY = cmp.get("v.iconSizeY");
                        var mIcon = L.icon({
                            iconUrl: iconImgUrl,
                            iconSize: [iconSizeX, iconSizeY],
                            iconAnchor: [(iconSizeX / 2), (iconSizeY / 2)],
                            popupAnchor:  [0, -(iconSizeY / 4)]
                        });
                        markers[tarker["Id"]]["marker"].setIcon(mIcon);
                        markers[tarker["Id"]]["imgurl"] = iconImgUrl;
                    }
                }
                
                if (distance > cmp.get("v.minDistance")){
                    isNeedMove = "true";
                    var setAngle = cmp.get("v.markerRotate") ? 
                        this._getAngle(nowlat, nowlng, newlat, newlng):
                    0;                    
                    var arr = cmp.get("v.markerRotate") ?
                        this._getAngleDiff(markers[tarker["Id"]]["angle"], setAngle):
                    [0, 0];              
                    var setAngleDiff = arr[0];
                    var setAngleRotation = arr[1];
                    var nowTime = new Date().getTime();                  
                    markers[tarker["Id"]]["start_time"] = nowTime;
                    markers[tarker["Id"]]["base_lat"] = this._normalizeFloat(nowlat);
                    markers[tarker["Id"]]["base_lng"] = this._normalizeFloat(nowlng);
                    markers[tarker["Id"]]["base_angle"] = markers[tarker["Id"]]["angle"];
                    markers[tarker["Id"]]["target_lat"] = newlat;
                    markers[tarker["Id"]]["target_lng"] = newlng;
                    markers[tarker["Id"]]["target_angle_diff"] = setAngleDiff;                    
                    markers[tarker["Id"]]["target_angle_rotation"] = setAngleRotation;                    
                }
            }
        }
        
        for (key in markers){
            if (markers[key]["delete_flag"] == "true"){
                map.removeLayer(markers[key]["marker"]);
                delete markers[key];
            }
        }
        
        if (isNeedMove == "true"){
            if(!cmp.get("v.animationStat")){
                this._startAnimation(cmp);
            }
        }
    },
    
    //normalize float number
    _normalizeFloat: function (val){
        val = parseFloat(val);
        return val;
    },
    
    //start animate
    _startAnimation: function(cmp){
        this._cmp = cmp;
        if (cmp.isValid()) {
            L.Util.requestAnimFrame(function(){
                this._animate();  
            }, this, true);
        }
    },
    
    //loop method of animate
    _animate: function(){
        cmp = this._cmp;
        if (cmp.isValid()) {
            var markers = cmp.get("v.markers");
            var map = cmp.get("v.map");
            var nowTime = new Date().getTime();
            var duration = cmp.get("v.moveDuration");
            var isContinue = "false";
            for (key in markers){
                var lat;
                var lng;
                var angle;
                var startTime = markers[key]["start_time"];
                var elapseTime = nowTime - startTime;
                if (elapseTime < duration){
                    timestate = elapseTime / duration;
                    var arr = this._getLatLngAngle(markers, key, timestate);
                    lat = arr[0];
                    lng = arr[1];
                    angle = arr[2];
                    markers[key]["marker"].setLatLng(L.latLng(lat, lng));
                    markers[key]["marker"].setIconAngle(angle);
                    markers[key]["lat"] = lat;
                    markers[key]["lng"] = lng;
                    markers[key]["angle"] = angle;
                    isContinue = "true";
                }
            }
            if(isContinue == "true"){
                L.Util.requestAnimFrame(this._animate, this, false);
            } else {
                cmp.set("v.animationStat", false);
            }
        }
    },
    
    //calculate distance and angle between 2 points
    _getAngleDiff: function(a0, a1){
        var diff;
        var rot;
        var a0c = a0 - a0;
        var a1c = a1 - a0;
        while (a1c < 0){
            a1c += 360;
        }
        if(a1c > 180){
            diff = 360 - a1c;
            rot = "left";
        } else {
            diff = a1c;
            rot = "right";
        }
        return [diff, rot];
    },
    
    //calculate angle between 2 points
    _getAngle: function(lat, lng, newlat, newlng){
        var latD = newlat - lat;
        var lngD =newlng - lng;
        var latDD = latD;
        var lngDD = Math.cos(newlat * Math.PI / 180) * lngD;
        var rad = Math.atan2(lngDD, latDD);
        var angle = rad * 180 / Math.PI;
        return angle;
    },
    
    //calculate latitude, longitude and angle at a point in time    
    _getLatLngAngle: function(markers, id, timestate){
        var b_lat = markers[id]["base_lat"];
        var b_lng = markers[id]["base_lng"];
        var b_angle = markers[id]["base_angle"];
        var t_lat = markers[id]["target_lat"];
        var t_lng = markers[id]["target_lng"];
        var t_angle_diff = markers[id]["target_angle_diff"];
        var t_angle_rotation = markers[id]["target_angle_rotation"];
        var current_angle = 
            (t_angle_rotation == "left") ? b_angle - timestate * t_angle_diff:
        (t_angle_rotation == "right") ? b_angle + timestate * t_angle_diff:
        0;
        current_angle = this._normalizeAngle(current_angle);
        var current_lat = b_lat + timestate * (t_lat - b_lat);
        var current_lng = b_lng + timestate * (t_lng - b_lng);
        return [current_lat, current_lng, current_angle];
    },
    
    //noamalize angle  
    _normalizeAngle: function(angle){
        while (angle < 0){
            angle += 360;
        } 
        while (angle > 360){
            angle -= 360;
        }
        return angle;
    },
    
    
})