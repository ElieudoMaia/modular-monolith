export interface UseCaseInterface<P = any, R = any> {
  execute(input: P): Promise<R>;
}
