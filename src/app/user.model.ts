import * as t from "io-ts";

const User = t.type({
  id: t.number,
  name: t.string,
  username: t.string,
  email: t.string
});
type User = t.TypeOf<typeof User>;
export { User };

export type UserProps = t.PropsOf<typeof User>;
