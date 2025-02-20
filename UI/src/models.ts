export type AnalysisResponse = {
  predictions: Prediction[];
};

export type Prediction = {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Analysis = {
  details: Details[];
  image: string;
};

export type Details = {
  confidence: string;
  type: string;
  date: string;
  action: string;
};
