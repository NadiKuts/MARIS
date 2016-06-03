<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of GeoClass
 *
 * @author Robert
 */

require_once 'config.php';
class GeoClass {

    //put your code here
    function getWorkSpaces(){
        $logfh = fopen("GeoserverPHP.log", 'w') or die("can't open log file");

        // Initiate cURL session
        $service = "http://".GEO_HOST.":".GEO_PORT."/geoserver/"; // replace with your URL
        $request = "rest/workspaces"; // to add a new workspace
        $url = $service . $request;
        $ch = curl_init($url);

        // Optional settings for debugging
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //option to return string
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_STDERR, $logfh); // logs curl messages
        //Required POST request settings
        curl_setopt($ch, CURLOPT_POST, True);

        //curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/xml"));
        $passwordStr = GEO_USER.":".GEO_PASSWORD; // replace with your username:password
        curl_setopt($ch, CURLOPT_USERPWD, $passwordStr);

        //POST data
        //curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: application/xml"));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/xml"));
        //$xmlStr = "<workspace><name>" . $workspace . "</name></workspace>";
        //curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlStr);

        //POST return code
        $successCode = 200;
        $result = 0;

        $buffer = curl_exec($ch); // Execute the curl request
        // Check for errors and process results
        $info = curl_getinfo($ch);
        if ($info['http_code'] != $successCode) {

            $msgStr = "# Unsuccessful cURL request to ";
            $msgStr .= $url . " [" . $info['http_code'] . "]\n";
            fwrite($logfh, $msgStr);
        } else {
            $result = 1;
            $msgStr = "# Successful cURL request to " . $url . "\n";
            fwrite($logfh, $msgStr);
        }
        fwrite($logfh, $buffer . "\n");

        curl_close($ch); // free resources if curl handle will not be reused
        fclose($logfh);  // close logfile
        return $result;
    }

    function createWorkSpace($workspace) {
        $logfh = fopen("GeoserverPHP.log", 'w') or die("can't open log file");

        // Initiate cURL session
        $service = "http://".GEO_HOST.":".GEO_PORT."/geoserver/"; // replace with your URL
        $request = "rest/workspaces"; // to add a new workspace
        $url = $service . $request;
        $ch = curl_init($url);

        // Optional settings for debugging
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //option to return string
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_STDERR, $logfh); // logs curl messages
        //Required POST request settings
        curl_setopt($ch, CURLOPT_POST, True);

        //curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/xml"));
        $passwordStr = GEO_USER.":".GEO_PASSWORD; // replace with your username:password
        curl_setopt($ch, CURLOPT_USERPWD, $passwordStr);

        //POST data
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: application/xml"));
        $xmlStr = "<workspace><name>" . $workspace . "</name></workspace>";
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlStr);

        //POST return code
        $successCode = 201;
        $result = 0;

        $buffer = curl_exec($ch); // Execute the curl request
        // Check for errors and process results
        $info = curl_getinfo($ch);
        if ($info['http_code'] != $successCode) {

            $msgStr = "# Unsuccessful cURL request to ";
            $msgStr .= $url . " [" . $info['http_code'] . "]\n";
            fwrite($logfh, $msgStr);
        } else {
            $result = 1;
            $msgStr = "# Successful cURL request to " . $url . "\n";
            fwrite($logfh, $msgStr);
        }
        fwrite($logfh, $buffer . "\n");

        curl_close($ch); // free resources if curl handle will not be reused
        fclose($logfh);  // close logfile
        return $result;
    }

    function deleteWorkspace($workspace) {

        $logfh = fopen("GeoserverPHP.log", 'w') or die("can't open log file");

        // Initiate cURL session
        $service = "http://".GEO_HOST.":".GEO_PORT."/geoserver/"; // replace with your URL
        //$service = "http://localhost:8080/geoserver/"; // replace with your URL
        $request = "rest/workspaces/" . $workspace; // to add a new workspace
        $url = $service . $request;
        $ch = curl_init($url);

        // Optional settings for debugging
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //option to return string
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_STDERR, $logfh); // logs curl messages
        //Required DELETE request settings
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        $passwordStr = GEO_USER.":".GEO_PASSWORD; // replace with your username:password
        curl_setopt($ch, CURLOPT_USERPWD, $passwordStr);

        //DELETE data
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: application/atom+xml"));

        //DELETE return code
        $successCode = 200;

        $result = 0;

        $buffer = curl_exec($ch); // Execute the curl request
        // Check for errors and process results
        $info = curl_getinfo($ch);
        if ($info['http_code'] != $successCode) {

            $msgStr = "# Unsuccessful cURL request to ";
            $msgStr .= $url . " [" . $info['http_code'] . "]\n";
            fwrite($logfh, $msgStr);
        } else {
            $result = 1;
            $msgStr = "# Successful cURL request to " . $url . "\n";
            fwrite($logfh, $msgStr);
        }
        fwrite($logfh, $buffer . "\n");

        curl_close($ch); // free resources if curl handle will not be reused
        fclose($logfh);  // close logfile
        return $result;
    }

    function addLayer($workspace, $storename, $file) {
        $logfh = fopen("GeoserverPHP.log", 'w') or die("can't open log file");
        $ch = curl_init();
        //curl_setopt($ch, CURLOPT_URL, "http://localhost:8080/geoserver/rest/workspaces/Kenya/datastores/Area/external.shp");

        curl_setopt($ch, CURLOPT_URL, "http://".GEO_HOST.":".GEO_PORT."/geoserver/rest/workspaces/".$workspace."/datastores/".$storename."/external.shp");
        
        curl_setopt($ch, CURLOPT_STDERR, $logfh); // logs curl messages

        curl_setopt($ch, CURLOPT_USERPWD, GEO_USER.":".GEO_PASSWORD);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");

        //$data = "file:///C:/Users/Robert/Documents/MaMaSe/mamase/area/shape/Boundaries_Mamase.shp";
        $data = "file:///".$file;

        if ($data != '') {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: text/plain", 'Content-Length: ' . strlen($data)));
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $rslt = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch); // free resources if curl handle will not be reused
        fclose($logfh); 
        return $rslt;
    }

}
