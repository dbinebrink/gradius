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


// 테이블 정리
$pre = "DELETE FROM gradios WHERE Score IN
(
SELECT * FROM
(
    (SELECT Score FROM gradios ORDER BY Score DESC LIMIT 10, 34324234234) as tmp
)
)";
if(!mysqli_query($conn, $pre)) {
    echo "Table Query Error:". mysqli_error($conn);
}

// 테이블에 값 쓰기.
$sql = "INSERT INTO gradios (Name, Score)

VALUES (\"$_GET[Name]\" , $_GET[Score])";

if (mysqli_query($conn,$sql)){

    $sql2 = "SELECT * FROM gradios ORDER BY Score DESC LIMIT 10";
    if ($result = mysqli_query($conn,$sql2)){
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
} else {
    echo "테이블에 값 쓰기 오류: " . mysqli_error($conn);
}

mysqli_close($conn);

?>