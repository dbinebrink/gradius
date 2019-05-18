##스테이지 배경,bgm 랜덤으로 바뀝니다 (#803)
	현재 #760 이슈를 해결하여서 2스테이지를 주기로 스테이지 배경이 랜덤하게 바뀌고 bgm도 그에 맞게 변화할 것입니다.
	변화 주기를 바꾸고 싶으신 분들은 game.js에서 update 함수 바로 밑에있는
	if(!backgroundChanged && (stage % 2 == 0||stage == 1))에서
	(stage%n==0)에서 n을 자기가 원하는 주기로 바꾸시면 됩니다.

##Back-up
 * Back-up Repo for developers : https://github.com/DDongKim/gradios