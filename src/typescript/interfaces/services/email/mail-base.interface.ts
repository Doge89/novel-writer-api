export interface MailBase<T> {
  send(): Promise<T>;
}
