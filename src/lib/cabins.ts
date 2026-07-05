// 오두막(주제) 4채의 메타데이터 — 홈 지도와 각 오두막 페이지가 공유한다.
export interface CabinMeta {
  key: string;
  name: string;
  color: string;
  roofFill: string;
  intro: string;
  seed: number;
  icon?: string;
  ready: boolean;
}

export const cabins: CabinMeta[] = [
  {
    key: 'eyes',
    name: '안경 · 눈 관',
    color: '#3f6f9f',
    roofFill: '#cfe0ef',
    intro: '눈이 어떻게 보고, 왜 흐려지고, 렌즈가 뭘 바꾸는가.',
    seed: 101,
    ready: true,
  },
  {
    key: 'math',
    name: '수학 · 물리 관',
    color: '#4a7a5a',
    roofFill: '#d2e6d6',
    intro: '∫와 π가 왜 아름다운가. 세상을 재는 언어들.',
    seed: 202,
    icon: '∫ π',
    ready: true,
  },
  {
    key: 'ai',
    name: 'AI 관',
    color: '#7a6aab',
    roofFill: '#e0daf0',
    intro: '삼성SDS 출신의 잡생각들. 만드는 김에 떠드는 곳.',
    seed: 303,
    icon: '◈',
    ready: false,
  },
  {
    key: 'talk',
    name: '잡담 정자',
    color: '#c0562f',
    roofFill: '#f2ddc9',
    intro: '주제 없는 서랍. 그냥 궁금한 것들.',
    seed: 404,
    ready: false,
  },
];

export const cabinMap: Record<string, CabinMeta> = Object.fromEntries(
  cabins.map((c) => [c.key, c]),
);
