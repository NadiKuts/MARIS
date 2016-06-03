<?php
$logfh = fopen("GeoserverPHP.log", 'w') or die("can't open log file");
include 'GeoClass.php';
$geo = new GeoClass();
$path = "../WorkSpaces/Robert_Ohuru/Inputs/Protected-Areas_WGS/Protected-Areas_WGS.shp";
if(file_exists($path)){
	$geo->createWorkSpace("Bob");
	$geo->addLayer("Bob", "Protected", realpath($path));
	//fwrite($logfh, realpath($path));
}


/*$command1 = 'ilwis -c setworkingcatalog(file:///B:/working_dir/Inputs/eth_m_town)';
$command2 = 'Ilwis -c robert2.shp{format(gdal,\"ESRI Shapefile\")}=raster2point(Ethiopia.mpr)';
try {
	exec('ilwis -c setworkingcatalog(file:///B:/working_dir/Inputs/eth_m_town)');
	exec($command2);
} catch (Exception $e) {	
    fwrite($logfh, $e->getMessage());
}
//$string = file_get_contents("../WorkSpaces/Robert_Ohuru/data.txt");

/*$file = fopen("../WorkSpaces/Robert_Ohuru/data.txt", "r");
$count = 0;
while(!feof($file)){
    $line = fgets($file);
    fwrite($logfh, $line);
    $command1 = "ilwis -c setworkingcatalog(file:///B:/working_dir/Inputs/eth_m_town)";
    $command2 = 'Ilwis -c robert2.shp{format(gdal,\"ESRI Shapefile\")}=raster2point(Ethiopia.mpr)';
    
    try {
        exec($command1);
        exec($command2);
    } catch (Exception $e) {
    	fwrite($logfh, $e->getMessage());
    }
    $count++;
}*/
//fwrite($logfh, $count);
//fclose($file);











/*$string = file_get_contents("../WorkSpaces/Robert_Ohuru/WorkFlow.json");
$json = json_decode($string, true);
$count = 0;
$bar = array();
$value = 100;
$json['workflows'][0]['operations'][4]['inputs'][3]['value'] = $value;
fwrite($logfh, $json['workflows'][0]['operations'][4]['inputs'][3]['value']);
/*foreach ($json as $f) { 	
	foreach ($f as $k) {
		foreach ($k as $key => $val) {
			if (!is_array($val)) {
				//fwrite($logfh, $val.'\n');
			}else{
				foreach ($val as $key => $value) {
					if(!is_array($value)){
						//fwrite($logfh, $value.'\n');
					}
				}
			}		
			$count++;
		}
    }
}*/
//fwrite($logfh, $count);
//fclose($logfh);
//$newJsonString = json_encode($json);
//file_put_contents('../WorkSpaces/Robert_Ohuru/WorkFlow.json', $newJsonString);

?>