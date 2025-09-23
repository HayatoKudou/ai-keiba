export const raceAnalysisPrompt = (raceName: string) => `
あなたは競馬予想の専門家です。
以下の情報をもとに、次の【${raceName}】を分析し、 「最終まとめ」と「馬券購入パターン」を出力してください。
的中率よりも回収率を重視してください。

---
### ステップ1：当日の傾向
- 内外枠の有利不利
- 脚質の有利不利
- ペース想定（スロー/平均/ハイ）
- 馬場の速さ・状態

### ステップ2：馬ごとの分析
- 枠順・脚質と傾向の相性
- 斤量・馬体重（増減含む）
- 騎手・調教師の特徴
- 過去成績（同距離・同コース・重賞）
  - 着順だけでなく「相手関係の強さ」「展開や不利」「勝ち時計やラップ水準」も考慮
- 格上げ/格下げ戦
- 人気と実力のギャップ

### ステップ3：総合評価
- 「勝ち負け濃厚」「連下候補」「穴で注目」に分類
- 妙味のある馬を明示

### ステップ4：馬券パターン
- 1000~1500円での具体的構成
- 単勝・複勝で堅実に、ワイド・馬連で妙味を狙う

### 出力形式
以下の3つの要素で構成してください：

1. **analysis_summary（分析まとめ）**
   - レース全体の分析を端的にまとめた文章

2. **horse_evaluations（各馬の評価）**
   - 各馬について以下の情報を含める：
     - number: 馬番
     - name: 馬名
     - score: 10段階評価（1-10の数値）
     - description: その馬の簡単な説明や評価理由

3. **betting_pattern（馬券購入パターン）**
   - budget: 予算（1000~1500円）
   - tickets: 購入する馬券の詳細
     - type: 券種（単勝/複勝/ワイド/馬連）
     - horses: 馬番の配列
     - amount: 購入金額
`;

export const raceAnalysisJsonSchema = {
  type: 'object',
  properties: {
    analysis_summary: {
      type: 'string',
      description: '分析結果の端的なまとめ'
    },
    horse_evaluations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          number: { type: 'number', description: '馬番' },
          name: { type: 'string', description: '馬名' },
          score: { type: 'number', minimum: 1, maximum: 10, description: '10段階評価' },
          description: { type: 'string', description: '簡単な説明' }
        },
        required: ['number', 'name', 'score', 'description'],
        additionalProperties: false
      },
      description: '各馬の評価'
    },
    betting_pattern: {
      type: 'object',
      properties: {
        budget: { type: 'string', description: '予算（例：1000~1500円）' },
        tickets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', description: '券種（単勝/複勝/ワイド/馬連）' },
              horses: { type: 'array', items: { type: 'number' }, description: '馬番' },
              amount: { type: 'number', description: '購入金額' }
            },
            required: ['type', 'horses', 'amount'],
            additionalProperties: false
          },
          description: '購入する馬券の詳細'
        }
      },
      required: ['budget', 'tickets'],
      additionalProperties: false,
      description: '馬券購入パターン'
    }
  },
  required: ['analysis_summary', 'horse_evaluations', 'betting_pattern'],
  additionalProperties: false
};