<?php
include_once 'connection.php';
$DBConnect = new DB_Connect();
$db = $DBConnect->connect();
$data = json_decode(file_get_contents("php://input"));

$firstname = $data->firstname;
$lastname = $data->lastname;
$company = $data->company;
$email = $data->email;
$password = $data->password;


$query = "INSERT INTO users(firstname,lastname,company, email, password) VALUES(?,?,?,?,?)";

$insertstmt = $db->prepare($query);
$insertstmt->bind_param("sssss", $firstname,$lastname,$company,$email,$password);
$insertstmt->execute();
$result = $insertstmt->affected_rows;

echo json_encode($result);

//echo json_encode($result);

?>