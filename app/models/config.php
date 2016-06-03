<?php

$configpath = "../config.json";

$string = file_get_contents(realpath($configpath));
$json = json_decode($string, true);

/**
 * Database configuration variables
 */


define("DB_HOST", $json['database']['host']);
define("DB_USER", $json['database']['user'] );
define("DB_PASSWORD", $json['database']['password'] );
define("DB_PORT", $json['database']['port']);
define("DB_DATABASE", $json['database']['name'] );

//Geoserver Configuration

/**
*/
define("GEO_HOST", $json['geoserver']['host']);
define("GEO_USER", $json['geoserver']['user']);
define("GEO_PASSWORD", $json['geoserver']['password']);
define("GEO_PORT", $json['geoserver']['port']);

//Email Configuration

/**
*/
define("EMAIL_HOST",$json['email']['host']);
define("USERNAME",$json['email']['username']);
define("PASSWORD",$json['email']['password']);
define("FROM_ADDRESS", $json['email']['fromAddress']);
define("FROM_NAME",$json['email']['fromName']);
define("SMTPAuth",$json['email']['SMTPAuth']);

?>