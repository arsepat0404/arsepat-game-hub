export type GameStatus = "Released" | "On-going" | "Coming Soon" | string;

export interface Game {
  id: string;
  title: string;
  description: string;
  status: GameStatus;
  play_url: string;
  image_url: string;
  progress_percent: number;
  genre: string;
  tags: string[];
}

export interface LocalizationRow {
  key: string;
  id_text: string;
  en_text: string;
}

export interface MetadataRow {
  setting_key: string;
  setting_value: string;
}

export type Lang = "id" | "en";
