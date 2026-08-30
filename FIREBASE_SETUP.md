# YMS Busong Evaluation - Firebase 설정

코드에는 Firebase Web App 설정과 Firebase Authentication / Firestore 연결 로직이 적용되어 있습니다.

## 1. Firebase Authentication 켜기

Firebase Console에서 `yms-ele-evaluation` 프로젝트를 엽니다.

1. Authentication → 시작하기
2. Sign-in method → 이메일/비밀번호
3. 이메일/비밀번호를 사용 설정
4. Users → 사용자 추가
5. 실제 사용할 선생님 로그인 이메일과 비밀번호를 등록

앱에서는 회원가입 기능을 제공하지 않고, Firebase Console에서 만든 계정만 로그인에 사용합니다.

## 2. Cloud Firestore 만들기/확인

1. Firestore Database 메뉴로 이동
2. 데이터베이스가 없다면 데이터베이스 만들기
3. 운영 위치를 선택하고 생성

## 3. Firestore Rules 게시

Firestore Database → Rules에서 이 저장소의 `firestore.rules` 내용을 그대로 붙여넣고 `Publish`를 누릅니다.

현재 규칙은 Firebase Authentication에 로그인된 사용자만 아래 데이터에 접근하도록 제한합니다.

- `students`
- `students/{studentId}/evaluations`
- `teachers`

삭제는 앱과 규칙 모두에서 허용하지 않습니다.

## 4. 앱 확인

GitHub Pages 배포 후 아래 순서로 확인합니다.

1. 페이지 상단에서 `Firebase 연결됨 · 선생님 로그인이 필요합니다.` 확인
2. Firebase Console에서 만든 이메일/비밀번호로 로그인
3. `Firebase 연결됨 · [이메일] 로그인` 확인
4. 새 학생 입력
5. 평가 점수 입력
6. `학생정보 + 이번달 평가 저장` 클릭
7. 새로고침 후 같은 계정으로 로그인
8. 등록 학생 목록과 이전 평가가 다시 불러와지는지 확인

## 데이터 구조

```text
students/{studentId}
  name
  teacherName
  schoolType
  studentLevel
  currentBook
  createdBy
  updatedBy
  createdAt
  updatedAt

students/{studentId}/evaluations/{YYYY-MM}
  evaluationKey
  year
  month
  selectedSubjects
  scores
  teacherName
  strengths
  improvements
  feedback
  updatedBy
  updatedAt

teachers/{teacherId}
  name
  active
  createdBy
  createdAt
```
