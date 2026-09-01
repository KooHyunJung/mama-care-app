export interface ChecklistItem {
  key: string;
  title: string;
  isCheckup?: boolean;
}

export interface PregnancyPeriod {
  key: string;
  label: string;
  weekStart: number;
  weekEnd: number;
  items: ChecklistItem[];
}

export interface BirthPeriod {
  key: string;
  label: string;
  monthStart: number;
  monthEnd: number;
  items: ChecklistItem[];
}

export const PREGNANCY_CHECKLIST: PregnancyPeriod[] = [
  {
    key: "p_1", label: "임신 1개월", weekStart: 1, weekEnd: 4,
    items: [
      { key: "p1_1", title: "임신 확인 (소변 검사)" },
      { key: "p1_2", title: "기본 혈액 검사 (혈액형·빈혈·간염·갑상선 등)" },
      { key: "p1_3", title: "자궁경부암 검사" },
    ],
  },
  {
    key: "p_2", label: "임신 2개월", weekStart: 5, weekEnd: 8,
    items: [
      { key: "p2_1", title: "첫 산전 방문" },
      { key: "p2_2", title: "질초음파 (태아 심박동 확인)" },
    ],
  },
  {
    key: "p_3", label: "임신 3개월", weekStart: 9, weekEnd: 12,
    items: [
      { key: "p3_1", title: "NT 검사 (목덜미 투명대 측정)" },
      { key: "p3_2", title: "1차 기형아 검사" },
    ],
  },
  {
    key: "p_4", label: "임신 4개월", weekStart: 13, weekEnd: 16,
    items: [
      { key: "p4_1", title: "2차 기형아 검사 (쿼드마커)" },
      { key: "p4_2", title: "양수검사 (고위험군)" },
    ],
  },
  {
    key: "p_5", label: "임신 5개월", weekStart: 17, weekEnd: 20,
    items: [
      { key: "p5_1", title: "정밀 초음파" },
    ],
  },
  {
    key: "p_6", label: "임신 6개월", weekStart: 21, weekEnd: 24,
    items: [
      { key: "p6_1", title: "임신성 당뇨 선별검사 (50g)" },
      { key: "p6_2", title: "정기 진찰" },
    ],
  },
  {
    key: "p_7", label: "임신 7개월", weekStart: 25, weekEnd: 28,
    items: [
      { key: "p7_1", title: "임신성 당뇨 정밀검사 (필요시 100g)" },
      { key: "p7_2", title: "빈혈 재검사" },
      { key: "p7_3", title: "정기 진찰" },
    ],
  },
  {
    key: "p_8", label: "임신 8개월", weekStart: 29, weekEnd: 32,
    items: [
      { key: "p8_1", title: "태아 성장 초음파" },
      { key: "p8_2", title: "정기 진찰 (2주마다)" },
    ],
  },
  {
    key: "p_9", label: "임신 9개월", weekStart: 33, weekEnd: 36,
    items: [
      { key: "p9_1", title: "GBS 검사 (B군 연쇄상구균)" },
      { key: "p9_2", title: "태아 위치 확인" },
      { key: "p9_3", title: "정기 진찰 (2주마다)" },
    ],
  },
  {
    key: "p_10", label: "임신 10개월", weekStart: 37, weekEnd: 40,
    items: [
      { key: "p10_1", title: "매주 정기 진찰" },
      { key: "p10_2", title: "NST (태아 심박 모니터링)" },
      { key: "p10_3", title: "양수량 확인" },
    ],
  },
];

export const BIRTH_CHECKLIST: BirthPeriod[] = [
  {
    key: "b_0", label: "0개월 (출생)", monthStart: 0, monthEnd: 0,
    items: [
      { key: "b0_1", title: "결핵 (BCG)" },
      { key: "b0_2", title: "B형간염 (HepB 1차)" },
      { key: "b0_3", title: "1차 영유아 검진 (생후 14일~35일)", isCheckup: true },
    ],
  },
  {
    key: "b_1", label: "1개월", monthStart: 1, monthEnd: 1,
    items: [
      { key: "b1_1", title: "B형간염 (HepB 2차)" },
    ],
  },
  {
    key: "b_2", label: "2개월", monthStart: 2, monthEnd: 2,
    items: [
      { key: "b2_1", title: "디프테리아/파상풍/백일해 (DTaP 1차)" },
      { key: "b2_2", title: "폴리오 (IPV 1차)" },
      { key: "b2_3", title: "b형헤모필루스인플루엔자 (Hib 1차)" },
      { key: "b2_4", title: "폐렴구균 (PCV 1차)" },
      { key: "b2_5", title: "로타바이러스 감염증 (RV1, RV5 1차)" },
    ],
  },
  {
    key: "b_4", label: "4개월", monthStart: 4, monthEnd: 4,
    items: [
      { key: "b4_1", title: "디프테리아/파상풍/백일해 (DTaP 2차)" },
      { key: "b4_2", title: "폴리오 (IPV 2차)" },
      { key: "b4_3", title: "b형헤모필루스인플루엔자 (Hib 2차)" },
      { key: "b4_4", title: "폐렴구균 (PCV 2차)" },
      { key: "b4_5", title: "로타바이러스 감염증 (RV1, RV5 2차)" },
      { key: "b4_6", title: "2차 영유아 검진 (생후 4~6개월)", isCheckup: true },
      { key: "b4_7", title: "호흡기세포융합바이러스 (RSV)" },
    ],
  },
  {
    key: "b_6", label: "6개월", monthStart: 6, monthEnd: 6,
    items: [
      { key: "b6_1", title: "B형간염 (HepB 3차)" },
      { key: "b6_2", title: "디프테리아/파상풍/백일해 (DTaP 3차)" },
      { key: "b6_3", title: "b형헤모필루스인플루엔자 (Hib 3차)" },
      { key: "b6_4", title: "폐렴구균 (PCV 3차)" },
      { key: "b6_5", title: "로타바이러스 감염증 (RV5 3차)" },
      { key: "b6_6", title: "폴리오 (IPV 3차)" },
      { key: "b6_7", title: "인플루엔자 (IIV) - 매년 접종" },
    ],
  },
  {
    key: "b_9_12", label: "9~12개월", monthStart: 9, monthEnd: 12,
    items: [
      { key: "b9_1", title: "3차 영유아 검진 (생후 9~12개월)", isCheckup: true },
    ],
  },
  {
    key: "b_12_15", label: "12~15개월", monthStart: 12, monthEnd: 15,
    items: [
      { key: "b12_1", title: "b형헤모필루스인플루엔자 (Hib 4차)" },
      { key: "b12_2", title: "폐렴구균 (PCV 4차)" },
      { key: "b12_3", title: "홍역/유행성이하선염/풍진 (MMR 1차)" },
      { key: "b12_4", title: "수두 (VAR)" },
      { key: "b12_5", title: "A형간염 (HepA 1~2차)" },
      { key: "b12_6", title: "일본뇌염 (사백신 1~2차, 생백신 1차)" },
    ],
  },
  {
    key: "b_15_18", label: "15~18개월", monthStart: 15, monthEnd: 18,
    items: [
      { key: "b15_1", title: "디프테리아/파상풍/백일해 (DTaP 4차)" },
    ],
  },
  {
    key: "b_18_24", label: "18~24개월", monthStart: 18, monthEnd: 24,
    items: [
      { key: "b18_1", title: "4차 영유아 검진 (생후 18~24개월)", isCheckup: true },
    ],
  },
  {
    key: "b_24_36", label: "24~36개월", monthStart: 24, monthEnd: 36,
    items: [
      { key: "b24_1", title: "일본뇌염 (사백신 3차, 생백신 2차)" },
      { key: "b24_2", title: "5차 영유아 검진 (생후 30~36개월)", isCheckup: true },
      { key: "b24_3", title: "폐렴구균 (PPSV) - 고위험군에 한함" },
    ],
  },
  {
    key: "b_42_48", label: "42~48개월", monthStart: 42, monthEnd: 48,
    items: [
      { key: "b42_1", title: "6차 영유아 검진 (생후 42~48개월)", isCheckup: true },
    ],
  },
  {
    key: "b_4_6y", label: "만 4~6세", monthStart: 48, monthEnd: 72,
    items: [
      { key: "b4y_1", title: "디프테리아/파상풍/백일해 (DTaP 5차)" },
      { key: "b4y_2", title: "폴리오 (IPV 4차)" },
      { key: "b4y_3", title: "홍역/유행성이하선염/풍진 (MMR 2차)" },
      { key: "b4y_4", title: "7차 영유아 검진 (생후 54~60개월)", isCheckup: true },
      { key: "b4y_5", title: "8차 영유아 검진 (생후 66~71개월)", isCheckup: true },
    ],
  },
  {
    key: "b_6y", label: "만 6세", monthStart: 72, monthEnd: 84,
    items: [
      { key: "b6y_1", title: "일본뇌염 (사백신 4차)" },
    ],
  },
  {
    key: "b_11_12y", label: "만 11~12세", monthStart: 132, monthEnd: 144,
    items: [
      { key: "b11y_1", title: "디프테리아/파상풍/백일해 (Tdap/Td 6차)" },
      { key: "b11y_2", title: "사람유두종바이러스 감염증 (HPV 1~2차)" },
      { key: "b11y_3", title: "일본뇌염 (사백신 5차)" },
    ],
  },
];
