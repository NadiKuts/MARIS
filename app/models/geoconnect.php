<?php
require_once 'config.php';
class GEO_Connect {

    // constructor
    function __construct() {
        
    }

    // destructor
    function __destruct() {
        // $this->close();
    }
    function loginGeoserver() {     
        $geoserverURL = "http://".GEO_HOST.":".GEO_PORT."/geoserver/j_acegi_security_check";
        $post = http_build_query(array(
                "username" => GEO_USER,
                "password" => GEO_PASSWORD,
        ));

        $context = stream_context_create(array("http"=>array(
            "method" => "POST",
            "header" => "Content-Type: application/x-www-form-urlencoded\r\n" .
                    "Content-Length: ". strlen($post) . "\r\n",
            "content" => $post,
        ))); 

        $page = file_get_contents($geoserverURL, false, $context); 
        
        //$cookieValue =$page;
        for($i = 0; $i < sizeof($http_response_header); $i++){

            $headerLine = $http_response_header[$i]; 

            $pos = strpos($headerLine, 'Set-Cookie');            
            if ($pos === 0) {
                    $str = explode("=",$headerLine);
                    $value = explode(";",$str[1]);
                    $cookieValue = $value[0];
                    break;
            }             
        }        
        $cookieName = "JSESSIONID";
        $cookieDomain = GEO_HOST.":".GEO_PORT;
        $cookiePath = "/geoserver";
        $cookieExpiration = 100;        
        setcookie($cookieName,$cookieValue,$cookieExpiration,$cookiePath);        
        return $page; 
    }
    function logoutGeoserver() {
        //Logout do Geoserver
        $geoserverURL = "http://".GEO_HOST.":".GEO_PORT."/geoserver/j_acegi_logout";
        $context = stream_context_create(array("http"=>array(
            "method" => "POST",
            "header" => "Content-Type: application/x-www-form-urlencoded\r\n" .
                "Content-Length: ". strlen($post) . "\r\n".
                "Cookie: JSESSIONID=".$_SESSION['geoserverCookie']."\r\n",
        )));
        $logout = file_get_contents($geoserverURL, false, $context);

    }

}