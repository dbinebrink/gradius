<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

header('Content-Type: application/json');

$db_host = "개인정보"; 

$db_user = "개인정보"; 

$db_passwd = "개인정보";

$db_name = "개인정보";



// MySQL - DB 접속.

$conn = mysqli_connect($db_host,$db_user,$db_passwd,$db_name);

if (mysqli_connect_errno()){

echo "MySQL 연결 오류: " . mysqli_connect_error();

exit;
}


// 문자셋 설정, utf8.

mysqli_set_charset($conn,"utf8");


// 초기화
$pre = "TRUNCATE gradios";
if(!mysqli_query($conn, $pre)) {
    echo "Table Query Error:". mysqli_error($conn);

    exit;
}

mysqli_close($conn);

?>