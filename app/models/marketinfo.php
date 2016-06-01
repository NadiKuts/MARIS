<?php

$host = "host="."130.89.221.193";
$port= "port="."5432";
$dbname = "dbname="."odk_prod";
$credentials="user="."postgres"." password="."123";
        
$db  = pg_connect("$host $port $dbname $credentials");  

//$data = file_get_contents("php://input");
//$email = $data->email;

//fetch Cattle
$cattleQuery = 'SELECT DISTINCT "SEX_CATTLE", "AGE_CATTLE", "QUALITY_CATTLE","BREED","PRICE_CATTLE",
odk_prod."BUILD3559723_CORE"."TOTAL_LIVESTOCK_TRADED_NUMBER_OF_CATTLE_TRADED" AS number_traded, 
"TRANSACTION_CATTLE_BETWEEN",odk_prod."BUILD3559723_CORE"."NAME_OF_THE_ENUMERATOR", odk_prod."BUILD3559723_CORE"."_CREATION_DATE"
from odk_prod."BUILD3559723_CATTLE", odk_prod."BUILD3559723_CORE" WHERE 
odk_prod."BUILD3559723_CORE"."_URI" = odk_prod."BUILD3559723_CATTLE"."_TOP_LEVEL_AURI" ORDER BY odk_prod."BUILD3559723_CORE"."_CREATION_DATE" ASC';

$result = pg_query($db, $cattleQuery);
$a = array();
$b = array();
$count = 0;

$outp = "[";

while ($row = pg_fetch_row($result)) {
    $count++;
    if ($outp != "[") {$outp .= ",";}
    $outp .= '{"sex":"'  . $row[0] . '",';
    $outp .= '"age":"'   . $row[1]. '",';
    $outp .= '"quality":"'   . $row[2]. '",';
    $outp .= '"breed":"'   . $row[3]. '",';
    $outp .= '"price":"'   . $row[4]. '",';
    $outp .= '"number":"'   . $row[5]. '",';
    $outp .= '"association":"'   . $row[6]. '",';
    $outp .= '"enumerator":"'   . $row[7]. '",';
    $outp .= '"date":"'. $row[8]. '"}'; 
}
$outp .="]";

//Fetch Sheep
$sheepQuery = 'SELECT DISTINCT "SEX_SHEEP", "AGE_SHEEP", "QUALITY_SHEEP", "BREED_SHEEP", "PRICE_SHEEP",
odk_prod."BUILD3559723_CORE"."TOTAL_LIVESTOCK_TRADED_NUMBER_OF_SHEEP_TRADED" AS number_traded,
"TRANSACTION_SHEEP_BETWEEN",odk_prod."BUILD3559723_CORE"."NAME_OF_THE_ENUMERATOR", odk_prod."BUILD3559723_CORE"."_CREATION_DATE" from odk_prod."BUILD3559723_SHEEP", odk_prod."BUILD3559723_CORE" WHERE 
odk_prod."BUILD3559723_CORE"."_URI" = odk_prod."BUILD3559723_SHEEP"."_TOP_LEVEL_AURI" ORDER BY odk_prod."BUILD3559723_CORE"."_CREATION_DATE" ASC';
$sheepResult = pg_query($db, $sheepQuery);
$a = array();
$b = array();
$count = 0;

$sheep = "[";
while ($row = pg_fetch_row($sheepResult)) {
    $count++;
    if ($sheep != "[") {$sheep .= ",";}
    $sheep .= '{"sex":"'  . $row[0] . '",';
    $sheep .= '"age":"'   . $row[1]. '",';
    $sheep .= '"quality":"'   . $row[2]. '",';
    $sheep .= '"breed":"'   . $row[3]. '",';
    $sheep .= '"price":"'   . $row[4]. '",';
    $sheep .= '"number":"'   . $row[5]. '",';
    $sheep .= '"association":"'   . $row[6]. '",';
    $sheep .= '"enumerator":"'   . $row[7]. '",';
    $sheep .= '"date":"'. $row[8]. '"}'; 
}
$sheep .="]";


$goatsQuery = 'SELECT DISTINCT "SEX_GOAT", "AGE_GOAT", "QUALITY_GOAT","BREED_GOAT","PRICE_GOAT",
odk_prod."BUILD3559723_CORE"."TOTAL_LIVESTOCK_TRADED_NUMBER_OF_GOATS_TRADED" AS number_traded,
"TRANSACTION_GOAT_BETWEEN",odk_prod."BUILD3559723_CORE"."NAME_OF_THE_ENUMERATOR", odk_prod."BUILD3559723_CORE"."_CREATION_DATE"
from odk_prod."BUILD3559723_GOATS", odk_prod."BUILD3559723_CORE" WHERE
odk_prod."BUILD3559723_CORE"."_URI" = odk_prod."BUILD3559723_GOATS"."_TOP_LEVEL_AURI" ORDER BY odk_prod."BUILD3559723_CORE"."_CREATION_DATE" ASC';
$goatResult = pg_query($db, $goatsQuery);
$a = array();
$b = array();
$count = 0;

$goats = "[";
while ($row = pg_fetch_row($goatResult)) {
    $count++;
    if ($goats != "[") {$goats .= ",";}
    $goats .= '{"sex":"'  . $row[0] . '",';
    $goats .= '"age":"'   . $row[1]. '",';
    $goats .= '"quality":"'   . $row[2]. '",';
    $goats .= '"breed":"'   . $row[3]. '",';
    $goats .= '"price":"'   . $row[4]. '",';
    $goats .= '"number":"'   . $row[5]. '",';
    $goats .= '"association":"'   . $row[6]. '",';
    $goats .= '"enumerator":"'   . $row[7]. '",';
    $goats .= '"date":"'. $row[8]. '"}'; 
}
$goats .="]";


$data = '{"cattle":'.$outp.',"sheep":'.$sheep.',"goats":'.$goats.'}';
echo $data;
/*if($count > 0){
	echo json_encode($a);
}else{
	echo json_encode($count);
}*/
pg_close();


?>