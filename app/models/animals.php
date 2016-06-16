<?php
include_once 'connection.php';
$DBConnect = new DB_Connect();
$db = $DBConnect->connect();
//$data = json_decode(file_get_contents("php://input"));

$query = "SELECT species, bodyweight, grassindiet, dm_grass, procent_bodyweight from mamase.animalsfood";

$result = pg_query($db, $query);

$a = array();
$b = array();
$count = 0;
while ($row = pg_fetch_row($result)) {
    $count++;
    $b["species"] = $row[0];
    $b["bodyweight"] = $row[1];
    $b["grassindiet"] = $row[2];
    $b["dm_grass"] = $row[3];
    $b["procent_bodyweight"] = $row[4];
    array_push($a, $b);
}
if($count > 0){
	echo json_encode($a);
}else{
	echo json_encode(0);
}
pg_close();

?>