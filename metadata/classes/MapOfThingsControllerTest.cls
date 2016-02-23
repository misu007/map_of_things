@isTest
public class MapOfThingsControllerTest {
    
    private static testMethod void myTest001() {        
        String result;
        String nval;
        
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            'misu007__Lng__c','misu007__Popup__c','');
        System.assertEquals('success', result);
    }
    
    private static testMethod void myTest002() {        
        String result;
        String nval;
        
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            'misu007__Lng__c','misu007__Popup__c','misu007__MarkerURL__c');
        System.assertEquals('success', result);
        
    }
    
    private static testMethod void myTest1() {        
        String result;
        String nval;
        
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            'misu007__Lng__c','misu007__Popup__c','misu007__MarkerURLxxxxxxxxxxxxx__c');
        System.assertEquals('Some property values about Object are seen to be invalid: Field Name "'
                            + 'misu007__MarkerURLxxxxxxxxxxxxx__c' + '" is not found', result);
        
        
    }
    
    private static testMethod void myTest2() {        
        String result;
        String nval;
        
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemoxxxxx__c',
            'misu007__Lat__c',
            'misu007__Lng__c','misu007__Popup__c','');
        System.assertEquals('Some property values about Object are seen to be invalid: Object Name "'
                            + 'misu007__ThingsDemoxxxxx__c' + '" is not found', result);
        
    }
    private static testMethod void myTest3() {        
        String result;
        String nval;
        
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            'misu007__Latxxxxx__c',
            'misu007__Lng__c','misu007__Popup__c','');
        System.assertEquals('Some property values about Object are seen to be invalid: Field Name "'
                            + 'misu007__Latxxxxx__c' + '" is not found', result);
        
    }
    private static testMethod void myTest4() {        
        String result;
        String nval;
        
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            'misu007__Lngxxxxx__c','misu007__Popup__c','');
        System.assertEquals('Some property values about Object are seen to be invalid: Field Name "'
                            + 'misu007__Lngxxxxx__c' + '" is not found', result);
        
    }    
    private static testMethod void myTest5() {        
        String result;
        String nval;
        
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            'misu007__Lng__c','misu007__Popupxxxxx__c','');
        System.assertEquals('Some property values about Object are seen to be invalid: Field Name "'
                            + 'misu007__Popupxxxxx__c' + '" is not found', result);
        
    }
    private static testMethod void myTest6() {        
        String result;
        String nval;
        
        result = MapOfThingsController.healthCheck(
            '',
            'misu007__Lat__c',
            'misu007__Lng__c','misu007__Popup__c','');
        System.assertEquals('Some property values about Object are seen to be invalid: Object name is not specified', result);
        
    }
    private static testMethod void myTest7() {        
        String result;
        String nval;
        
        //get language 'English'
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            '',
            'misu007__Lng__c','misu007__Popup__c','');
        System.assertEquals('Some property values about Object are seen to be invalid: Field name of Latitude is not specified', result);
        
    }
    private static testMethod void myTest8() {        
        String result;
        String nval;
        
        //get language 'English'
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            '','misu007__Popup__c','');
        System.assertEquals('Some property values about Object are seen to be invalid: Field name of Longitude is not specified', result);
        
    }
    private static testMethod void myTest9() {        
        String result;
        String nval;
        
        //get language 'English'
        result = MapOfThingsController.healthCheck(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            'misu007__Lng__c','','');
        System.assertEquals('Some property values about Object are seen to be invalid: Field name of Popup Content is not specified', result);
        
    }
    
    private static testMethod void myTest201() {        
        List<Object> result;
        String nval;
        
        result = MapOfThingsController.getTargets(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            'misu007__Lng__c','misu007__Popup__c','');
        Integer num = result.size();
        System.assert(num >= 0);
        
    }
    
    private static testMethod void myTest202() {        
        List<Object> result;
        String nval;
        
        result = MapOfThingsController.getTargets(
            'misu007__ThingsDemo__c',
            'misu007__Lat__c',
            'misu007__Lng__c','misu007__Popup__c','misu007__MarkerURL__c');
        Integer num = result.size();
        System.assert(num >= 0);
        
        
    }
    
    
}