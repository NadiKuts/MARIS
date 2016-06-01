<?php
include_once 'connection.php';
include 'GeoClass.php';
$geo = new GeoClass();
$workspace = $datasource = $layername = $path = "";
$DBConnect = new DB_Connect();
$db = $DBConnect->connect();
$data = json_decode(file_get_contents("php://input"));

$firstname = $data->firstname;
$lastname = $data->lastname;
$company = $data->company;
$email = $data->email;
$password = $data->password;
$password = md5($password);

$selectQuery = "SELECT * from mamase.users WHERE email='$email'";

$res = pg_query($db, $selectQuery);

$count = 0;
while ($row = pg_fetch_row($res)) {
    $count++;
}
if($count > 0){
	echo json_encode(-1);
}
else
{
	$query = "INSERT INTO mamase.users(firstname,lastname,company, email, password) VALUES('$firstname','$lastname','$company','$email','$password')";
	$result = pg_query($db, $query);
	if ($result) {
   		$workspace = $firstname.'_'.$lastname;
   		$path = '../WorkSpaces/'.$workspace;
		if(!file_exists($path)){
			mkdir($path, 0, true);
			mkdir($path.'/Inputs', 0, true);
			mkdir($path.'/Outputs', 0, true);
			$geo->createWorkSpace($workspace);
		
		}
		echo json_encode(1);
	}
	else
	{
		echo json_encode(0);
	}
}




?>