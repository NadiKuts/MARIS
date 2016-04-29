<?php
include_once 'connection.php';
$DBConnect = new DB_Connect();
$db = $DBConnect->connect();
$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$password = $data->password;
$password = md5($password);

//$userInfo = $db->query("SELECT name from users WHERE email='$email' AND password='$password'");
//$userInfo = $userInfo->fetchAll();

$query = "SELECT firstname, lastname, email FROM users WHERE email='$email' AND password='$password'";
$result = mysqli_query($db, $query);

$a = array();
$b = array();
$count = 0;
while ($row = mysqli_fetch_array($result)) {
	$count++;
    $b["name"] = $row[0].' '.$row[1];
    $b["email"] = $row[2];
    array_push($a, $b);
}
if($count > 0){
	echo json_encode($a);
}else{
	echo json_encode($count);
}


//echo json_encode($result);

?>