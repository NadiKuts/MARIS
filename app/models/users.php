<?php
include_once 'connection.php';
$DBConnect = new DB_Connect();
$db = $DBConnect->connect();
$data = json_decode(file_get_contents("php://input"));

$type = $data->type;
if($type == "view"){
	$query = "SELECT DISTINCT firstname, lastname, email from mamase.users WHERE users.roleid = 1 AND users.deleted = FALSE ";
	$result = pg_query($db, $query);
	$a = array();
	$b = array();
	$count = 0;
	while ($row = pg_fetch_row($result)) {
	    $count++;
	    $b["id"] = $count;
	    $b["name"] = $row[0].' '.$row[1];
	    $b["email"] = $row[2];
	    array_push($a, $b);
	}
	if($count > 0){
		echo json_encode($a);
	}
	else{
		echo json_encode(0);
	}

}else if($type == "edit"){
	$id = $data->id;
	$name = $data->name;
	$description = $data->description;
	$query = "UPDATE mamase.user_role set rolename='$name' ,description='$description' WHERE id=$id";
	$result = pg_query($db, $query);
	if ($result) {   	
		echo json_encode(1);
	}
	else
	{
		echo json_encode(0);
	}

}else if($type == "delete"){
	$id = $data->id;
	$query = "UPDATE mamase.users set deleted=TRUE  WHERE id=$id";
	$result = pg_query($db, $query);
	if ($result) {   	
		echo json_encode(1);
	}
	else
	{
		echo json_encode(0);
	}

}else if($type == "get"){
	$id = $data->id;
	$query = "SELECT rolename, description from mamase.user_role WHERE deleted=FALSE AND id=$id";
	$result = pg_query($db, $query);
	$a = array();
	$b = array();
	while ($row = pg_fetch_row($result)) {
	    $b["name"] = $row[0];
	    $b["description"] = $row[1];
	    array_push($a, $b);
	    break;
	}
	echo json_encode($a);
}
else{
	echo json_encode(-1);
}

?>