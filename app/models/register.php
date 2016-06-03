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

//Check for double entry of user into the database
$selectQuery = "SELECT * from mamase.users WHERE email='$email'";
$res = pg_query($db, $selectQuery);
$count = 0;
while ($row = pg_fetch_row($res)) {
    $count++;
}
if($count > 0){
	//Return -1. User already exists with the entered email address
	echo json_encode(-1);
}
else
{
	//Email Address does not exist
	$query = "INSERT INTO mamase.users(firstname,lastname,company, email, password) VALUES('$firstname','$lastname','$company','$email','$password')";
	$result = pg_query($db, $query);
	if ($result) {
   		$workspace = $firstname.'_'.$lastname;
   		$path = '../WorkSpaces/'.$workspace;
   		//create a user folder in the server
		if(!file_exists($path)){
			mkdir($path, 0, true);
			mkdir($path.'/Inputs', 0, true);
			mkdir($path.'/Outputs', 0, true);
			//Create a user workspace in the geoserver
			$geo->createWorkSpace($workspace);

			//copy the default workflow json file to the user folder in the server 
			copy("../WorkFlow.json","../WorkSpaces/".$workspace."/WorkFlow.json");

			//copy the user configuration json file to the user folder in the server
			$configpath = "../WorkSpaces/".$workspace."/config.json";
			if(!file_exists($configpath)){
				copy("../userconfig.json", $configpath);
			}
			$userfolder = realpath("../WorkSpaces/".$workspace);
			$input = realpath("../WorkSpaces/".$workspace."/Inputs");
			$output = realpath("../WorkSpaces/".$workspace."/Outputs");
			//Update the configuration file with user detail
			$string = file_get_contents(realpath($configpath));
			$json = json_decode($string, true);
			$json['username'] = $firstname.' '.$lastname;
			$json['geoserver']['workspace'] = $workspace;
			$json['datafolder']['name'] = $userfolder;
			$json['datafolder']['inputpath'] = $input;
			$json['datafolder']['outputpath'] = $output;
			$newJson = json_encode($json);
			file_put_contents($configpath, $newJson);
		
		}
		echo json_encode(1);
	}
	else
	{
		echo json_encode(0);
	}
}




?>