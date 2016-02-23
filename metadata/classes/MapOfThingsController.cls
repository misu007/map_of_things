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
                objectNameR = obj.getName();
            } catch(exception e) {
                objectNameR = '---';
            }
            
            if (objectNameR == objectName){
                Map<String, Schema.SObjectField> gf = obj.fields.getMap();
                try{
                    LatNameR = gf.get(LatName).getDescribe().getName();
                } catch(exception e) {
                }
                try{
                    LngNameR = gf.get(LngName).getDescribe().getName();
                } catch(exception e) {
                }
                try{
                    ExplainNameR = gf.get(ExplainName).getDescribe().getName();
                } catch(exception e) {
                }
                if (String.isNotBlank(ImgName)){
                    try{
                        ImgNameR = gf.get(ImgName).getDescribe().getName();
                    } catch(exception e) {
                    }                    
                }
                if (LatNameR != LatName){
                    mes += 'Field Name "' + LatName + '" is not found';
                } else if (LngNameR != LngName){
                    mes += 'Field Name "' + LngName + '" is not found';                
                } else if (ExplainNameR != ExplainName){
                    mes += 'Field Name "' + ExplainName + '" is not found';                
                } else if (String.isNotBlank(ImgName) && ImgNameR != ImgName){
                    mes += 'Field Name "' + ImgName + '" is not found';                
                } else {
                    mes = 'success';
                }
            } else {
                mes += 'Object Name "' + objectName + '" is not found';
            }
            
            
        }
        return mes;
    }    
    
    @AuraEnabled
    //get marker object
    public static List<Object> getTargets(String objectName, String LatName, String LngName, String ExplainName, String ImgName) {
        String query1 = 'SELECT Id, ' + LatName + ', ' + LngName + ', ' + ExplainName;
        if (String.isNotBlank(ImgName)){
            query1 += ', ' + ImgName;
        }
        query1 += ' FROM ' + objectName
            + ' WHERE ' + LatName +' != null AND ' + LngName + ' != null';
        List<Object> mycars = database.query(query1);
        return mycars;
    } 
    
}