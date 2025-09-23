const name = ["Qaizer Dhiwaqsha Alfazpoetro"];

export const sayHello = (req, res) => {
  res.status(200).json({
    message: `Hello, ${name}`,
  });
};
