export interface VCContact {
  id: string;
  name: string;
  title: string;
  firm: string;
  location: string;
  image: string;
  focus: string[];
  matchScore: number;
}

export interface MediaContact {
  id: string;
  name: string;
  title: string;
  firm: string;
  location: string;
  image: string;
  focus: string[];
  matchScore: number;
}

export interface Filter {
  category: string;
  label: string;
  options: Array<{
    value: string;
    count: number;
  }>;
}