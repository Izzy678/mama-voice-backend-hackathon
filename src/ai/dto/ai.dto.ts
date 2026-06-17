export interface AiQueryBody {
  textQuery: string;
}

export interface AiQueryResponse {
  aiResponseText: string;
  isDangerSign: boolean;
}
