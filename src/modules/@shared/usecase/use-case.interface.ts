export interface UseCaseInterface<P = any, R = any> {
  execute(input: P | void): Promise<R>;
}
