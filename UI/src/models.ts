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

export type IdeagenAssuranceRequest = {
  name: string;
  fields: IdeagenAssuranceFields[];
};

export type IdeagenAssuranceFields = {
  "Hazard Type": string;
  Location: string;
  "Recommended Actions": string;
  Description: string;
};
