<?php
include_once 'connection.php';
require("mail/class.phpmailer.php");
$DBConnect = new DB_Connect();
$db = $DBConnect->connect();
$data = json_decode(file_get_contents("php://input"));
$password = $data->password;
$email = $data->email;

$hashedPassword = md5($password);

$query = "UPDATE mamase.users SET password ='$hashedPassword' WHERE email='$email' ";
$result = pg_query($db, $query);
if ($result) {
		echo json_encode(1);
    }
else{
    echo json_encode(0);
}
pg_close();
?>