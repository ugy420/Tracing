export type Status = 'pending' | 'viewed';

export interface Feedback {
  id: string;
  user_id: string;
  message: Text;
  status: Status;
}
