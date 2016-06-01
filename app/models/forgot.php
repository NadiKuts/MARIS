<?php
include_once 'connection.php';
$DBConnect = new DB_Connect();
$db = $DBConnect->connect();
$data = json_decode(file_get_contents("php://input"));

$email = $data->email;

$query = "SELECT id FROM mamase.users WHERE email='$email' AND deleted=FALSE";

$result = pg_query($db, $query);

$count = 0;
$id = -1;
while ($row = pg_fetch_row($result)) {
    $count++;
    $id = $row[0];
    break;
}
$newPassword = random_password(16);

$hashedPassword = md5($newPassword);
if($count > 0){
    $query = "UPDATE mamase.users SET password ='$hashedPassword' WHERE id=$id AND email='$email' AND deleted=FALSE";
    $result = pg_query($db, $query);
    if ($result) {
	    echo 1;
    }
    else
    {
    	echo 0;
    }  
	
}else{
	echo -1;
}
pg_close();


function random_password( $length = 8 ) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?";
    $randpassword = substr( str_shuffle( $chars ), 0, $length );
    return $randpassword;
}

//echo json_encode($result);

?>