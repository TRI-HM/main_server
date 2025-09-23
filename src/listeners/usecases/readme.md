```ts
type A = {
  a: string;
  b: number;
};

type B = {
  c: boolean;
  d: Date;
};

type C = A extent B;

type D = Omit<C, "d">;
// D sẽ có các thuộc tính: a, b, c

type E = A & {
  c: string;
};


```
