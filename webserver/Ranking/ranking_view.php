<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

header('Content-Type: application/json');

$db_host = "여기는"; 

$db_user = "pbt98의"; 

$db_passwd = "개인정보";

$db_name = "입니다"; //일부러 올리지 않았습니다.



// MySQL - DB 접속.

$conn = mysqli_connect($db_host,$db_user,$db_passwd,$db_name);

if (mysqli_connect_errno()){

echo "MySQL 연결 오류: " . mysqli_connect_error();

exit;
}


// 문자셋 설정, utf8.

mysqli_set_charset($conn,"utf8");


// 랭킹 불러오기
$sql = "SELECT * FROM gradios ORDER BY Score DESC LIMIT 10";
if ($result = mysqli_query($conn,$sql)){
    $return_array = array();
    while ($row = mysqli_fetch_array($result)) {
        $row_array['Name'] = $row['Name'];
        $row_array['Score'] = $row['Score'];
        array_push($return_array, $row_array);
    }
    
    echo json_encode($return_array);
} else {
    echo "Table Query Error: " . mysqli_error($conn);
    exit;
}

mysqli_close($conn);

?>