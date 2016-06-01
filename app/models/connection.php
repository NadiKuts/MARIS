<?php

class DB_Connect {

    // constructor
    function __construct() {
        
    }

    // destructor
    function __destruct() {
        // $this->close();
    }

    // Connecting to database
    public function connect() {
        require_once 'config.php';

        $host = "host=".DB_HOST;
        $port= "port=".DB_PORT;
        $dbname = "dbname=".DB_DATABASE;
        $credentials="user=".DB_USER." password=".DB_PASSWORD;
        
        $con = pg_connect("$host $port $dbname $credentials");
        
        return $con;
    }

    // Closing database connection
    public function close() {        
        //mysql_close();
        pg_close();
    }

}