export default interface ReportPayload {
  type: string;
  user_text: string;
  main_comment: string;
  flowElementId: string;
  comments: Comment[];
}

interface Comment {
  start: number;
  end: number;
  rightText: string;
  info: string;
}
