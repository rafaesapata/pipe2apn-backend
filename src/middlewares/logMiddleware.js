const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[37m",
};

const color = {
  blue: (text) => `${colors.blue}${text}${colors.reset}`,
  cyan: (text) => `${colors.cyan}${text}${colors.reset}`,
  green: (text) => `${colors.green}${text}${colors.reset}`,
  yellow: (text) => `${colors.yellow}${text}${colors.reset}`,
  magenta: (text) => `${colors.magenta}${text}${colors.reset}`,
  red: (text) => `${colors.red}${text}${colors.reset}`,
  white: (text) => `${colors.white}${text}${colors.reset}`,
};

const LogMiddleware = async (req, res, next) => {
  req.start = Date.now();

  console.info(
    color.blue(
      `${new Date().toLocaleString()} - Request  : ${req.method} ${
        req.url
      }`
    )
  );
  res.on("finish", (data) => {
    const duration = Date.now() - req.start;
    const statusCode = res.statusCode;

    let statusColor;
    if (statusCode >= 100 && statusCode < 200) {
      statusColor = color.cyan;
    } else if (statusCode >= 200 && statusCode < 300) {
      statusColor = color.green;
    } else if (statusCode >= 300 && statusCode < 400) {
      statusColor = color.magenta;
    } else if (statusCode >= 400 && statusCode < 500) {
      statusColor = color.yellow;
    } else if (statusCode >= 500 && statusCode < 600) {
      statusColor = color.red;
    } else {
      statusColor = color.white;
    }

    console.info(
      statusColor(
        `${new Date().toLocaleString()} - Response : ${
          req.method
        } ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`
      )
    );
  });

  next();
};

export default LogMiddleware;
