import { wrapAsync } from "../../util/wrapAsync";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  // Perform registration logic here

  const hashedPassword = await bcrypt.hash(password, 10);
  // Save the user to the database (omitted for brevity)
  console.log(hashedPassword);
  //TODO: lưu hashedPassword vào db. Khi người dùng đang nhập thì xác thực bằng cách gọi bcrypt.compare cùng với hashedPassword đã lưu

  bcrypt.compare(password, hashedPassword!, (err, result) => { // Khi đang nhập thì gọi hash từ db để xác thực
    if (err) {
      console.error(err);
    } else {
      console.log(result); // true. là xác thực thành công.
    }
  });

  res.send({ message: "User registered", data: { email } });
});

export const signin = wrapAsync((req, res) => {
  const { email, password } = req.body;
  // Perform authentication logic here
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!); // giải mã token, sẽ ra thông tin, bao gồm user , role, dùng để định danh. Khi xác thực định danh thì sẽ dùng thông tin này. Đúng định danh thì sẽ dùng data trong body.

  console.log(decoded); // This will log the decoded payload, which includes the email

  res.send({ message: "User signed in", data: { email, token } });
});
