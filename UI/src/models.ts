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
