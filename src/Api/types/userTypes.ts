export type Gender = 'Male' | 'Female';

export interface UserRequest {
  username: string;
  dob: string;
  gender: Gender;
  starCount: number;
}

export interface UserResponse {
  id: string;
  username: string;
  role_id: number;
  dob: string;
  gender: Gender;
  starCount: number;
}
