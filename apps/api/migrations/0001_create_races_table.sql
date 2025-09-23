  -- レースマスタテーブル
  CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    grade TEXT,
    place TEXT,
    distance INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- サンプルデータ
  INSERT INTO races (name, date, grade, place, distance) VALUES
    ('有馬記念', '2024-12-29', 'G1', '中山', 2500),
    ('天皇賞（春）', '2024-04-28', 'G1', '京都', 3200),
    ('安田記念', '2024-06-02', 'G1', '東京', 1600);
