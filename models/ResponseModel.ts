export default interface ResponseModel<T> {
  msg: string;
  success: boolean;
  data: T | null;
}
