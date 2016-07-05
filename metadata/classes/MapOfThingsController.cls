public with sharing class MapOfThingsController {
    
    @AuraEnabled
    //Checking ObjectName and ColumnNames
    public static String healthCheck(String objectName, String LatName, String LngName, String ExplainName, String ImgName) {
        String mes = 'Some property values about Object are seen to be invalid: ';
        if (String.isBlank(objectName)){
            mes += 'Object name is not specified';
        } else if (String.isBlank(LatName)){
            mes += 'Field name of Latitude is not specified';
        } else if (String.isBlank(LngName)){
            mes += 'Field name of Longitude is not specified';
        } else if (String.isBlank(ExplainName)){
            mes += 'Field name of Popup Content is not specified';
        } else {
            String objectNameR = 'none';
            String LatNameR = 'none';
            String LngNameR = 'none';
            String ExplainNameR = 'none';
            String ImgNameR = 'none';
            Map<String, Schema.SObjectType> gt = Schema.getGlobalDescribe();
            Schema.DescribeSObjectResult obj;
            try{                
                obj = gt.get(objectName).getDescribe();
                if(obj.isAccessible()){
                    objectNameR = obj.getName();
                } else {
                    objectNameR = '---';
                }
            } catch(exception e) {
                objectNameR = '---';
            }
            
            if (objectNameR == objectName){
                Map<String, Schema.SObjectField> gf = obj.fields.getMap();
                try{
                    if(gf.get(LatName).getDescribe().isAccessible()){
                        LatNameR = gf.get(LatName).getDescribe().getName();
                    }
                } catch(exception e) {
                }
                try{
                    if(gf.get(LngName).getDescribe().isAccessible()){
                        LngNameR = gf.get(LngName).getDescribe().getName();
                    }
                } catch(exception e) {
                }
                try{
                    if(gf.get(ExplainName).getDescribe().isAccessible()){
                        ExplainNameR = gf.get(ExplainName).getDescribe().getName();
                    }
                } catch(exception e) {
                }
                if (String.isNotBlank(ImgName)){
                    try{
                        if(gf.get(ImgName).getDescribe().isAccessible()){
                            ImgNameR = gf.get(ImgName).getDescribe().getName();
                        }
                    } catch(exception e) {
                    }                    
                }
                if (LatNameR != LatName){
                    mes += 'Field Name "' + LatName + '" is not found or is not accessible';
                } else if (LngNameR != LngName){
                    mes += 'Field Name "' + LngName + '" is not found or is not accessible';                
                } else if (ExplainNameR != ExplainName){
                    mes += 'Field Name "' + ExplainName + '" is not found or is not accessible';                
                } else if (String.isNotBlank(ImgName) && ImgNameR != ImgName){
                    mes += 'Field Name "' + ImgName + '" is not found or is not accessible';                
                } else {
                    mes = 'success';
                }
            } else {
                mes += 'Object Name "' + objectName + '" is not found or is not accessible';
            }
            
            
        }
        return mes;
    }    
    
    @AuraEnabled
    //get marker object
    public static List<Object> getTargets(String objectName, String LatName, String LngName, String ExplainName, String ImgName) {
        List<Object> targets = new List<Object>();
        
        try{
            Schema.DescribeSObjectResult obj = Schema.getGlobalDescribe().get(objectName).getDescribe();
            Map<String, Schema.SObjectField> gf = obj.fields.getMap();
            
            Boolean boolObj = obj.isAccessible();
            Boolean boolLat = gf.get(LatName).getDescribe().isAccessible();
            Boolean boolLng = gf.get(LngName).getDescribe().isAccessible();
            Boolean boolExplain = gf.get(ExplainName).getDescribe().isAccessible();
            Boolean boolImg = String.isBlank(ImgName) ? true: gf.get(ImgName).getDescribe().isAccessible() ? true: false;
            
            if (boolObj && boolLat && boolLng && boolExplain && boolImg){
                String query1 = 
                    'SELECT Id, ' + String.escapeSingleQuotes(LatName)
                    + ', ' + String.escapeSingleQuotes(LngName)
                    + ', ' + String.escapeSingleQuotes(ExplainName);
                
                if (String.isNotBlank(ImgName)){
                    query1 += ', ' + String.escapeSingleQuotes(ImgName);
                }
                query1 += ' FROM ' + String.escapeSingleQuotes(objectName)
                    + ' WHERE ' + String.escapeSingleQuotes(LatName) +' != null ' 
                    + 'AND ' + String.escapeSingleQuotes(LngName) + ' != null';
                targets = database.query(query1);
            }
        } catch(exception e) {
        }
        return targets;
    } 
    
}