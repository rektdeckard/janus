export type EvalSuccess<T> = { status: "success"; result: T };
export type EvalError<E> = { status: "error"; result: E };
export type EvalResult<T, E> = EvalSuccess<T> | EvalError<E>;

export type Zone = {
  id: string;
  content: string;
  line: number;
  root: HTMLElement;
};
