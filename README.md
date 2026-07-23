# ALLPASS Frontend

ALLPASS 사용자·관리자 웹 화면을 제공하는 프론트엔드 저장소입니다. 백엔드는 별도 `allpass` 저장소에서 관리합니다.

## 기술 구성

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js App Router |
| UI | React, TypeScript, CSS Modules |
| 아이콘 | Lucide React |
| 런타임 | Node.js 24 |

## 프로젝트 구조

```text
app/
├─ (user)/                 일반 사용자 라우트
├─ admin/                  관리자 라우트
└─ login/                  로그인 화면
features/
├─ auth/                   현재 사용자와 로그인 연동
├─ dashboard/              사용자 대시보드
├─ exam/                   시험 조회·응시·신청
├─ admin/                  관리자 화면
└─ learning/               학습관리 모델과 UI
k8s/                       프론트 Deployment·Service·Ingress
.github/workflows/         이미지 빌드 및 배포 자동화
```

## 로컬 실행

```bash
npm install
npm run dev
```

`npm run dev`는 `package.json`에 정의된 HTTPS 개발 호스트와 포트를 사용합니다. 로컬 인증서는 Next.js 개발 서버가 생성하며 `certificates/`는 Git에서 제외됩니다.

## 환경변수

로컬 개발값은 Git에서 제외되는 `.env.development.local`에 둡니다.

```dotenv
NEXT_PUBLIC_API_URL=https://<backend-host>
```

`NEXT_PUBLIC_*` 값은 브라우저에 공개되고 빌드 결과에 포함됩니다. 비밀번호, 토큰, 인증서 경로와 Secret은 절대로 넣지 않습니다.

프로덕션 빌드에서는 GitHub Repository Variable의 `NEXT_PUBLIC_API_URL`을 Docker build argument로 전달합니다.

## 실제 API 연결 범위

- 현재 사용자와 역할 조회
- 시험 목록 및 상세 조회
- 응시 세션 시작
- 답안 임시 저장과 최종 제출
- 시험 신청 조회·등록·취소

관리자 통계, 사용자 학습 대시보드, 학습관리와 오답노트 일부는 대응 백엔드 API가 추가되기 전까지 별도 전환 작업이 필요합니다.

## 검증

```bash
npm run lint
npm run build
```

## 배포

`main` 브랜치의 애플리케이션 코드가 변경되면 GitHub Actions가 다음 작업을 수행합니다.

1. `NEXT_PUBLIC_API_URL` 설정을 검증합니다.
2. 프론트엔드 컨테이너 이미지를 빌드합니다.
3. 컨테이너 레지스트리에 불변 태그와 최신 태그를 업로드합니다.
4. Kubernetes 매니페스트의 이미지 태그를 갱신합니다.
5. GitOps 도구가 매니페스트 변경을 클러스터에 반영합니다.

인증정보, 운영 접속정보, 실제 Secret 값은 이 저장소의 문서와 매니페스트에 기록하지 않습니다.
