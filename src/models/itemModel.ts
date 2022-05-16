export interface Item {
  _id: number;
  item: string;
  amount: number;
  value: number;
  client_id: string;
  createdAt: Date;
  updatedAt?: Date;
}
