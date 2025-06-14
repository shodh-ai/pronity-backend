export interface FlowElementInReportDTO {
  id: string;
  type: string;
  level: string;
  topic: string;
  task: string;
  order: number;
}

export default interface ReportDTO {
  id: string;
  userId: string;
  flowId: string;
  date: Date;
  userText: string;
  mainComment: string;
  flow: FlowElementInReportDTO;
  comments: CommentDTO[];
}

export interface CommentDTO {
  id: string;
  startIndex: number;
  endIndex: number;
  wrongText: string;
  rightText: string;
  info: string;
  date: Date;
}
