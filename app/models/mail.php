<?php
require_once 'config.php';
require("mail/class.phpmailer.php");

$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$subject=$data->subject;
$message = $data->message;

$mail = new PHPMailer();

$mail->IsSMTP();                                      // set mailer to use SMTP
$mail->Host = EMAIL_HOST;  // specify main and backup server
$mail->SMTPAuth = true;     // turn on SMTP authentication
$mail->Username = USERNAME;  // SMTP username
$mail->Password = PASSWORD; // SMTP password
$mail->From = FROM_ADDRESS;
$mail->FromName = FROM_NAME;
$mail->AddAddress($email);
//$mail->AddAddress("ellen@example.com");                  // name is optional
//$mail->AddReplyTo("info@example.com", "Information");  //Address for reply

$mail->WordWrap = 500;                                 // set word wrap to 50 characters
//$mail->AddAttachment("/var/tmp/file.tar.gz");         // add attachments
//$mail->AddAttachment("/tmp/image.jpg", "new.jpg");    // optional name
$mail->IsHTML(true);                                  // set email format to HTML

$mail->Subject = $subject;
$body = $message;
$mail->Body= $body;
//$mail->AltBody = "This is the body in plain text for non-HTML mail clients";		
if(!$mail->Send())
{
	echo 0;	   		
}else{
	echo 1;
}
?>