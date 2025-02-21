export type Analysis = {
  details: Details[];
  image: string;
};

export type Action = {
  title: string;
  description: string;
  steps: string[];
};

export type Details = {
  confidence: string;
  type: string;
  date: string;
  action: Action;
};
