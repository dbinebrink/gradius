# Electron wiki
node.js와 npm이 설치되어있다고 가정합니다.

## electron install
   ```
   npm install electron --save-dev
   ```
전역 설치
   ```
   npm install electron -g
   ```

## electron-packager install

Global installation:
```
electron-packager . --ignore=node_modules/electron-packager --ignore=.git --overwrite --ignore="\.git(ignore|modules)" --out=app --platform=[darwin OR win32 OR linux]
```

Global installation in Window PowerShell:
```
electron-packager . --ignore=node_modules/electron-packager --ignore=.git --overwrite  --out=app --platform="win32" --ignore=`""\.git(ignore^|modules)`""
```

Local electron-packager installation:
```
node ./node_modules/electron-packager/cli.js . --ignore=node_modules/electron-packager --ignore=.git --overwrite --ignore="\.git(ignore|modules)" --out=app --platform=[darwin OR win32 OR linux]
```


## terminal을 통한 gradios electron app 실행
gradios 디렉토리 안에서
   ```
   electron .
   ```
위 명령어가 실행되지 않을 경우
   ```
   ./node_modules/electron/cli.js .
   ```

## Yarn 설치
Yarn은 자바스크립트 패키지 매니저 중 하나 입니다.

### Mac OS

1. 아래 명령어를 통해 Homebrew을 설치합니다.

   ```
   /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   ```

2. 그 후, Homebrew를 이용해, Yarn을 설치합니다.  

   ```
   brew install yarn
   ```

### Windows

1. PowerShell을 관리자 모드로 실행시킨 뒤, 아래 명령어를 통해 chocolatey를 설치합니다.

   ```
   Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
   ```

2. 아래 명령어를 통해 Yarn을 설치합니다.

   ```
   choco install yarn
   ```

## Gradios 실행 파일 만들기
자신의 운영체제에서 다른 OS플랫폼을 만들기 위해서는, 별도의 Multi Flatform Build가 필요합니다.</br></br>
gradios 디렉토리 안에서

   ```
   yarn add --dev electron-packager
   ```
* 모든 운영체제의 실행 파일을 만들 때

   ```
   yarn run build2
   ```

* windows의 실행 파일을 만들 때

   ```
   yarn run build2:windows
   ```

* macOs의 실행 파일을 만들 때

   ```
   yarn run build2:darwin
   ```

* linux의 실행 파일을 만들 때

   ```
   yarn run build2:linux
   ```

## Multi Platform Build

### mac에서

Yarn 설치를 위해, Homebrew를 설치했다고 가정합니다.

1. linux를 build

   ```
   brew install gnu-tar graphicsmagick xz
   brew install rpm
   ```

2. windows를 build

   ```
   brew install wine
   brew install mono
   ```

### linux에서 windows를 build

   ```
   sudo add-apt-repository ppa:ubuntu-wine/ppa -y
   sudo apt-get update
   sudo apt-get install --no-install-recommends -y wine1.8
   sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
   echo "deb http://download.mono-project.com/repo/debian wheezy main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
   sudo apt-get update
   sudo apt-get install --no-install-recommends -y mono-devel ca-certificates-mono
   ```
   
