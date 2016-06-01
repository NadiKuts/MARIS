<?php
include_once 'connection.php';
$DBConnect = new DB_Connect();
$db = $DBConnect->connect();
$data = json_decode(file_get_contents("php://input"));
$email = $data->email;

$password = $data->password;

$hashedpassword = md5($password);

$query = "SELECT firstname, lastname, email, roleid FROM mamase.users WHERE email='$email' AND password='$hashedpassword' AND deleted =FALSE ";

$result = pg_query($db, $query);

$a = array();
$b = array();
$count = 0;

while ($row = pg_fetch_row($result)) {
    $count++;
    $b["name"] = $row[0].' '.$row[1];
    $b["email"] = $row[2];
    $b["role"] = $row[3];
    array_push($a, $b);
}
if($count > 0){
	echo json_encode($a);
}else{
	echo json_encode(0);
}
pg_close();


//echo json_encode($result);

?>