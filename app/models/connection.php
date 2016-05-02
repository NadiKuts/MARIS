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
        // connecting to mysql

        //$con = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);

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